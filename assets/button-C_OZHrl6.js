import{r as d,c as k,j as h,S as C,y as N}from"./index-D9SdI5e-.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),x=(...r)=>r.filter((t,e,n)=>!!t&&t.trim()!==""&&n.indexOf(t)===e).join(" ").trim();/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var V={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=d.forwardRef(({color:r="currentColor",size:t=24,strokeWidth:e=2,absoluteStrokeWidth:n,className:s="",children:o,iconNode:l,...c},v)=>d.createElement("svg",{ref:v,...V,width:t,height:t,stroke:r,strokeWidth:n?Number(e)*24/Number(t):e,className:x("lucide",s),...c},[...l.map(([a,i])=>d.createElement(a,i)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=(r,t)=>{const e=d.forwardRef(({className:n,...s},o)=>d.createElement(E,{ref:o,iconNode:t,className:x(`lucide-${j(r)}`,n),...s}));return e.displayName=`${r}`,e};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=L("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]),b=r=>typeof r=="boolean"?`${r}`:r===0?"0":r,y=k,B=(r,t)=>e=>{var n;if((t==null?void 0:t.variants)==null)return y(r,e==null?void 0:e.class,e==null?void 0:e.className);const{variants:s,defaultVariants:o}=t,l=Object.keys(s).map(a=>{const i=e==null?void 0:e[a],m=o==null?void 0:o[a];if(i===null)return null;const u=b(i)||b(m);return s[a][u]}),c=e&&Object.entries(e).reduce((a,i)=>{let[m,u]=i;return u===void 0||(a[m]=u),a},{}),v=t==null||(n=t.compoundVariants)===null||n===void 0?void 0:n.reduce((a,i)=>{let{class:m,className:u,...w}=i;return Object.entries(w).every(p=>{let[g,f]=p;return Array.isArray(f)?f.includes({...o,...c}[g]):{...o,...c}[g]===f})?[...a,m,u]:a},[]);return y(r,l,v,e==null?void 0:e.class,e==null?void 0:e.className)},O=B("relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] shadow-sm hover:shadow-md [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-gradient-to-tl from-primary-500 to-primary-600 text-primary-foreground hover:from-primary-500 hover:to-primary-700",accent:"bg-gradient-to-tl from-accent-500 to-accent-600 text-primary-foreground hover:from-accent-500 hover:to-accent-700",destructive:"bg-gradient-to-tl from-destructive/90 to-destructive text-destructive-foreground hover:from-destructive hover:to-destructive/90",secondary:"bg-gradient-to-tl from-secondary-500 to-secondary-600 text-secondary-foreground hover:from-secondary-500 hover:to-secondary-700",outline:"border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground shadow-none",ghost:"bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground shadow-none",link:"bg-transparent text-primary underline-offset-4 hover:underline shadow-none"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3 text-xs",lg:"h-11 rounded-md px-8 text-base",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),R=d.forwardRef(({className:r,variant:t,size:e,asChild:n=!1,loading:s=!1,disabled:o,children:l,...c},v)=>{const a=n?C:"button";if(n&&!d.isValidElement(l))throw new Error("Button with asChild expects a single React element child");return h.jsxs(a,{ref:v,className:N(O({variant:t,size:e}),r),disabled:n?o:o||s,"aria-busy":s,...c,children:[!n&&s&&h.jsx(A,{className:"animate-spin"}),l]})});R.displayName="Button";export{R as B,A as L,B as a,O as b,L as c};
