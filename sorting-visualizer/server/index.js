const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || "0.0.0.0";

const MONGODB_URI = `${process.env.MONGODB_URI || ""}`.trim();
const MONGODB_DB = `${process.env.MONGODB_DB || "sorting_visualizer"}`.trim();
const MONGO_CONNECT_TIMEOUT_MS = Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 15000);

const dataDirectory = path.join(__dirname, "data");
const dataFile = path.join(dataDirectory, "results.json");

const ALGORITHMS = [
  "BubbleSort",
  "SelectionSort",
  "InsertionSort",
  "HeapSort",
  "MergeSort",
  "QuickSort",
];

let mongoClient = null;
let mongoCollections = null;

function isMongoEnabled() {
  return Boolean(mongoCollections);
}

function createEmptyDatabase() {
  return {
    users: [],
    sessions: [],
    results: [],
  };
}

function ensureDatabaseFile() {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(createEmptyDatabase(), null, 2), "utf8");
  }
}

function normalizeDatabaseShape(parsed) {
  if (Array.isArray(parsed)) {
    return {
      users: [],
      sessions: [],
      results: parsed,
    };
  }

  if (parsed && typeof parsed === "object") {
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      results: Array.isArray(parsed.results) ? parsed.results : [],
    };
  }

  return createEmptyDatabase();
}

function readDatabase() {
  ensureDatabaseFile();
  try {
    const text = fs.readFileSync(dataFile, "utf8");
    const parsed = JSON.parse(text);
    return normalizeDatabaseShape(parsed);
  } catch {
    return createEmptyDatabase();
  }
}

function writeDatabase(db) {
  ensureDatabaseFile();
  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2), "utf8");
}

function stripMongoInternalId(document) {
  if (!document || typeof document !== "object") {
    return null;
  }

  const { _id, ...rest } = document;
  return rest;
}

async function initializeStorage() {
  if (!MONGODB_URI) {
    ensureDatabaseFile();
    console.log("Storage mode: local JSON file");
    return;
  }

  let MongoClient;
  try {
    ({ MongoClient } = require("mongodb"));
  } catch {
    throw new Error("Missing mongodb package. Run npm install mongodb.");
  }

  mongoClient = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: MONGO_CONNECT_TIMEOUT_MS,
  });

  await mongoClient.connect();
  const db = mongoClient.db(MONGODB_DB);

  mongoCollections = {
    users: db.collection("users"),
    sessions: db.collection("sessions"),
    results: db.collection("results"),
  };

  await Promise.all([
    mongoCollections.users.createIndex({ id: 1 }, { unique: true }),
    mongoCollections.users.createIndex({ email: 1 }, { unique: true }),
    mongoCollections.users.createIndex({ googleId: 1 }, { unique: true, sparse: true }),
    mongoCollections.sessions.createIndex({ token: 1 }, { unique: true }),
    mongoCollections.sessions.createIndex({ userId: 1 }),
    mongoCollections.results.createIndex({ id: 1 }, { unique: true }),
    mongoCollections.results.createIndex({ userId: 1, createdAt: -1 }),
  ]);

  console.log(`Storage mode: MongoDB (${MONGODB_DB})`);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) {
        reject(new Error("Payload too large"));
      }
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON payload"));
      }
    });

    req.on("error", reject);
  });
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeEmail(email) {
  if (typeof email !== "string") {
    return "";
  }

  return email.trim().toLowerCase();
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, passwordHash) {
  if (typeof passwordHash !== "string" || !passwordHash.includes(":")) {
    return false;
  }

  const [salt, originalHash] = passwordHash.split(":");
  const candidateHash = crypto.scryptSync(password, salt, 64).toString("hex");

  const a = Buffer.from(originalHash, "hex");
  const b = Buffer.from(candidateHash, "hex");

  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider || (user.passwordHash ? "local" : "google"),
    picture: user.picture || "",
    createdAt: user.createdAt,
  };
}

function getAllowedGoogleClientIds() {
  return `${process.env.GOOGLE_CLIENT_IDS || process.env.GOOGLE_CLIENT_ID || ""}`
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function readJsonFromUrl(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let text = "";

      response.on("data", (chunk) => {
        text += chunk;
      });

      response.on("end", () => {
        if (response.statusCode && response.statusCode >= 400) {
          reject(new Error("Google token verification failed."));
          return;
        }

        try {
          resolve(JSON.parse(text));
        } catch {
          reject(new Error("Invalid response from Google token endpoint."));
        }
      });
    });

    request.setTimeout(10000, () => {
      request.destroy(new Error("Google verification timed out."));
    });

    request.on("error", (error) => {
      reject(error);
    });
  });
}

async function verifyGoogleCredential(credential) {
  const endpoint =
    "https://oauth2.googleapis.com/tokeninfo?id_token=" +
    encodeURIComponent(credential);
  const tokenInfo = await readJsonFromUrl(endpoint);

  if (tokenInfo.error) {
    throw new Error(tokenInfo.error_description || "Invalid Google token.");
  }

  const email = normalizeEmail(tokenInfo.email);
  const isEmailVerified =
    tokenInfo.email_verified === true || tokenInfo.email_verified === "true";
  const googleId = typeof tokenInfo.sub === "string" ? tokenInfo.sub : "";
  const name =
    typeof tokenInfo.name === "string" && tokenInfo.name.trim().length > 0
      ? tokenInfo.name.trim()
      : email.split("@")[0] || "Google User";
  const picture = typeof tokenInfo.picture === "string" ? tokenInfo.picture : "";

  if (!email || !googleId || !isEmailVerified) {
    throw new Error("Google account email is not verified.");
  }

  const allowedClientIds = getAllowedGoogleClientIds();
  if (
    allowedClientIds.length > 0 &&
    !allowedClientIds.includes(String(tokenInfo.aud || ""))
  ) {
    throw new Error("Google client mismatch. Check GOOGLE_CLIENT_ID.");
  }

  return {
    googleId,
    email,
    name,
    picture,
  };
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== "string") {
    return "";
  }

  if (!authHeader.startsWith("Bearer ")) {
    return "";
  }

  return authHeader.slice(7).trim();
}

function normalizeIds(ids) {
  if (!Array.isArray(ids)) {
    return [];
  }

  return ids
    .filter((value) => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function sanitizeResult(payload, userId) {
  const now = new Date().toISOString();
  const algorithm = typeof payload.algorithm === "string" ? payload.algorithm : "Unknown";
  const inputArray = Array.isArray(payload.inputArray) ? payload.inputArray.slice(0, 200) : [];
  const finalArray = Array.isArray(payload.finalArray) ? payload.finalArray.slice(0, 200) : [];

  return {
    id: createId("result"),
    userId,
    createdAt: payload.createdAt || now,
    algorithm,
    inputArray,
    finalArray,
    comparisons: Number(payload.comparisons || 0),
    swaps: Number(payload.swaps || 0),
    timeMs: Number(payload.timeMs || 0),
    complexity: payload.complexity || {},
    themeMode: payload.themeMode === "dark" ? "dark" : "light",
    aiExplanation: payload.aiExplanation || {},
  };
}

function buildUsageForResults(results) {
  const counts = {};

  for (const algorithm of ALGORITHMS) {
    counts[algorithm] = 0;
  }

  for (const item of results) {
    if (!counts[item.algorithm]) {
      counts[item.algorithm] = 0;
    }

    counts[item.algorithm] += 1;
  }

  const algorithms = Object.keys(counts).map((algorithm) => ({
    algorithm,
    count: counts[algorithm],
  }));

  const sorted = [...algorithms].sort((a, b) => b.count - a.count);
  const mostUsed = sorted[0] || { algorithm: "-", count: 0 };
  const notUsed = algorithms.filter((item) => item.count === 0).map((item) => item.algorithm);

  return {
    totalRuns: results.length,
    algorithms,
    mostUsed,
    notUsed,
  };
}

async function findUserByEmail(email) {
  if (isMongoEnabled()) {
    const user = await mongoCollections.users.findOne({ email });
    return stripMongoInternalId(user);
  }

  const db = readDatabase();
  return db.users.find((item) => item.email === email) || null;
}

async function findUserById(userId) {
  if (isMongoEnabled()) {
    const user = await mongoCollections.users.findOne({ id: userId });
    return stripMongoInternalId(user);
  }

  const db = readDatabase();
  return db.users.find((item) => item.id === userId) || null;
}

async function findUserByGoogleId(googleId) {
  if (!googleId) {
    return null;
  }

  if (isMongoEnabled()) {
    const user = await mongoCollections.users.findOne({ googleId });
    return stripMongoInternalId(user);
  }

  const db = readDatabase();
  return db.users.find((item) => item.googleId === googleId) || null;
}

async function insertUser(user) {
  if (isMongoEnabled()) {
    await mongoCollections.users.insertOne(user);
    return;
  }

  const db = readDatabase();
  db.users.push(user);
  writeDatabase(db);
}

async function updateUser(user) {
  if (isMongoEnabled()) {
    await mongoCollections.users.updateOne({ id: user.id }, { $set: user });
    return;
  }

  const db = readDatabase();
  const index = db.users.findIndex((item) => item.id === user.id);
  if (index >= 0) {
    db.users[index] = user;
    writeDatabase(db);
  }
}

async function insertSession(session) {
  if (isMongoEnabled()) {
    await mongoCollections.sessions.insertOne(session);
    return;
  }

  const db = readDatabase();
  db.sessions.push(session);
  writeDatabase(db);
}

async function findSessionByToken(token) {
  if (!token) {
    return null;
  }

  if (isMongoEnabled()) {
    const session = await mongoCollections.sessions.findOne({ token });
    return stripMongoInternalId(session);
  }

  const db = readDatabase();
  return db.sessions.find((item) => item.token === token) || null;
}

async function deleteSessionByToken(token) {
  if (!token) {
    return 0;
  }

  if (isMongoEnabled()) {
    const response = await mongoCollections.sessions.deleteOne({ token });
    return response.deletedCount || 0;
  }

  const db = readDatabase();
  const before = db.sessions.length;
  db.sessions = db.sessions.filter((item) => item.token !== token);
  writeDatabase(db);
  return before - db.sessions.length;
}

async function getResultsByUser(userId) {
  if (isMongoEnabled()) {
    const items = await mongoCollections.results
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    return items.map(stripMongoInternalId);
  }

  const db = readDatabase();
  return db.results
    .filter((item) => item.userId === userId)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

async function countResultsByUser(userId) {
  if (isMongoEnabled()) {
    return mongoCollections.results.countDocuments({ userId });
  }

  const db = readDatabase();
  return db.results.filter((item) => item.userId === userId).length;
}

async function insertResult(record) {
  if (isMongoEnabled()) {
    await mongoCollections.results.insertOne(record);
    return;
  }

  const db = readDatabase();
  db.results.unshift(record);

  const maxRows = 4000;
  if (db.results.length > maxRows) {
    db.results.length = maxRows;
  }

  writeDatabase(db);
}

async function deleteAllResultsByUser(userId) {
  if (isMongoEnabled()) {
    const response = await mongoCollections.results.deleteMany({ userId });
    return response.deletedCount || 0;
  }

  const db = readDatabase();
  const before = db.results.length;
  db.results = db.results.filter((item) => item.userId !== userId);
  writeDatabase(db);
  return before - db.results.length;
}

async function deleteResultsByIds(userId, ids) {
  if (isMongoEnabled()) {
    const response = await mongoCollections.results.deleteMany({
      userId,
      id: { $in: ids },
    });
    return response.deletedCount || 0;
  }

  const idSet = new Set(ids);
  const db = readDatabase();
  const before = db.results.length;

  db.results = db.results.filter((row) => {
    if (row.userId !== userId) {
      return true;
    }

    return !idSet.has(row.id);
  });

  writeDatabase(db);
  return before - db.results.length;
}

async function getAuthContext(req) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return null;
  }

  const session = await findSessionByToken(token);
  if (!session) {
    return null;
  }

  const user = await findUserById(session.userId);
  if (!user) {
    return null;
  }

  return { token, session, user };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      service: "sorting-results-db",
      storage: isMongoEnabled() ? "mongodb" : "json-file",
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/signup") {
    try {
      const body = await parseBody(req);
      const name = typeof body.name === "string" ? body.name.trim() : "";
      const email = normalizeEmail(body.email);
      const password = typeof body.password === "string" ? body.password : "";

      if (!name || !email || password.length < 6) {
        sendJson(res, 400, {
          ok: false,
          error: "Provide valid name, email, and password (min 6 chars).",
        });
        return;
      }

      const alreadyExists = await findUserByEmail(email);
      if (alreadyExists) {
        sendJson(res, 409, { ok: false, error: "Email already exists." });
        return;
      }

      const user = {
        id: createId("user"),
        name,
        email,
        passwordHash: hashPassword(password),
        provider: "local",
        picture: "",
        createdAt: new Date().toISOString(),
      };

      const token = generateToken();
      const session = {
        token,
        userId: user.id,
        createdAt: new Date().toISOString(),
      };

      await insertUser(user);
      await insertSession(session);

      sendJson(res, 201, { ok: true, token, user: sanitizeUser(user) });
      return;
    } catch (error) {
      if (error && error.code === 11000) {
        sendJson(res, 409, { ok: false, error: "Email already exists." });
        return;
      }

      sendJson(res, 400, { ok: false, error: error.message || "Bad Request" });
      return;
    }
  }

  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    try {
      const body = await parseBody(req);
      const email = normalizeEmail(body.email);
      const password = typeof body.password === "string" ? body.password : "";

      const user = await findUserByEmail(email);
      if (!user) {
        sendJson(res, 401, { ok: false, error: "Invalid credentials." });
        return;
      }

      if (!user.passwordHash) {
        sendJson(res, 400, {
          ok: false,
          error: "This account uses Google login. Continue with Google.",
        });
        return;
      }

      if (!verifyPassword(password, user.passwordHash)) {
        sendJson(res, 401, { ok: false, error: "Invalid credentials." });
        return;
      }

      const token = generateToken();
      const session = {
        token,
        userId: user.id,
        createdAt: new Date().toISOString(),
      };

      await insertSession(session);

      sendJson(res, 200, { ok: true, token, user: sanitizeUser(user) });
      return;
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message || "Bad Request" });
      return;
    }
  }

  if (req.method === "POST" && url.pathname === "/api/auth/google") {
    try {
      const body = await parseBody(req);
      const credential =
        typeof body.credential === "string" ? body.credential.trim() : "";

      if (!credential) {
        sendJson(res, 400, {
          ok: false,
          error: "Missing Google credential.",
        });
        return;
      }

      const googleProfile = await verifyGoogleCredential(credential);
      let user = await findUserByGoogleId(googleProfile.googleId);
      if (!user) {
        user = await findUserByEmail(googleProfile.email);
      }

      if (!user) {
        user = {
          id: createId("user"),
          name: googleProfile.name,
          email: googleProfile.email,
          passwordHash: "",
          provider: "google",
          googleId: googleProfile.googleId,
          picture: googleProfile.picture,
          createdAt: new Date().toISOString(),
        };

        await insertUser(user);
      } else {
        user.name = user.name || googleProfile.name;
        user.provider = user.passwordHash ? "hybrid" : "google";
        user.googleId = user.googleId || googleProfile.googleId;
        user.picture = googleProfile.picture || user.picture || "";
        await updateUser(user);
      }

      const token = generateToken();
      const session = {
        token,
        userId: user.id,
        createdAt: new Date().toISOString(),
      };

      await insertSession(session);

      sendJson(res, 200, {
        ok: true,
        token,
        user: sanitizeUser(user),
      });
      return;
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error.message || "Google authentication failed.",
      });
      return;
    }
  }

  if (req.method === "POST" && url.pathname === "/api/auth/logout") {
    const token = getTokenFromRequest(req);

    if (!token) {
      sendJson(res, 200, { ok: true });
      return;
    }

    await deleteSessionByToken(token);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/auth/me") {
    const auth = await getAuthContext(req);

    if (!auth) {
      sendJson(res, 401, { ok: false, error: "Unauthorized" });
      return;
    }

    sendJson(res, 200, { ok: true, user: sanitizeUser(auth.user) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/usage") {
    const auth = await getAuthContext(req);

    if (!auth) {
      sendJson(res, 401, { ok: false, error: "Unauthorized" });
      return;
    }

    const results = await getResultsByUser(auth.user.id);
    const usage = buildUsageForResults(results);
    sendJson(res, 200, { ok: true, usage });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/results") {
    const auth = await getAuthContext(req);

    if (!auth) {
      sendJson(res, 401, { ok: false, error: "Unauthorized" });
      return;
    }

    const results = await getResultsByUser(auth.user.id);
    sendJson(res, 200, { count: results.length, results });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/results") {
    try {
      const auth = await getAuthContext(req);

      if (!auth) {
        sendJson(res, 401, { ok: false, error: "Unauthorized" });
        return;
      }

      const body = await parseBody(req);
      const record = sanitizeResult(body, auth.user.id);
      await insertResult(record);

      sendJson(res, 201, { ok: true, record });
      return;
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message || "Bad Request" });
      return;
    }
  }

  if (req.method === "DELETE" && url.pathname === "/api/results/clear") {
    const auth = await getAuthContext(req);

    if (!auth) {
      sendJson(res, 401, { ok: false, error: "Unauthorized" });
      return;
    }

    const deletedCount = await deleteAllResultsByUser(auth.user.id);
    const remainingCount = await countResultsByUser(auth.user.id);

    sendJson(res, 200, { ok: true, deletedCount, count: remainingCount });
    return;
  }

  if (req.method === "DELETE" && url.pathname === "/api/results") {
    try {
      const auth = await getAuthContext(req);

      if (!auth) {
        sendJson(res, 401, { ok: false, error: "Unauthorized" });
        return;
      }

      const body = await parseBody(req);
      const ids = normalizeIds(body?.ids);

      if (ids.length === 0) {
        sendJson(res, 400, {
          ok: false,
          error: "Provide at least one valid id in ids[]",
        });
        return;
      }

      const deletedCount = await deleteResultsByIds(auth.user.id, ids);
      const remainingCount = await countResultsByUser(auth.user.id);

      sendJson(res, 200, {
        ok: true,
        deletedCount,
        count: remainingCount,
      });
      return;
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message || "Bad Request" });
      return;
    }
  }

  sendJson(res, 404, { ok: false, error: "Not Found" });
});

async function startServer() {
  try {
    await initializeStorage();

    server.listen(PORT, HOST, () => {
      console.log(`Sorting backend running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message || error);
    process.exit(1);
  }
}

startServer();