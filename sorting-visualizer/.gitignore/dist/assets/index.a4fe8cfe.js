import{c as e,d as t,u as r,D as n,a,b as o,T as i,I as l,M as s,e as c,C as d,f as u,g as p,h as m,i as g,j as f,k as y,F as x,l as h,B as b,s as v,S as w,A as E,m as S,n as k,q as C,o as $,p as A,V as T,r as I,t as M,W as R,v as O,w as W}from"./vendor.dff25ed0.js";!function(e=".",t="__import__"){try{self[t]=new Function("u","return import(u)")}catch(r){const n=new URL(e,location),a=e=>{URL.revokeObjectURL(e.src),e.remove()};self[t]=e=>new Promise(((r,o)=>{const i=new URL(e,n);if(self[t].moduleMap[i])return r(self[t].moduleMap[i]);const l=new Blob([`import * as m from '${i}';`,`${t}.moduleMap['${i}']=m;`],{type:"text/javascript"}),s=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(l),onerror(){o(new Error(`Failed to import: ${e}`)),a(s)},onload(){r(self[t].moduleMap[i]),a(s)}});document.head.appendChild(s)})),self[t].moduleMap={}}}("/assets/");function B(e){return new Promise((t=>setTimeout(t,e)))}function z(e=0,t=999){return e+Math.floor(Math.random()*t)}async function*L(e,t,r,n){for(let o=0;o<e.length;o++){for(var a=0;a<e.length-o-1;a++)yield await r([a,a+1]),e[a]>e[a+1]&&(yield await t(a,a+1));n(a),yield}}async function*j(e,t,r,n){for(let o=0;o<e.length;o++){let i=0;for(var a=0;a<e.length-o;a++)yield await r([i,a]),e[i]<e[a]&&(i=a);i!==(a-=1)&&e[i]!==e[a]&&(yield await t(i,a)),n(a),yield}}async function*N(e,t,r,n){for(let o=0;o<e.length;o++){let i=o;for(var a=o-1;a>=0;a--){if(yield await r([i,a]),!(e[a]>e[i])){yield;break}yield await t(a,i),i=a}n(o),yield}}async function*P(e,t,r,n,a=0,o=e.length-1){if(a<=o){let i=yield*await async function*(e,a,o){let i=a,l=a,s=o+1;for(;l<s;){for(;--s>a&&(yield await r([l,s],i),!(e[s]<e[i])););for(;l<=o&&l<s&&(yield await r([l],i),!(e[++l]>e[i])););l<s&&(yield await t(l,s))}i!==s&&(yield await t(i,s));return n(s),yield,s}(e,a,o);yield*await P(e,t,r,n,a,i-1),yield*await P(e,t,r,n,i+1,o)}}async function*D(e,t,r,n){let a=e.length;for(let i=Math.floor(a/2)-1;i>=0;i--)yield*await o(i);for(let i=e.length-1;i>0;i--)a--,n(a),yield await t(0,i),yield*await o(0);async function*o(n){const i=2*n+1,l=2*n+2;let s=n;const c=[];i<a&&c.push(i),l<a&&c.push(l),yield await r(c,n),i<a&&e[i]>e[s]&&(s=i),l<a&&e[l]>e[s]&&(s=l),s!==n&&(yield await t(n,s),yield*await o(s))}n(0)}async function*U(e,t,r,n,a=0,o=!0){if(1===e.length)return o&&n(0),e;const i=Math.floor(e.length/2),l=e.slice(0,i),s=e.slice(i);return yield*await async function*(e,n,a,o,i=!1,l){let s=[],c=0,d=0;for(;c<e.length&&d<n.length;)e[c]<=n[d]?(yield await r([a+c+d,o+d]),yield await t(a+c+d,a+s.length),i&&(yield await l(a+s.length)),s.push(e[c]),c++):(yield await r([a+c+d,o+d]),yield await t(o+d,a+s.length),i&&(yield await l(a+s.length)),s.push(n[d]),d++);for(;c<e.length;)yield await r([a+c+d]),i&&(yield await l(a+c+d)),s.push(e[c]),c++;for(;d<n.length;)yield await r([a+c+d]),i&&(yield await l(a+c+d)),s.push(n[d]),d++;return s}(yield*await U(l,t,r,n,a,!1),yield*await U(s,t,r,n,a+i,!1),a,a+i,o,n)}let G=function(){const e=window.innerWidth;if(e<460)return[4,3,2,1];if(e<720)return[8,7,6,5,4,3,2,1];return[12,11,10,9,8,7,6,5,4,3,2,1]}();const _=[{component:L,title:"Bubble",name:"BubbleSort"},{component:j,title:"Selection",name:"SelectionSort"},{component:N,title:"Insertion",name:"InsertionSort"},{component:D,title:"Heap",name:"HeapSort"},{component:U,title:"Merge",name:"MergeSort"},{component:P,title:"Quick",name:"QuickSort"}];function F(){if("undefined"==typeof window)return"light";const e=window.localStorage.getItem("sorting_visualizer_theme");return"light"===e||"dark"===e?e:window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function H(e){"undefined"!=typeof window&&window.localStorage.setItem("sorting_visualizer_theme",e)}const Q=e(t((e=>({algorithm:0,sortingArray:G,setSortingArray:t=>e({sortingArray:t}),setAlgorithm:t=>e({algorithm:t})})))),q=e(t((e=>({progress:"reset",speed:3,compareTime:500,swapTime:1e3,doneCount:0,themeMode:F(),startSorting:()=>e({progress:"start"}),pauseSorting:()=>e({progress:"pause"}),resetSorting:()=>e({progress:"reset",doneCount:0}),markSortngDone:()=>e((e=>Q.getState().algorithm===_.length?e.doneCount===_.length-1?{doneCount:0,progress:"done"}:{doneCount:e.doneCount+1}:{progress:"done"})),setSpeed:t=>e((()=>({swapTime:3e3/t,compareTime:1500/t,speed:t}))),setThemeMode:t=>e((()=>(H(t),{themeMode:t}))),toggleThemeMode:()=>e((e=>{const t="dark"===e.themeMode?"light":"dark";return H(t),{themeMode:t}}))})))),V=["BubbleSort","SelectionSort","InsertionSort","HeapSort","MergeSort","QuickSort"],J={BubbleSort:L,SelectionSort:j,InsertionSort:N,HeapSort:D,MergeSort:U,QuickSort:P},Y={BubbleSort:["Start at the beginning of the array and compare neighboring values.","Swap neighbors when they are in the wrong order.","After each pass, the largest unsorted value moves to its final position.","Repeat passes until no swaps are needed."],SelectionSort:["Scan the unsorted part to find the smallest value.","Place that value at the next sorted position at the front.","Shrink the unsorted part and repeat.","Continue until the whole array is sorted."],InsertionSort:["Treat the first element as already sorted.","Pick the next element and compare it with previous sorted elements.","Shift larger elements one step right to make room.","Insert the picked element at its correct position."],HeapSort:["Build a max heap so the largest value is at the root.","Swap the root with the last unsorted element.","Reduce heap size and restore heap property.","Repeat until all elements are extracted in sorted order."],MergeSort:["Split the array into smaller halves recursively.","Continue splitting until each part has one element.","Merge parts back while always taking the smaller front element.","Keep merging until one fully sorted array is formed."],QuickSort:["Pick a pivot element from the current range.","Partition elements so smaller values go left and larger values go right.","Pivot lands at its final sorted position.","Recursively quicksort left and right partitions."],All:["Select one tab to view one algorithm in detail.","Use AI recommendation to choose the best algorithm for your input."]},K={BubbleSort:{best:"O(n)",average:"O(n^2)",worst:"O(n^2)",space:"O(1)"},SelectionSort:{best:"O(n^2)",average:"O(n^2)",worst:"O(n^2)",space:"O(1)"},InsertionSort:{best:"O(n)",average:"O(n^2)",worst:"O(n^2)",space:"O(1)"},HeapSort:{best:"O(n log n)",average:"O(n log n)",worst:"O(n log n)",space:"O(1)"},MergeSort:{best:"O(n log n)",average:"O(n log n)",worst:"O(n log n)",space:"O(n)"},QuickSort:{best:"O(n log n)",average:"O(n log n)",worst:"O(n^2)",space:"O(log n)"},All:{best:"-",average:"-",worst:"-",space:"-"}};function X(e,t,r){return Math.max(t,Math.min(r,e))}function Z(e,t){return Number.isInteger(e)&&e>=0&&e<t}function ee(e){return`[${e.join(", ")}]`}function te(e,t){return e&&"All"!==e?e:t||"QuickSort"}function re(e){return Y[e]||Y.All}function ne(e){return K[e]||K.All}function ae({selectedAlgorithm:e,array:t}){const r=e||"All",n=function(e){const t=Array.isArray(e)?e:[],r=t.length;if(r<=1)return{n:r,isNearlySorted:!0,inversionRatioEstimate:0,duplicateRatio:0,valueRange:0};let n=0;const a=r*(r-1)/2,o=new Set(t);for(let u=0;u<r-1;u+=1)for(let e=u+1;e<r;e+=1)t[u]>t[e]&&(n+=1);const i=0===a?0:n/a,l=t.slice(1).reduce(((e,r,n)=>t[n]>r?e+1:e),0),s=i<=.15||l/(r-1)<=.2,c=0===r?0:1-o.size/r,d=Math.min(...t);return{n:r,isNearlySorted:s,inversionRatioEstimate:i,duplicateRatio:c,valueRange:Math.max(...t)-d}}(t),a=function(e){const{n:t=0,isNearlySorted:r=!1,duplicateRatio:n=0,inversionRatioEstimate:a=0}=e||{};if(t<=1)return{name:"InsertionSort",reason:"Array is already sorted or has one element, so a simple in-place approach is enough.",scoreMap:{}};const o={BubbleSort:-100,SelectionSort:-100,InsertionSort:0,HeapSort:0,MergeSort:0,QuickSort:0},i=[];return t<=12&&r&&(o.InsertionSort+=80,i.push("Small and nearly sorted input favors InsertionSort due to low constant overhead.")),n>=.5&&(o.QuickSort-=30,o.MergeSort+=20,o.HeapSort+=15,i.push("High duplicate density can hurt pivot quality in basic QuickSort, so Merge/Heap are safer.")),t>=40&&!r&&(o.MergeSort+=50,o.HeapSort+=25,i.push("Large unsorted input benefits from predictable O(n log n) behavior.")),t>=13&&t<40&&!r&&(o.QuickSort+=25,i.push("Medium random input often performs well with QuickSort.")),a<.08&&(o.InsertionSort+=20),t<=8&&(o.BubbleSort=-5,o.SelectionSort=-5,i.push("Very tiny inputs can tolerate simpler educational algorithms, but faster choices are still preferred.")),o.QuickSort+=10,o.MergeSort+=5,{name:V.slice().sort(((e,t)=>o[t]-o[e]))[0]||"QuickSort",reason:i[0]||"General-purpose fallback picks QuickSort for medium random input.",scoreMap:o}}(n),o=a.name,i=ne(r),l=ne(o);return{selected:r,recommended:o,rationale:[a.reason,`Input size: ${n.n}`,"Nearly sorted: "+(n.isNearlySorted?"Yes":"No"),`Duplicate ratio: ${Math.round(100*n.duplicateRatio)}%`,`Inversion estimate: ${Math.round(100*n.inversionRatioEstimate)}%`],selectedSteps:re(r),recommendedSteps:re(o),complexityTable:[{algorithm:r,...i,label:"Selected"},{algorithm:o,...l,label:"Recommended"}],traceAlgorithm:te(r,o),features:{...n,duplicateRatio:X(n.duplicateRatio,0,1),inversionRatioEstimate:X(n.inversionRatioEstimate,0,1)}}}async function oe({algorithmName:e,array:t,maxTraceLines:r=500}){const n=J[e]||P,a=J[e]?e:"QuickSort",o=Array.isArray(t)?[...t]:[],i=[];let l=0,s=0,c=0,d=!1;function u(e){i.length<r?i.push(e):d=!0}async function p(e=[],t=-1){const r=Array.isArray(e)?e.filter((e=>Z(e,o.length))):[];if(r.length>=2){const e=r[0],t=r[1];return l+=1,void u(`Compare index ${e} (${o[e]}) with index ${t} (${o[t]}).`)}if(1===r.length&&Z(t,o.length)){const e=r[0];return l+=1,void u(`Compare index ${e} (${o[e]}) with pivot index ${t} (${o[t]}).`)}if(1===r.length){const e=r[0];u(`Inspect index ${e} (${o[e]}).`)}}function m(){}try{const e=n(o,"MergeSort"===a?async function(e,t){if(!Z(e,o.length)||!Z(t,o.length))return;if(e===t)return;const r=o[e];!function(e,t,r){if(!Z(t,e.length)||!Z(r,e.length))return;const[n]=e.splice(t,1);e.splice(r,0,n)}(o,e,t),c+=1,u(`Move value ${r} from index ${e} to index ${t} -> ${ee(o)}.`)}:async function(e,t){if(!Z(e,o.length)||!Z(t,o.length))return;const r=o[e],n=o[t];o[e]=n,o[t]=r,s+=1,u(`Swap index ${e} (${r}) with index ${t} (${n}) -> ${ee(o)}.`)},p,m);let t=await e.next(),r=0;const i=5e5;for(;!t.done&&!d;)if(t=await e.next(),r+=1,r>i){d=!0,u("Trace stopped because it became too long.");break}}catch(g){return{algorithm:a,lines:[`Could not generate trace: ${(null==g?void 0:g.message)||"Unexpected error"}`],comparisonCount:l,swapCount:s,moveCount:c,truncated:!0,finalArray:o}}return 0===i.length&&i.push("No comparison steps were generated for this input."),d&&i.push("Trace truncated to keep the popup responsive."),{algorithm:a,lines:i,comparisonCount:l,swapCount:s,moveCount:c,truncated:d,finalArray:o}}function ie(e){return e?{borderRadius:0,overflow:"hidden",boxShadow:"none"}:{borderRadius:"14px",overflow:"hidden",boxShadow:"0 22px 55px rgba(12, 49, 137, 0.28)"}}function le(e){return{display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--dialog-title-gradient)",color:"#fff",margin:e?"-16px -16px":"-16px -24px",padding:e?"14px 16px":"16px 24px"}}function se(e){return{border:"1px solid var(--dialog-card-border)",borderRadius:"10px",background:"var(--dialog-card-bg)",padding:e?"10px":"14px"}}const ce={fontWeight:700,marginBottom:"8px",color:"var(--text-primary)"},de={display:"inline-block",padding:"4px 10px",background:"var(--dialog-metric-bg)",border:"1px solid var(--dialog-metric-border)",borderRadius:"999px",fontSize:"0.82rem",fontWeight:600,color:"var(--text-primary)"};function ue(e){return{maxHeight:e?"220px":"280px",overflowY:"auto",border:"1px solid var(--dialog-trace-border)",borderRadius:"8px",background:"var(--dialog-trace-bg)",padding:"10px"}}const pe={marginTop:"10px",background:"var(--dialog-final-bg)",color:"var(--dialog-final-text)",borderRadius:"6px",padding:"8px 10px",fontFamily:"Consolas, Menlo, monospace",fontSize:"0.85rem",wordBreak:"break-word"},me={marginTop:"8px",borderRadius:"8px",padding:"10px 12px",border:"1px solid var(--dialog-metric-border)",background:"var(--dialog-trace-bg)"};function ge({open:e,onClose:t,selectedAlgorithm:x,array:h}){const b=r("(max-width: 768px)"),v=n.useMemo((()=>ae({selectedAlgorithm:x,array:h})),[x,h]),[w,E]=n.useState({loading:!1,algorithm:v.traceAlgorithm,lines:[],comparisonCount:0,swapCount:0,moveCount:0,truncated:!1,finalArray:[]});return n.useEffect((()=>{let t=!1;return async function(){if(!e)return;E((e=>({...e,loading:!0,algorithm:v.traceAlgorithm,lines:[]})));const r=await oe({algorithmName:v.traceAlgorithm,array:h});t||E({loading:!1,...r})}(),()=>{t=!0}}),[e,v.traceAlgorithm,h]),n.createElement(a,{open:e,onClose:t,fullWidth:!0,fullScreen:b,maxWidth:!b&&"md","aria-labelledby":"ai-suggestion-title",PaperProps:{style:ie(b)}},n.createElement(o,{id:"ai-suggestion-title",disableTypography:!0},n.createElement("div",{style:le(b)},n.createElement(i,{variant:b?"h5":"h6",style:{color:"#fff",fontWeight:700}},"AI Suggestion"),n.createElement(l,{"aria-label":"close",onClick:t,style:{color:"#fff"}},n.createElement(s,null)))),n.createElement(c,{dividers:!0,style:{background:"var(--dialog-surface-bg)",padding:b?"12px":"24px"}},n.createElement("div",{style:se(b)},n.createElement(i,{variant:"subtitle1",style:ce},"Step-by-Step Trace (",w.algorithm,")"),n.createElement(i,{variant:"body2",style:{marginBottom:10,color:"var(--text-secondary)"}},"Each line below describes exactly what happens to your current array."),w.loading?n.createElement("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginTop:8}},n.createElement(d,{size:20}),n.createElement(i,{variant:"body2",style:{color:"var(--text-secondary)"}},"Generating detailed trace...")):n.createElement(n.Fragment,null,n.createElement("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:10}},n.createElement("span",{style:de},"Comparisons: ",w.comparisonCount),n.createElement("span",{style:de},"Swaps: ",w.swapCount),n.createElement("span",{style:de},"Moves: ",w.moveCount)),n.createElement("div",{style:ue(b)},n.createElement("ol",{style:{margin:0,paddingLeft:"20px"}},w.lines.map(((e,t)=>n.createElement("li",{key:`${e}-${t}`,style:{marginBottom:8}},n.createElement(i,{variant:"body2",style:{color:"var(--text-primary)",wordBreak:"break-word"}},e)))))),n.createElement("div",{style:pe},"Final order: [",w.finalArray.join(", "),"]"))),n.createElement(u,{style:{margin:"14px 0"}}),n.createElement("div",{style:se(b)},n.createElement(i,{variant:"subtitle1",style:ce},"AI Recommended Algorithm"),n.createElement("div",{style:me},n.createElement(i,{variant:"body1",style:{fontWeight:700,color:"var(--text-primary)"}},v.recommended))),n.createElement(u,{style:{margin:"14px 0"}}),n.createElement("div",{style:se(b)},n.createElement(i,{variant:"subtitle1",style:ce},"Why This Recommendation"),n.createElement("ul",{style:{marginTop:8,marginBottom:0,paddingLeft:b?"18px":"24px"}},v.rationale.map((e=>n.createElement("li",{key:e,style:{marginBottom:6}},n.createElement(i,{variant:"body2",style:{color:"var(--text-primary)",wordBreak:"break-word"}},e)))))),n.createElement(u,{style:{margin:"14px 0"}}),n.createElement("div",{style:se(b)},n.createElement(i,{variant:"subtitle1",style:ce},"Complexity Comparison"),n.createElement("div",{style:{overflowX:"auto",WebkitOverflowScrolling:"touch",marginTop:6}},n.createElement(p,{size:"small",style:{minWidth:560}},n.createElement(m,null,n.createElement(g,{style:{background:"var(--dialog-table-head)"}},n.createElement(f,{style:{whiteSpace:"nowrap"}},"Role"),n.createElement(f,{style:{whiteSpace:"nowrap"}},"Algorithm"),n.createElement(f,{style:{whiteSpace:"nowrap"}},"Best"),n.createElement(f,{style:{whiteSpace:"nowrap"}},"Average"),n.createElement(f,{style:{whiteSpace:"nowrap"}},"Worst"),n.createElement(f,{style:{whiteSpace:"nowrap"}},"Space"))),n.createElement(y,null,v.complexityTable.map((e=>n.createElement(g,{key:`${e.label}-${e.algorithm}`},n.createElement(f,{style:{whiteSpace:"nowrap"}},e.label),n.createElement(f,{style:{whiteSpace:"nowrap"}},e.algorithm),n.createElement(f,{style:{whiteSpace:"nowrap"}},e.best),n.createElement(f,{style:{whiteSpace:"nowrap"}},e.average),n.createElement(f,{style:{whiteSpace:"nowrap"}},e.worst),n.createElement(f,{style:{whiteSpace:"nowrap"}},e.space))))))))))}const fe="https://sorting-visualizer-ai-backend.onrender.com".trim()||"",ye="sorting_visualizer_auth_token";function xe(){return"undefined"==typeof window?"":window.localStorage.getItem(ye)||""}function he(e){"undefined"!=typeof window&&window.localStorage.setItem(ye,e)}async function be(e,t={}){const r=!1!==t.attachAuth,n=xe(),a=fe?`${fe}${e}`:e,o={"Content-Type":"application/json",...t.headers||{}};r&&n&&(o.Authorization=`Bearer ${n}`);const i=await fetch(a,{...t,headers:o});let l=null;try{l=await i.json()}catch(s){l=null}if(!i.ok){const e=new Error((null==l?void 0:l.error)||"API request failed");throw e.status=i.status,e}return l}function ve(){"undefined"!=typeof window&&window.dispatchEvent(new Event("usage-updated"))}const we={borderRadius:"14px",overflow:"hidden",boxShadow:"0 22px 55px rgba(12, 49, 137, 0.28)"},Ee={display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--dialog-title-gradient)",color:"#fff",margin:"-16px -24px",padding:"16px 24px"},Se={display:"flex",flexDirection:"column",gap:"10px",maxHeight:"62vh",overflowY:"auto"},ke={border:"1px solid var(--dialog-card-border)",borderRadius:"10px",background:"var(--dialog-card-bg)",padding:"12px"},Ce={display:"inline-flex",alignItems:"center",padding:"4px 10px",background:"var(--dialog-metric-bg)",border:"1px solid var(--dialog-metric-border)",borderRadius:"999px",fontSize:"0.82rem",fontWeight:700,color:"var(--text-primary)"};function $e(e){if(!Array.isArray(e)||0===e.length)return"[]";if(e.length<=18)return`[${e.join(", ")}]`;return`[${e.slice(0,18).join(", ")}, ...]`}function Ae({open:e,onClose:t}){const[r,p]=n.useState(!1),[m,g]=n.useState(""),[f,y]=n.useState([]),[v,w]=n.useState([]),E=n.useMemo((()=>f.map((e=>null==e?void 0:e.id)).filter((e=>"string"==typeof e&&e.trim().length>0))),[f]),S=E.length>0&&v.length===E.length,k=v.length>0&&v.length<E.length;function C(e){y(e),w((t=>{const r=new Set(e.map((e=>null==e?void 0:e.id)).filter((e=>"string"==typeof e&&e.trim().length>0)));return t.filter((e=>r.has(e)))}))}async function $(){const e=await async function(){return be("/api/results",{method:"GET"})}();C(Array.isArray(null==e?void 0:e.results)?e.results:[])}async function A(){p(!0),g("");try{await $()}catch(e){g((null==e?void 0:e.message)||"Could not load saved results. Ensure backend is running.")}finally{p(!1)}}return n.useEffect((()=>{e&&A()}),[e]),n.createElement(a,{open:e,onClose:t,fullWidth:!0,maxWidth:"md","aria-labelledby":"saved-results-title",PaperProps:{style:we}},n.createElement(o,{id:"saved-results-title",disableTypography:!0},n.createElement("div",{style:Ee},n.createElement(i,{variant:"h6",style:{color:"#fff",fontWeight:700}},"Saved Sorting Results"),n.createElement(l,{"aria-label":"close",onClick:t,style:{color:"#fff"}},n.createElement(s,null)))),n.createElement(c,{dividers:!0,style:{background:"var(--dialog-surface-bg)"}},n.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"10px",flexWrap:"wrap",marginBottom:"10px"}},n.createElement(i,{variant:"body2",style:{color:"var(--text-secondary)",fontWeight:700}},"Stored records: ",f.length),n.createElement("div",{style:{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}},n.createElement(x,{style:{margin:0},control:n.createElement(h,{color:"primary",checked:S,indeterminate:k,onChange:function(){w(S?[]:E)},disabled:r||0===E.length}),label:n.createElement(i,{variant:"body2",style:{color:"var(--text-secondary)",fontWeight:700}},"Select All")}),n.createElement(b,{onClick:A,variant:"outlined",color:"primary",disabled:r},"Refresh"),n.createElement(b,{onClick:async function(){if(0===v.length)return;if(window.confirm(`Delete ${v.length} selected record(s)?`)){p(!0),g("");try{await async function(e){const t=await be("/api/results",{method:"DELETE",body:JSON.stringify({ids:e})});return ve(),t}(v),await $(),w([])}catch(e){g((null==e?void 0:e.message)||"Could not delete selected records.")}finally{p(!1)}}},variant:"contained",color:"secondary",disabled:r||0===v.length},"Delete Selected"),n.createElement(b,{onClick:async function(){if(0===f.length)return;if(window.confirm(`Delete all ${f.length} saved record(s)?`)){p(!0),g("");try{await async function(){const e=await be("/api/results/clear",{method:"DELETE"});return ve(),e}(),C([]),w([])}catch(e){g((null==e?void 0:e.message)||"Could not delete all records.")}finally{p(!1)}}},variant:"outlined",color:"secondary",disabled:r||0===f.length},"Delete All"))),n.createElement(u,{style:{marginBottom:"12px"}}),r?n.createElement("div",{style:{display:"flex",alignItems:"center",gap:"10px"}},n.createElement(d,{size:22}),n.createElement(i,{variant:"body2",style:{color:"var(--text-secondary)"}},"Loading saved records...")):null,!r&&m?n.createElement("div",{style:{...ke,borderColor:"#d66"}},n.createElement(i,{variant:"body2",style:{color:"#ff7a7a",fontWeight:700}},m)):null,r||m||0!==f.length?null:n.createElement("div",{style:ke},n.createElement(i,{variant:"body2",style:{color:"var(--text-secondary)"}},"No saved data yet. Run a sort to store records.")),!r&&!m&&f.length>0?n.createElement("div",{style:Se},f.map(((e,t)=>{var a,o,l,s,c,d;const u=function(e,t){return"string"==typeof(null==e?void 0:e.id)&&e.id.trim().length>0?e.id:`no-id-${t}`}(e,t),p=!u.startsWith("no-id-");return n.createElement("div",{key:u,style:ke},n.createElement("div",{style:{display:"flex",justifyContent:"space-between",gap:"8px",flexWrap:"wrap",alignItems:"center"}},n.createElement("div",{style:{display:"flex",alignItems:"center",gap:"6px"}},n.createElement(h,{color:"primary",checked:p&&v.includes(u),onChange:()=>{var e;(e=p?u:"")&&w((t=>t.includes(e)?t.filter((t=>t!==e)):[...t,e]))},disabled:!p||r,style:{padding:"4px"}}),n.createElement(i,{variant:"subtitle1",style:{color:"var(--text-primary)",fontWeight:700}},e.algorithm)),n.createElement(i,{variant:"caption",style:{color:"var(--text-muted)"}},function(e){const t=new Date(e);return Number.isNaN(t.getTime())?"Unknown time":t.toLocaleString()}(e.createdAt))),n.createElement("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap",marginTop:"8px"}},n.createElement("span",{style:Ce},"Comparisons: ",e.comparisons),n.createElement("span",{style:Ce},"Swaps: ",e.swaps),n.createElement("span",{style:Ce},"Time: ",e.timeMs," ms"),n.createElement("span",{style:Ce},"Theme: ",e.themeMode)),n.createElement(i,{variant:"body2",style:{color:"var(--text-secondary)",marginTop:"8px"}},"Complexity: best ",(null==(a=null==e?void 0:e.complexity)?void 0:a.best)||"-",", avg ",(null==(o=null==e?void 0:e.complexity)?void 0:o.average)||"-",", worst ",(null==(l=null==e?void 0:e.complexity)?void 0:l.worst)||"-",", space ",(null==(s=null==e?void 0:e.complexity)?void 0:s.space)||"-"),n.createElement(i,{variant:"body2",style:{color:"var(--text-secondary)",marginTop:"4px"}},"AI Recommended: ",n.createElement("strong",null,(null==(c=null==e?void 0:e.aiExplanation)?void 0:c.recommendedAlgorithm)||"-")),n.createElement("details",{style:{marginTop:"8px"}},n.createElement("summary",{style:{cursor:"pointer",color:"var(--text-primary)",fontWeight:700}},"View Input / Output / Trace"),n.createElement(i,{variant:"body2",style:{marginTop:"8px",color:"var(--text-secondary)",fontFamily:"Consolas, monospace"}},"Input: ",$e(e.inputArray)),n.createElement(i,{variant:"body2",style:{marginTop:"4px",color:"var(--text-secondary)",fontFamily:"Consolas, monospace"}},"Final: ",$e(e.finalArray)),n.createElement(i,{variant:"body2",style:{marginTop:"6px",color:"var(--text-secondary)"}},"Trace preview:"),n.createElement("ol",{style:{marginTop:"6px",marginBottom:0,paddingLeft:"20px"}},((null==(d=null==e?void 0:e.aiExplanation)?void 0:d.traceLines)||[]).slice(0,6).map(((e,t)=>n.createElement("li",{key:`${u}-${t}`},n.createElement(i,{variant:"body2",style:{color:"var(--text-primary)"}},e)))))))}))):null))}function Te(e){return{id:`scrollable-auto-tab-${e}`}}const Ie={background:"var(--accent-gradient)",color:"#ffffff",borderRadius:"999px",padding:"8px 18px",fontWeight:700,textTransform:"none",letterSpacing:"0.2px",boxShadow:"0 10px 24px rgba(29, 120, 255, 0.32)"},Me={borderRadius:"999px",padding:"8px 16px",fontWeight:700,textTransform:"none",border:"1px solid var(--border-strong)",color:"var(--text-primary)",background:"var(--surface-card)"},Re={borderRadius:"999px",padding:"8px 14px",fontWeight:700,textTransform:"none",border:"1px solid var(--border-strong)",color:"var(--text-primary)",background:"transparent"},Oe={display:"flex",flexDirection:"column",gap:"2px"},We={margin:0,display:"inline-flex",alignItems:"center",width:"fit-content",padding:"3px 10px",borderRadius:"999px",fontSize:"0.72rem",fontWeight:800,letterSpacing:"0.85px",textTransform:"uppercase",color:"var(--text-secondary)",background:"var(--surface-muted)",border:"1px solid var(--border-soft)"},Be={margin:0,fontSize:"clamp(1.45rem, 2.7vw, 2.35rem)",fontWeight:900,letterSpacing:"0.35px",lineHeight:1.05},ze={color:"var(--text-primary)"},Le={backgroundImage:"linear-gradient(135deg, #205eff 0%, #2bc2ff 45%, #3db89f 100%)",WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent",WebkitTextFillColor:"transparent",textShadow:"0 8px 20px rgba(32, 94, 255, 0.2)"},je={borderRadius:"12px",overflow:"hidden",border:"1px solid var(--tabbar-border)",boxShadow:"var(--tabbar-shadow)",background:"var(--tabbar-bg)"},Ne={margin:0,color:"var(--text-secondary)",fontWeight:700,fontSize:"0.9rem"},Pe={display:"inline-flex",alignItems:"center",gap:"8px",borderRadius:"999px",border:"1px solid var(--border-soft)",background:"var(--surface-card)",color:"var(--text-primary)",padding:"4px 8px 4px 4px",maxWidth:"220px"},De={width:"24px",height:"24px",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",background:"var(--accent-gradient)",color:"#fff",fontWeight:800,fontSize:"0.78rem",flexShrink:0},Ue={overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:"0.85rem",fontWeight:700};function Ge({user:e,onLogout:t}){var r;const[a,o]=n.useState(!1),[i,l]=n.useState(!1),[s,c]=n.useState(!1),[d,u,p]=Q((e=>[e.algorithm,e.setAlgorithm,e.sortingArray]),v),[m,g]=q((e=>[e.themeMode,e.toggleThemeMode]),v),f=(null==(r=_[d])?void 0:r.name)||"All",y=function(e){if(!e)return"";const t="string"==typeof e.name?e.name.trim():"",r="string"==typeof e.email?e.email.trim():"";return t||r||"User"}(e);return n.createElement("div",null,n.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"10px",flexWrap:"wrap",marginBottom:"10px"}},n.createElement("div",{style:Oe},n.createElement("p",{style:We},"Interactive Playground"),n.createElement("h3",{style:Be},n.createElement("span",{style:ze},"Sorting")," ",n.createElement("span",{style:Le},"Algorithms Visualizer"))),n.createElement("div",{style:{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}},y?n.createElement("span",{style:Pe,title:y},(null==e?void 0:e.picture)?n.createElement("img",{src:e.picture,alt:y,style:{...De,objectFit:"cover",padding:0}}):n.createElement("span",{style:De},(h=y)?h[0].toUpperCase():"U"),n.createElement("span",{style:Ue},y)):null,n.createElement(x,{style:{marginRight:"2px"},control:n.createElement(w,{color:"primary",checked:"dark"===m,onChange:g,name:"theme-toggle"}),label:n.createElement("span",{style:Ne},"dark"===m?"Dark Mode":"Light Mode")}),n.createElement(b,{variant:"outlined",onClick:()=>l(!0),style:Me},"Saved Data"),n.createElement(b,{variant:"contained",onClick:()=>o(!0),style:Ie},"AI Suggestion"),t?n.createElement(b,{variant:"outlined",onClick:async function(){if(t&&!s){c(!0);try{await t()}finally{c(!1)}}},style:Re,disabled:s},s?"Logging out...":"Logout"):null)),n.createElement(E,{position:"static",color:"default",style:je},n.createElement(S,{value:d,onChange:(e,t)=>u(t),variant:"scrollable",scrollButtons:"auto","aria-label":"scrollable auto tabs example",textColor:"inherit",indicatorColor:"primary"},_.map(((e,t)=>n.createElement(k,{label:e.title,...Te(t),key:e.title,style:{color:"var(--text-secondary)",fontWeight:700}}))),n.createElement(k,{label:"All",...Te(_.length),style:{color:"var(--text-secondary)",fontWeight:700}}))),n.createElement(ge,{open:a,onClose:()=>o(!1),selectedAlgorithm:f,array:p}),n.createElement(Ae,{open:i,onClose:()=>l(!1)}));var h}const _e=C.div`
  font-size: 2rem;
  display: flex;
  align-items: center;
  margin: 16px 0;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid var(--border-soft);
  background: var(--surface-card-soft);
  box-shadow: var(--shadow-soft);
  transition: background 220ms ease, border-color 220ms ease;
`,Fe=C.div`
  display: flex;
  align-items: center;
  flex-basis: 60%;
  flex-grow: 1;
  min-width: 300px;
  gap: 10px;
`,He=C.div`
  display: flex;
  align-items: center;
  flex-basis: 40%;
  flex-grow: 1;
`,Qe={flexGrow:1,flexBasis:"100%",color:"var(--accent-500)"},qe={flexGrow:1,margin:"0 4px",background:"var(--surface-card)",borderRadius:"8px"},Ve={borderRadius:"10px",padding:"8px 14px",fontWeight:700,boxShadow:"0 6px 18px rgba(24, 66, 148, 0.24)"},Je={padding:"7px",borderRadius:"9px",background:"var(--icon-btn-bg)",color:"var(--icon-btn-color)",boxShadow:"var(--icon-btn-shadow)",cursor:"pointer"},Ye={...Je,color:"var(--icon-btn-disabled-color)",background:"var(--icon-btn-disabled-bg)",boxShadow:"none",cursor:"not-allowed"},Ke=C.div`
  display: flex;
  margin-left: 16px;
  column-gap: 8px;
`;function Xe(){const[e,t]=n.useState(!1),[r,a]=q((e=>[e.progress,e.speed]),v),[o,i]=Q((e=>[e.sortingArray,e.setSortingArray]),v),[l,s,c,d]=q((e=>[e.startSorting,e.pauseSorting,e.resetSorting,e.setSpeed]),v),[u,p]=n.useState(o),m=n.createElement(I,{onClick:l,style:Je}),g=n.createElement(M,{onClick:async function(){s(),t(!0),await B(q.getState().swapTime),t(!1)},style:Je}),f=n.createElement(T,{onClick:c,style:Je}),y=n.createElement(M,{style:Ye});return n.createElement(_e,null,n.createElement(Fe,null,n.createElement(b,{variant:"contained",color:"primary",onClick:function(){const e=function(e=z(5,10)){return Array.from(new Array(e),(()=>z()))}();p(e),i(e),c()},style:Ve},"Generate"),n.createElement($,{id:"outlined-basic",label:"Input",variant:"outlined",onChange:e=>function(e){const t=e.replaceAll(/\s/g,"").replaceAll(/\d{4}/g,"").replaceAll(/\s\s/g," ").replaceAll(/\s,/g,",").replaceAll(/,,/g,",").replaceAll(/[^0-9,\s]/g,"");p(t);const r=(n=t,n.split(",").filter((e=>""!==e)).map((e=>+e)));var n;i(r),c()}(e.target.value),value:u,size:"small",width:"100px",style:qe})),n.createElement(He,null,n.createElement(A,{key:`slider-${a}`,defaultValue:a,onChange:(e,t)=>d(t),"aria-labelledby":"discrete-slider",valueLabelDisplay:"auto",step:1,marks:!0,min:1,max:10,style:Qe}),n.createElement(Ke,null,function(){if(e)return y;switch(r){case"reset":return m;case"start":return g;case"pause":return m;case"done":return y;default:return m}}()," ",f)))}const Ze=C.div`
  display: flex;
  height: 175px;
  align-items: center;
  padding: 15px;
  overflow: auto;
`,et=C.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--border-strong);
  width: 50px;
  height: 50px;
  box-shadow: 0 5px 30px 0 rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  flex-shrink: 0;
  background: var(--surface-card);
  color: var(--text-primary);
`;let tt=q.getState().swapTime;q.subscribe((e=>tt=e),(e=>e.swapTime));const rt=C(et)` animation: ${e=>{return t=e.distance,R`
  0%{
    background-color: ${r="yellow"};
  }
  40%{
    transform: translate(0px, 0px);
    background-color: ${r};
  }
  60% {
    transform: translate(0px, 50px);
    background-color: ${r};
  }
  80% {
    transform: translate(-${50*t}px, 50px);
    background-color: ${r};
  }
  99% {
    transform: translate(-${50*t}px, 0px);
    background-color: ${r};
  }
  100%{
    transform: translate(-${50*t}px, 0px);
    background-color: none;
  }
`;var t,r}}
    ${()=>tt/1e3}s forwards;`,nt=C(et)`animation: ${e=>{return t=e.distance,R`
  0%{
    background-color: ${r="yellow"};
  }
  40%{
    transform: translate(0px, 0px);
    background-color: ${r};
  }
  60% {
    transform: translate(0px, -50px);
    background-color: ${r};
  }
  80% {
    transform: translate(${50*t}px, -50px);
    background-color: ${r};
  }
  99% {
    transform: translate(${50*t}px, 0px);
    background-color: ${r};
  }
  100%{
    transform: translate(${50*t}px, 0px);
    background-color: none;
  }
`;var t,r}}
    ${()=>tt/1e3}s forwards;`;function at({array:e,source:t,destination:r,pivot:a=-1,highlightIndices:o,sortedIndices:i}){function l(e){return e===a?"sandybrown":o.includes(e)?"pink":i.includes(e)?"springgreen":""}return n.createElement(Ze,null,e.map(((e,a)=>a===t?n.createElement(rt,{key:a+":"+t+":"+r+":"+e,distance:r-t,style:{order:r,backgroundColor:l(a)}},e):a===r?n.createElement(nt,{key:a+":"+r+":"+t+":"+e,distance:r-t,style:{order:t,backgroundColor:l(a)}},e):n.createElement(et,{key:a+":"+r+":"+t+":"+e,style:{order:a,backgroundColor:l(a)}},e))))}let ot=q.getState().swapTime;q.subscribe((e=>ot=e),(e=>e.swapTime));const it=C(et)`
  animation: ${e=>{return t=e.distance,R`
  0%{
    background-color: ${r="yellow"};
  }
  10%{
    transform: translate(0px, 0px);
    background-color: ${r};
  }
  30% {
    transform: translate(0px, -50px);
    background-color: ${r};
  }
  70% {
    transform: translate(-${50*t}px, -50px);
    background-color: ${r};
  }
  99% {
    transform: translate(-${50*t}px, 0px);
    background-color: ${r};
  }
  100%{
    transform: translate(-${50*t}px, 0px);
  }
`;var t,r}}
    ${()=>ot/1e3}s forwards;
`,lt=C(et)`
  animation: ${R`
  0%{
    transform: translate(0px, 0px);
  }
  100%{
    transform: translate(50px, 0px);
  }
`} ${()=>ot/1e3}s forwards;
`;function st({array:e,source:t,destination:r,hightlightedIndices:a,sortedIndices:o}){const[i,l]=n.useState([...e]);function s(e){return o.includes(e)?"springgreen":a.includes(e)?"pink":""}return n.useEffect((()=>{-1!==t&&-1!==r&&((e,t,r)=>{e((e=>{const n=[...e],a=n[t];for(let o=t;o>r;o--)n[o]=n[o-1];return n[r]=a,n}))})(l,t,r)}),[t,r]),n.useEffect((()=>{l([...e])}),[e]),n.createElement(n.Fragment,null,n.createElement(Ze,null,i.map(((e,a)=>a===r?n.createElement(it,{key:a+":"+e,style:{order:t+1,backgroundColor:s(a)},distance:t-r},e):a>r&&a<=t?n.createElement(lt,{key:a+":"+e,style:{order:a,backgroundColor:s(a),transform:"translate(50px)"}},e):n.createElement(et,{key:a+":"+e,style:{order:a,backgroundColor:s(a)}},e)))))}const ct=C.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px dashed var(--border-soft);
  color: var(--text-secondary);
  font-size: 0.95rem;
`,dt=C.div`
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--chip-bg);
  border: 1px solid var(--chip-border);
`,ut=C.span`
  color: ${e=>e.$color||"inherit"};
  font-weight: 700;
`;function pt({swapCount:e,comparisionCount:t,saveStatus:r="idle"}){const a=function(e){switch(e){case"saving":return{label:"Saving...",color:"#f39c12"};case"saved":return{label:"Saved",color:"#2ecc71"};case"error":return{label:"Backend Offline",color:"#ff6b6b"};default:return{label:"Pending",color:"var(--text-muted)"}}}(r);return n.createElement(ct,null,n.createElement(dt,null,"Swaps: ",n.createElement("strong",null,e)),n.createElement(dt,null,"Comparisions: ",n.createElement("strong",null,t)),n.createElement(dt,null,"Stored: ",n.createElement(ut,{$color:a.color},a.label)))}function mt({isAlgoExecutionOver:e}){const[t,r]=n.useState(0),[a,o]=n.useState(0),[i,l]=n.useState(0),s=q((e=>e.progress));return n.useEffect((()=>{if(!e){if("start"===s)var t=setInterval((()=>l((e=>e+1))),100);else"reset"===s&&(l(0),o(0),r(0));return()=>clearInterval(t)}}),[s,e]),n.useEffect((()=>{10===i&&(o((e=>e+1)),l(0))}),[i]),n.useEffect((()=>{60===a&&(r((e=>e+1)),o(0))}),[a]),`${t.toString().padStart(2,0)}:${a.toString().padStart(2,0)}:${i} s`}let gt=q.getState().compareTime,ft=q.getState().swapTime;q.subscribe((([e,t])=>{gt=e,ft=t}),(e=>[e.compareTime,e.swapTime]),v);const yt=C(O)`
  && {
    padding: 12px;
    border: 1px solid var(--border-soft);
    border-radius: 14px;
    background-color: var(--surface-card-soft) !important;
    color: var(--text-primary) !important;
    box-shadow: var(--shadow-medium);
    transition: background-color 220ms ease, border-color 220ms ease, color 220ms ease;
  }
`,xt=C.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 20px;
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid var(--chip-border);
  background: var(--surface-muted);
`,ht=C.strong`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--text-primary);
  letter-spacing: 0.2px;
  font-size: 0.92rem;
`,bt=C.div`
  display: flex;
  column-gap: 6px;
  min-width: 8rem;
  justify-content: flex-end;
  font-size: 0.95rem;
  color: var(--text-secondary);
`,vt=C.strong`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--chip-bg);
  border: 1px solid var(--chip-border);
  color: var(--text-primary);
`,wt=C.div`
  margin-top: 8px;
  margin-bottom: 6px;
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  background: var(--surface-card);
  padding: 8px;
`,Et=C.div`
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 6px;
`,St=C.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`,kt=C.div`
  border-radius: 8px;
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  padding: 6px;
`,Ct=C.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
`,$t=C.div`
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text-primary);
`,At=n.memo((function({array:e,sortFunction:t,sortingAlgorithmName:r}){const[a,o]=n.useState([-1,-1]),[i,l]=n.useState([-1,-1]),[s,c]=n.useState("idle"),d=n.useRef([]),u=n.useRef([]),p=n.useRef([]),m=n.useRef(-1),g=n.useRef(0),f=n.useRef(0),y=n.useRef(!1),x=n.useRef(!1),h=n.useRef(!1),b=n.useRef(0),v=ne(r),w=q((e=>e.markSortngDone)),E=n.useRef(""),S=n.useRef(null);async function k(){if(!h.current){h.current=!0,c("saving");try{const e=[...u.current],t=ae({selectedAlgorithm:r,array:e}),n=await oe({algorithmName:r,array:e,maxTraceLines:140}),a=b.current>0?Date.now()-b.current:0;await async function(e){const t=await be("/api/results",{method:"POST",body:JSON.stringify(e)});return ve(),t}({algorithm:r,inputArray:e,finalArray:[...d.current],comparisons:f.current,swaps:g.current,timeMs:a,complexity:v,themeMode:q.getState().themeMode,aiExplanation:{selectedSteps:t.selectedSteps,recommendedAlgorithm:t.recommended,rationale:t.rationale,traceLines:n.lines,traceSummary:{comparisons:n.comparisonCount,swaps:n.swapCount,moves:n.moveCount,truncated:n.truncated}},createdAt:(new Date).toISOString()}),c("saved")}catch(e){c("error")}}}async function C(){const e=[...Q.getState().sortingArray];d.current=[...e],u.current=[...e],p.current=[],m.current=-1,g.current=0,f.current=0,y.current=!1,h.current=!1,b.current=0,c("idle"),o([-1,-1]),l([-1,-1]),S.current="MergeSort"===r?await t(d.current,A,T,I):await t(d.current,$,T,I)}async function $(e,t){let r=d.current[e];d.current[e]=d.current[t],d.current[t]=r,o([e,t]),m.current=-1,g.current+=1,await B(ft)}async function A(e,t){e!==t&&(g.current+=1,l([-1,-1]),o([e,t]),await B(ft))}async function T(e,t){o([-1,-1]),f.current+=1,m.current=t,l(e),await B(gt)}function I(...e){p.current.push(...e)}n.useEffect((()=>{E.current=q.getState().progress;const e=q.subscribe((e=>{E.current=e,"start"===E.current&&async function(){var e;b.current||(b.current=Date.now());let t={done:!1};for(;!(null==t?void 0:t.done)&&"start"===E.current&&!x.current;)t=await(null==(e=S.current)?void 0:e.next());if(x.current)return;!y.current&&(null==t?void 0:t.done)&&(y.current=!0,m.current=-1,o([-1,-1]),l([-1,-1]),w(),k())}(),"reset"===E.current&&C()}),(e=>e.progress));return()=>{x.current=!0,e()}}),[]),n.useEffect((()=>{C()}),[e]);const M=n.createElement(st,{array:d.current,source:a[0],destination:a[1],hightlightedIndices:i,sortedIndices:p.current}),R=n.createElement(at,{array:d.current,source:a[0],destination:a[1],pivot:m.current,highlightIndices:i,sortedIndices:p.current});return n.createElement(yt,null,n.createElement(xt,null,n.createElement(ht,null,r),n.createElement(bt,null,n.createElement("span",null,"Time:"),n.createElement(vt,null,n.createElement(mt,{isAlgoExecutionOver:y.current})))),"MergeSort"===r?M:R,n.createElement(wt,null,n.createElement(Et,null,"Algorithm Complexity Chart"),n.createElement(St,null,n.createElement(kt,null,n.createElement(Ct,null,"Best Time"),n.createElement($t,null,v.best)),n.createElement(kt,null,n.createElement(Ct,null,"Average Time"),n.createElement($t,null,v.average)),n.createElement(kt,null,n.createElement(Ct,null,"Worst Time"),n.createElement($t,null,v.worst)),n.createElement(kt,null,n.createElement(Ct,null,"Space"),n.createElement($t,null,v.space)))),n.createElement(pt,{swapCount:g.current,comparisionCount:f.current,saveStatus:s}))})),Tt=C.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 100%;
  column-gap: 12px;
  row-gap: 12px;

  & > div {
    max-width: 100%;
    min-width: 375px;
  }
`,It=C.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
`,Mt=C.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 14px;
  min-height: 120px;
  width: 100%;
  border-radius: 12px;
  border: 1px dashed var(--border-strong);
  background: var(--surface-muted);
  color: var(--text-secondary);
  font-weight: 700;
`;function Rt(e){const{children:t,value:r,index:a,...o}=e;return n.createElement("div",{role:"tabpanel",hidden:r!==a,id:`scrollable-auto-tabpanel-${a}`,"aria-labelledby":`scrollable-auto-tab-${a}`,...o,style:{maxWidth:"100%"}},r===a&&t)}function Ot(){const e=q((e=>e.resetSorting)),[t,r]=Q((e=>[e.sortingArray,e.algorithm]),v);return n.useEffect((()=>{e()}),[r]),0===t.length?n.createElement(Mt,null,"Please enter input array or use generate button"):n.createElement(It,null,_.map(((e,a)=>n.createElement(Rt,{value:r,index:a,key:e.name},n.createElement(At,{array:t,sortFunction:e.component,sortingAlgorithmName:e.name})))),n.createElement(Rt,{value:r,index:_.length},n.createElement(Tt,null,_.map((e=>n.createElement(At,{array:t,sortFunction:e.component,sortingAlgorithmName:e.name,key:e.name}))))))}async function Wt(){try{await be("/api/auth/logout",{method:"POST",body:JSON.stringify({})})}finally{"undefined"!=typeof window&&window.localStorage.removeItem(ye)}}const Bt=C.div`
  position: relative;
  isolation: isolate;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
  padding: 18px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #dbe6ff;
  background: linear-gradient(135deg, #f9fcff 0%, #eef4ff 48%, #f7fbff 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    filter: blur(2px);
    z-index: -1;
  }

  &::before {
    width: 220px;
    height: 220px;
    top: -82px;
    right: -36px;
    background: radial-gradient(circle, rgba(60, 128, 255, 0.28), rgba(60, 128, 255, 0));
  }

  &::after {
    width: 260px;
    height: 260px;
    bottom: -110px;
    left: -80px;
    background: radial-gradient(circle, rgba(65, 201, 181, 0.22), rgba(65, 201, 181, 0));
  }

  @media (max-width: 720px) {
    min-height: calc(100vh - 120px);
    padding: 12px;
    border-radius: 18px;
  }
`,zt=C(O)`
  width: 100%;
  max-width: 470px;
  padding: 26px 24px;
  border-radius: 22px !important;
  border: 1px solid #d3e1ff;
  background: rgba(255, 255, 255, 0.96) !important;
  box-shadow:
    0 26px 54px rgba(35, 72, 145, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);

  @media (max-width: 720px) {
    padding: 20px 16px;
    border-radius: 16px !important;
  }
`,Lt=C.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 11px;
  margin-bottom: 14px;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  color: #16409b;
  background: linear-gradient(135deg, #e8f1ff 0%, #dce9ff 100%);
  border: 1px solid #c9dcff;
`,jt=C.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 14px;
  padding: 4px;
  border-radius: 12px;
  background: #f1f6ff;
  border: 1px solid #d7e5ff;
`,Nt=C.button`
  border: 1px solid ${e=>e.$active?"#2c6fff":"transparent"};
  background: ${e=>e.$active?"linear-gradient(135deg, #2f6fff 0%, #4d92ff 100%)":"transparent"};
  color: ${e=>e.$active?"#fff":"#20407f"};
  border-radius: 10px;
  height: 40px;
  font-weight: 700;
  cursor: pointer;
  transition: all 180ms ease;

  &:hover {
    background: ${e=>e.$active?"linear-gradient(135deg, #2f6fff 0%, #4d92ff 100%)":"#e8f1ff"};
  }
`,Pt=C.form`
  .MuiInputBase-root {
    border-radius: 12px;
    background: #f8faff;
  }

  .MuiInputBase-input {
    color: #102650 !important;
    font-weight: 600;
  }

  .MuiInputLabel-root {
    color: #5f73a1 !important;
    font-weight: 600;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: #cfdefc !important;
  }

  .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #7ea9ff !important;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #2f72ff !important;
    border-width: 2px;
  }
`,Dt=C.div`
  margin-top: 14px;
`,Ut=C.div`
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`,Gt={margin:0,marginBottom:"6px",color:"#0d2558",fontSize:"1.9rem",lineHeight:1.1},_t={margin:0,marginBottom:"18px",color:"#4a6598",fontWeight:500},Ft={width:"100%",marginBottom:"13px"},Ht={marginBottom:"12px",color:"#d7263d",fontWeight:700,background:"#ffeef1",border:"1px solid #ffcfd7",borderRadius:"10px",padding:"9px 11px",fontSize:"0.9rem"},Qt={marginTop:"8px",color:"#556d9d",fontSize:"0.82rem",textAlign:"center"},qt={textTransform:"none",fontWeight:800,width:"100%",height:"46px",borderRadius:"12px",marginTop:"2px",background:"linear-gradient(135deg, #215eff 0%, #3e8bff 100%)",boxShadow:"0 14px 28px rgba(40, 94, 203, 0.27)"};function Vt({onAuthenticated:e}){const[t,r]=n.useState("login"),[a,o]=n.useState(""),[i,l]=n.useState(""),[s,c]=n.useState(""),[d,p]=n.useState(!1),[m,g]=n.useState(""),[f,y]=n.useState(!1),[x,h]=n.useState(""),v=n.useRef(null),w="signup"===t;return n.useEffect((()=>{var t,r;let n=!1;async function a(t){const r=null==t?void 0:t.credential;if(r){p(!0),g("");try{const t=await async function(e){const t=await be("/api/auth/google",{method:"POST",attachAuth:!1,body:JSON.stringify({credential:e})});return(null==t?void 0:t.token)&&he(t.token),t}(r);n||e(t.user)}catch(a){n||g(function(e){const t="Google login failed";if(!e)return t;const r=`${(null==e?void 0:e.message)||t}`.toLowerCase();return r.includes("client")&&r.includes("mismatch")?"Google Client ID mismatch. Check VITE_GOOGLE_CLIENT_ID in frontend and GOOGLE_CLIENT_ID in backend.":r.includes("credential")?"Google credential missing. Please retry sign-in.":r.includes("enotfound")||r.includes("timeout")||r.includes("network")?"Backend could not verify Google token. Check internet access on backend host.":(null==e?void 0:e.message)||t}(a))}finally{n||p(!1)}}else g("Google sign-in did not return a credential. Please try again.")}function o(){var e,t;if(n)return;const r=null==(t=null==(e=null==window?void 0:window.google)?void 0:e.accounts)?void 0:t.id;if(!r||!v.current)return;v.current.innerHTML="",r.initialize({client_id:"850819629788-dk41254a7qhihn85859pq56kb6adrmlo.apps.googleusercontent.com",callback:a});const o=Math.min(360,window.innerWidth-90);r.renderButton(v.current,{theme:"outline",size:"large",shape:"pill",text:"continue_with",width:Math.max(o,220)}),y(!0),h("")}if(null==(r=null==(t=null==window?void 0:window.google)?void 0:t.accounts)?void 0:r.id)return o(),()=>{n=!0};const i=document.createElement("script");return i.src="https://accounts.google.com/gsi/client",i.async=!0,i.defer=!0,i.onload=()=>{o()},i.onerror=()=>{n||(y(!1),h("Could not load Google sign-in script. Check internet connection."))},document.head.appendChild(i),()=>{n=!0}}),[e]),n.createElement(Bt,null,n.createElement(zt,null,n.createElement(Lt,null,"Sorting Visualizer"),n.createElement("h2",{style:Gt},w?"Create Your Account":"Welcome Back"),n.createElement("p",{style:_t},w?"Sign up to save sorting runs and view your algorithm analytics.":"Login to continue your sorting practice dashboard."),n.createElement(jt,null,n.createElement(Nt,{type:"button",$active:"login"===t,onClick:()=>r("login")},"Login"),n.createElement(Nt,{type:"button",$active:"signup"===t,onClick:()=>r("signup")},"Sign Up")),n.createElement(Pt,{onSubmit:async function(t){t.preventDefault(),p(!0),g("");try{const t=w?{name:a.trim(),email:i.trim(),password:s}:{email:i.trim(),password:s},r=w?await async function({name:e,email:t,password:r}){const n=await be("/api/auth/signup",{method:"POST",attachAuth:!1,body:JSON.stringify({name:e,email:t,password:r})});return(null==n?void 0:n.token)&&he(n.token),n}(t):await async function({email:e,password:t}){const r=await be("/api/auth/login",{method:"POST",attachAuth:!1,body:JSON.stringify({email:e,password:t})});return(null==r?void 0:r.token)&&he(r.token),r}(t);e(r.user)}catch(r){g((null==r?void 0:r.message)||"Authentication failed")}finally{p(!1)}}},w?n.createElement($,{label:"Name",value:a,onChange:e=>o(e.target.value),variant:"outlined",size:"small",required:!0,style:Ft}):null,n.createElement($,{label:"Email",type:"email",value:i,onChange:e=>l(e.target.value),variant:"outlined",size:"small",required:!0,style:Ft}),n.createElement($,{label:"Password",type:"password",value:s,onChange:e=>c(e.target.value),variant:"outlined",size:"small",required:!0,style:Ft,helperText:w?"Use at least 6 characters":""}),m?n.createElement("div",{style:Ht},m):null,n.createElement(b,{type:"submit",variant:"contained",disabled:d,style:qt},d?"Please wait...":w?"Create Account":"Login")),n.createElement(Dt,null,n.createElement(u,{style:{marginBottom:"10px",marginTop:"14px"}}),n.createElement(Ut,{ref:v}),!f||x?n.createElement("div",{style:Qt},x||"Loading Google sign-in..."):null)))}const Jt=C(O)`
  margin-top: 12px;
  padding: 14px;
  border-radius: 14px !important;
  border: 1px solid var(--border-soft);
  background: var(--surface-card-soft) !important;
  box-shadow: var(--shadow-soft);
`,Yt=C.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`,Kt=C.h4`
  margin: 0;
  color: var(--text-primary);
`,Xt=C.div`
  color: var(--text-secondary);
  font-size: 0.95rem;
`,Zt=C.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
`,er=C.div`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 1px solid var(--border-strong);
  background: ${e=>e.$gradient};
  box-shadow: inset 0 0 0 16px rgba(255, 255, 255, 0.08);
`,tr=C.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 250px;
`,rr=C.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--text-primary);
  font-size: 0.9rem;
`,nr=C.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${e=>e.$color};
  display: inline-block;
`,ar=["#5b8dff","#31b7ff","#4dd7a8","#ffd166","#ff8fab","#c77dff","#ff9f1c","#3dd5f3"];function or(){var e,t,r;const[a,o]=n.useState(!1),[i,l]=n.useState(""),[s,c]=n.useState({totalRuns:0,algorithms:[],mostUsed:null,notUsed:[]});async function d(){o(!0),l("");try{const e=await async function(){return be("/api/usage",{method:"GET"})}();c((null==e?void 0:e.usage)||{totalRuns:0,algorithms:[],mostUsed:null,notUsed:[]})}catch(e){l((null==e?void 0:e.message)||"Could not load usage data")}finally{o(!1)}}n.useEffect((()=>{function e(){d()}return d(),window.addEventListener("usage-updated",e),()=>window.removeEventListener("usage-updated",e)}),[]);const u=n.useMemo((()=>[...s.algorithms||[]].sort(((e,t)=>t.count-e.count))),[s.algorithms]),p=n.useMemo((()=>function(e){const t=e.reduce(((e,t)=>e+t.count),0);if(!t)return"conic-gradient(#2c3f69 0 100%)";let r=0;return`conic-gradient(${e.map(((e,n)=>{const a=ar[n%ar.length],o=e.count/t*100,i=r,l=r+o;return r=l,`${a} ${i}% ${l}%`})).join(", ")})`}(u)),[u]);return n.createElement(Jt,null,n.createElement(Yt,null,n.createElement(Kt,null,"Algorithm Usage Analytics"),n.createElement(b,{variant:"outlined",color:"primary",size:"small",onClick:d},"Refresh")),a?n.createElement(Xt,null,"Loading usage stats..."):null,i?n.createElement(Xt,{style:{color:"#ff7a7a"}},i):null,a||i?null:n.createElement(n.Fragment,null,n.createElement(Xt,null,"Total runs: ",s.totalRuns),n.createElement(Xt,null,"Most used: ",(null==(e=null==s?void 0:s.mostUsed)?void 0:e.algorithm)||"-"," (",(null==(t=null==s?void 0:s.mostUsed)?void 0:t.count)||0,")"),n.createElement(Xt,null,"Not used: ",(null==(r=null==s?void 0:s.notUsed)?void 0:r.length)?s.notUsed.join(", "):"None"),n.createElement(Zt,{style:{marginTop:"12px"}},n.createElement(er,{$gradient:p}),n.createElement(tr,null,u.map(((e,t)=>n.createElement(rr,{key:e.algorithm},n.createElement("span",{style:{display:"inline-flex",alignItems:"center",gap:"8px"}},n.createElement(nr,{$color:ar[t%ar.length]}),e.algorithm),n.createElement("strong",null,e.count))))))))}const ir=C.div`
  min-height: 100vh;
  padding: 20px 14px 46px;
  background: var(--app-backdrop);
  transition: background 220ms ease;
`,lr=C.div`
  max-width: 1240px;
  margin: 0 auto;
  min-height: calc(100vh - 56px);
  position: relative;
  border-radius: 20px;
  padding: 18px;
  border: 1px solid var(--app-container-border);
  background: var(--app-container-bg);
  backdrop-filter: blur(4px);
  box-shadow: var(--app-container-shadow);
  transition: background 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
`,sr=C.div`
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-weight: 700;
`;function cr(){const e=q((e=>e.themeMode)),[t,r]=n.useState(!0),[a,o]=n.useState(null);return n.useEffect((()=>{const t=a?e:"light";document.documentElement.setAttribute("data-theme",t)}),[e,a]),n.useEffect((()=>{let e=!1;return async function(){if(Boolean(xe()))try{const t=await async function(){return be("/api/auth/me",{method:"GET"})}();e||o((null==t?void 0:t.user)||null)}catch(t){e||o(null)}finally{e||r(!1)}else e||r(!1)}(),()=>{e=!0}}),[]),t?n.createElement(ir,null,n.createElement(lr,null,n.createElement(sr,null,"Checking authentication..."))):a?n.createElement(ir,null,n.createElement(lr,null,n.createElement(Ge,{user:a,onLogout:async function(){try{await Wt()}finally{o(null)}}}),n.createElement(Xe,null),n.createElement(or,null),n.createElement(Ot,null))):n.createElement(ir,null,n.createElement(lr,null,n.createElement(Vt,{onAuthenticated:o})))}W.render(n.createElement(n.StrictMode,{value:!1},n.createElement(cr,null)),document.getElementById("root"));
