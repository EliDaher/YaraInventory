import{r as N,j as n,B as G,h as J}from"./index-BLsygcWL.js";import{k as P,g as R,u as $,s as y,e as H,n as Q}from"./DefaultPropsProvider-CvgxCWFY.js";import{h as u,T as b,t as T,d as V,g as M,k as A}from"./useSlot-B6lHOrQI.js";function Y(e){return String(e).match(/[\d.\-+]*\s*(.*)/)[1]||""}function Z(e){return parseFloat(e)}function he({value:e,onChange:t,partValue:a=0,onPartValueChange:o}){const[i,r]=N.useState(null),l=[{key:"cash",label:"نقداً",descTitle:"طريقة الدفع: نقدي",desc:"تُستخدم للمدفوعات الفورية, و في حالة الارجاع من الصندوق دون تغيير رصيد الزبون."},{key:"part",label:"جزئي",descTitle:"طريقة الدفع: جزئي",desc:"استخدم هذه الطريقة عند دفع جزء من المبلغ فقط."},{key:"debt",label:"دين",descTitle:"طريقة الدفع: دين",desc:"استخدم هذه الطريقة عند إضافة دين على الزبون او عند الاعادة و خصم رصيد الاعادة من رصيد الزبون."}];return n.jsxs("div",{className:"grid grid-cols-3 gap-2 md:col-span-2",children:[n.jsx("div",{className:"col-span-3 font-medium mb-1",children:"طريقة دفع المبلغ المعاد"}),l.map(s=>n.jsxs("div",{className:"relative inline-block",children:[n.jsx(G,{onMouseEnter:()=>r(s.key),onMouseLeave:()=>r(null),onFocus:()=>r(s.key),onBlur:()=>r(null),onClick:()=>t(s.key),className:"w-full",variant:e===s.key?"default":"outline",type:"button",children:s.label}),n.jsxs("div",{className:`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 rounded-md px-3 py-2 text-sm 
              shadow-lg ring-1 ring-black/5 bg-white transition-all duration-150 
              ${i===s.key?"opacity-100 translate-y-0":"opacity-0 translate-y-1 pointer-events-none"}
            `,children:[n.jsx("div",{className:"font-medium",children:s.descTitle}),n.jsx("div",{className:"mt-1 text-xs text-gray-600",children:s.desc})]}),n.jsx("div",{className:`absolute left-1/2 -translate-x-1/2 bottom-full mb-0.5 w-3 h-3 rotate-45 bg-white 
              ring-1 ring-black/5 transition-opacity duration-150
              ${i===s.key?"opacity-100":"opacity-0 pointer-events-none"}
            `})]},s.key)),e==="part"&&o&&n.jsxs("div",{className:"col-span-3 mt-2",children:[n.jsx("label",{className:"text-sm font-medium",children:"قيمة الدفعة"}),n.jsx("input",{type:"number",value:a,onChange:s=>o(Number(s.target.value)),className:`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 \r
              focus:ring-indigo-500 focus:outline-none`})]})]})}function _(e){return R("MuiCardHeader",e)}const v=P("MuiCardHeader",["root","avatar","action","content","title","subheader"]),ee=e=>{const{classes:t}=e;return H({root:["root"],avatar:["avatar"],action:["action"],content:["content"],title:["title"],subheader:["subheader"]},_,t)},te=y("div",{name:"MuiCardHeader",slot:"Root",overridesResolver:(e,t)=>[{[`& .${v.title}`]:t.title},{[`& .${v.subheader}`]:t.subheader},t.root]})({display:"flex",alignItems:"center",padding:16}),ae=y("div",{name:"MuiCardHeader",slot:"Avatar"})({display:"flex",flex:"0 0 auto",marginRight:16}),se=y("div",{name:"MuiCardHeader",slot:"Action"})({flex:"0 0 auto",alignSelf:"flex-start",marginTop:-4,marginRight:-8,marginBottom:-4}),oe=y("div",{name:"MuiCardHeader",slot:"Content"})({flex:"1 1 auto",[`.${T.root}:where(& .${v.title})`]:{display:"block"},[`.${T.root}:where(& .${v.subheader})`]:{display:"block"}}),me=N.forwardRef(function(t,a){const o=$({props:t,name:"MuiCardHeader"}),{action:i,avatar:r,component:l="div",disableTypography:s=!1,subheader:x,subheaderTypographyProps:C,title:k,titleTypographyProps:f,slots:g={},slotProps:w={},...U}=o,d={...o,component:l,disableTypography:s},c=ee(d),p={slots:g,slotProps:{title:f,subheader:C,...w}};let h=k;const[B,F]=u("title",{className:c.title,elementType:b,externalForwardedProps:p,ownerState:d,additionalProps:{variant:r?"body2":"h5",component:"span"}});h!=null&&h.type!==b&&!s&&(h=n.jsx(B,{...F,children:h}));let m=x;const[X,E]=u("subheader",{className:c.subheader,elementType:b,externalForwardedProps:p,ownerState:d,additionalProps:{variant:r?"body2":"body1",color:"textSecondary",component:"span"}});m!=null&&m.type!==b&&!s&&(m=n.jsx(X,{...E,children:m}));const[I,K]=u("root",{ref:a,className:c.root,elementType:te,externalForwardedProps:{...p,...U,component:l},ownerState:d}),[W,D]=u("avatar",{className:c.avatar,elementType:ae,externalForwardedProps:p,ownerState:d}),[L,O]=u("content",{className:c.content,elementType:oe,externalForwardedProps:p,ownerState:d}),[q,z]=u("action",{className:c.action,elementType:se,externalForwardedProps:p,ownerState:d});return n.jsxs(I,{...K,children:[r&&n.jsx(W,{...D,children:r}),n.jsxs(L,{...O,children:[h,m]}),i&&n.jsx(q,{...z,children:i})]})});function ne(e){return R("MuiSkeleton",e)}P("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const re=e=>{const{classes:t,variant:a,animation:o,hasChildren:i,width:r,height:l}=e;return H({root:["root",a,o,i&&"withChildren",i&&!r&&"fitContent",i&&!l&&"heightAuto"]},ne,t)},S=A`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`,j=A`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`,ie=typeof S!="string"?M`
        animation: ${S} 2s ease-in-out 0.5s infinite;
      `:null,le=typeof j!="string"?M`
        &::after {
          animation: ${j} 2s linear 0.5s infinite;
        }
      `:null,de=y("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,t[a.variant],a.animation!==!1&&t[a.animation],a.hasChildren&&t.withChildren,a.hasChildren&&!a.width&&t.fitContent,a.hasChildren&&!a.height&&t.heightAuto]}})(V(({theme:e})=>{const t=Y(e.shape.borderRadius)||"px",a=Z(e.shape.borderRadius);return{display:"block",backgroundColor:e.vars?e.vars.palette.Skeleton.bg:Q(e.palette.text.primary,e.palette.mode==="light"?.11:.13),height:"1.2em",variants:[{props:{variant:"text"},style:{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${a}${t}/${Math.round(a/.6*10)/10}${t}`,"&:empty:before":{content:'"\\00a0"'}}},{props:{variant:"circular"},style:{borderRadius:"50%"}},{props:{variant:"rounded"},style:{borderRadius:(e.vars||e).shape.borderRadius}},{props:({ownerState:o})=>o.hasChildren,style:{"& > *":{visibility:"hidden"}}},{props:({ownerState:o})=>o.hasChildren&&!o.width,style:{maxWidth:"fit-content"}},{props:({ownerState:o})=>o.hasChildren&&!o.height,style:{height:"auto"}},{props:{animation:"pulse"},style:ie||{animation:`${S} 2s ease-in-out 0.5s infinite`}},{props:{animation:"wave"},style:{position:"relative",overflow:"hidden",WebkitMaskImage:"-webkit-radial-gradient(white, black)","&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(e.vars||e).palette.action.hover},
                transparent
              )`,content:'""',position:"absolute",transform:"translateX(-100%)",bottom:0,left:0,right:0,top:0}}},{props:{animation:"wave"},style:le||{"&::after":{animation:`${j} 2s linear 0.5s infinite`}}}]}})),ye=N.forwardRef(function(t,a){const o=$({props:t,name:"MuiSkeleton"}),{animation:i="pulse",className:r,component:l="span",height:s,style:x,variant:C="text",width:k,...f}=o,g={...o,animation:i,component:l,variant:C,hasChildren:!!f.children},w=re(g);return n.jsx(de,{as:l,ref:a,className:J(w.root,r),ownerState:g,...f,style:{width:k,height:s,...x}})});export{me as C,he as P,ye as S};
