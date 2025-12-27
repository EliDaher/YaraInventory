import{r as $,j as l,k as G}from"./index-CsP6iXYf.js";import{k as H,g as T,u as M,s as f,e as A,n as J}from"./DefaultPropsProvider-BN9OAf-h.js";import{h,T as C,t as P,d as L,g as j,k as U}from"./useSlot-CyIx34dJ.js";function Q(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function Y(t){return parseFloat(t)}function Z(t){return T("MuiCardHeader",t)}const v=H("MuiCardHeader",["root","avatar","action","content","title","subheader"]),_=t=>{const{classes:e}=t;return A({root:["root"],avatar:["avatar"],action:["action"],content:["content"],title:["title"],subheader:["subheader"]},Z,e)},tt=f("div",{name:"MuiCardHeader",slot:"Root",overridesResolver:(t,e)=>[{[`& .${v.title}`]:e.title},{[`& .${v.subheader}`]:e.subheader},e.root]})({display:"flex",alignItems:"center",padding:16}),et=f("div",{name:"MuiCardHeader",slot:"Avatar"})({display:"flex",flex:"0 0 auto",marginRight:16}),at=f("div",{name:"MuiCardHeader",slot:"Action"})({flex:"0 0 auto",alignSelf:"flex-start",marginTop:-4,marginRight:-8,marginBottom:-4}),ot=f("div",{name:"MuiCardHeader",slot:"Content"})({flex:"1 1 auto",[`.${P.root}:where(& .${v.title})`]:{display:"block"},[`.${P.root}:where(& .${v.subheader})`]:{display:"block"}}),ht=$.forwardRef(function(e,a){const o=M({props:e,name:"MuiCardHeader"}),{action:r,avatar:s,component:n="div",disableTypography:d=!1,subheader:b,subheaderTypographyProps:S,title:x,titleTypographyProps:y,slots:g={},slotProps:w={},...N}=o,i={...o,component:n,disableTypography:d},p=_(i),c={slots:g,slotProps:{title:y,subheader:S,...w}};let u=x;const[X,B]=h("title",{className:p.title,elementType:C,externalForwardedProps:c,ownerState:i,additionalProps:{variant:s?"body2":"h5",component:"span"}});u!=null&&u.type!==C&&!d&&(u=l.jsx(X,{...B,children:u}));let m=b;const[F,E]=h("subheader",{className:p.subheader,elementType:C,externalForwardedProps:c,ownerState:i,additionalProps:{variant:s?"body2":"body1",color:"textSecondary",component:"span"}});m!=null&&m.type!==C&&!d&&(m=l.jsx(F,{...E,children:m}));const[I,K]=h("root",{ref:a,className:p.root,elementType:tt,externalForwardedProps:{...c,...N,component:n},ownerState:i}),[W,D]=h("avatar",{className:p.avatar,elementType:et,externalForwardedProps:c,ownerState:i}),[O,V]=h("content",{className:p.content,elementType:ot,externalForwardedProps:c,ownerState:i}),[q,z]=h("action",{className:p.action,elementType:at,externalForwardedProps:c,ownerState:i});return l.jsxs(I,{...K,children:[s&&l.jsx(W,{...D,children:s}),l.jsxs(O,{...V,children:[u,m]}),r&&l.jsx(q,{...z,children:r})]})});function rt(t){return T("MuiSkeleton",t)}H("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const st=t=>{const{classes:e,variant:a,animation:o,hasChildren:r,width:s,height:n}=t;return A({root:["root",a,o,r&&"withChildren",r&&!s&&"fitContent",r&&!n&&"heightAuto"]},rt,e)},k=U`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`,R=U`
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
`,nt=typeof k!="string"?j`
        animation: ${k} 2s ease-in-out 0.5s infinite;
      `:null,it=typeof R!="string"?j`
        &::after {
          animation: ${R} 2s linear 0.5s infinite;
        }
      `:null,lt=f("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:a}=t;return[e.root,e[a.variant],a.animation!==!1&&e[a.animation],a.hasChildren&&e.withChildren,a.hasChildren&&!a.width&&e.fitContent,a.hasChildren&&!a.height&&e.heightAuto]}})(L(({theme:t})=>{const e=Q(t.shape.borderRadius)||"px",a=Y(t.shape.borderRadius);return{display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:J(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em",variants:[{props:{variant:"text"},style:{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${a}${e}/${Math.round(a/.6*10)/10}${e}`,"&:empty:before":{content:'"\\00a0"'}}},{props:{variant:"circular"},style:{borderRadius:"50%"}},{props:{variant:"rounded"},style:{borderRadius:(t.vars||t).shape.borderRadius}},{props:({ownerState:o})=>o.hasChildren,style:{"& > *":{visibility:"hidden"}}},{props:({ownerState:o})=>o.hasChildren&&!o.width,style:{maxWidth:"fit-content"}},{props:({ownerState:o})=>o.hasChildren&&!o.height,style:{height:"auto"}},{props:{animation:"pulse"},style:nt||{animation:`${k} 2s ease-in-out 0.5s infinite`}},{props:{animation:"wave"},style:{position:"relative",overflow:"hidden",WebkitMaskImage:"-webkit-radial-gradient(white, black)","&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(t.vars||t).palette.action.hover},
                transparent
              )`,content:'""',position:"absolute",transform:"translateX(-100%)",bottom:0,left:0,right:0,top:0}}},{props:{animation:"wave"},style:it||{"&::after":{animation:`${R} 2s linear 0.5s infinite`}}}]}})),ut=$.forwardRef(function(e,a){const o=M({props:e,name:"MuiSkeleton"}),{animation:r="pulse",className:s,component:n="span",height:d,style:b,variant:S="text",width:x,...y}=o,g={...o,animation:r,component:n,variant:S,hasChildren:!!y.children},w=st(g);return l.jsx(lt,{as:n,ref:a,className:G(w.root,s),ownerState:g,...y,style:{width:x,height:d,...b}})});export{ht as C,ut as S};
