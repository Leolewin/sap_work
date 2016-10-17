/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','../base/Interface','../base/Object','./LabelEnablement','jquery.sap.act','jquery.sap.encoder','jquery.sap.dom','jquery.sap.trace'],function(q,I,B,L){"use strict";function a(o,m){var F=sap.ui.require(m);return typeof F==='function'&&(o instanceof F);}var c=["renderControl","write","writeEscaped","translate","writeAcceleratorKey","writeControlData","writeInvisiblePlaceholderData","writeElementData","writeAttribute","writeAttributeEscaped","addClass","writeClasses","addStyle","writeStyles","writeAccessibilityState","writeIcon","getConfiguration","getHTML","cleanupControlWithoutRendering"];var N=["render","flush","destroy"];var R=B.extend("sap.ui.core.RenderManager",{constructor:function(){B.apply(this,arguments);this.aBuffer=[];this.aRenderedControls=[];this.aStyleStack=[{}];},metadata:{publicMethods:c.concat(N)}});var b=R.RenderPrefixes={Invisible:"sap-ui-invisible-",Dummy:"sap-ui-dummy-"};R.prototype.getRendererInterface=function(){var i=new I(this,c);this.getRendererInterface=q.sap.getter(i);return i;};R.prototype.destroy=function(){this.aBuffer=[];this.aRenderedControls=[];this.aStyleStack=[{}];};R.prototype.getConfiguration=function(){return sap.ui.getCore().getConfiguration();};R.prototype.getRenderer=function(C){return R.getRenderer(C);};R.prototype._setFocusHandler=function(f){this.oFocusHandler=f;};var t=function(r,C){r._bLocked=true;try{var e=q.Event("BeforeRendering");e.srcControl=C;C._handleEvent(e);}finally{r._bLocked=false;}};R.prototype.cleanupControlWithoutRendering=function(C){if(!C||!C.getDomRef()){return;}t(this,C);C.bOutput=false;};R.prototype.renderControl=function(C){if(!C){return this;}if(!this.aRenderStack){this.aRenderStack=[];}if(this.aRenderStack&&this.aRenderStack.length>0){q.sap.measure.pause(this.aRenderStack[0]+"---renderControl");}else if(C.getParent()&&C.getParent().getMetadata().getName()=="sap.ui.core.UIArea"){q.sap.measure.pause(C.getParent().getId()+"---rerender");}this.aRenderStack.unshift(C.getId());q.sap.measure.start(C.getId()+"---renderControl","Rendering of "+C.getMetadata().getName(),["rendering","control"]);var e=this.aBuffer.length;var o={};if(C.aCustomStyleClasses&&C.aCustomStyleClasses.length>0){o.aCustomStyleClasses=C.aCustomStyleClasses;}this.aStyleStack.push(o);q.sap.measure.pause(C.getId()+"---renderControl");var r;var m=C.getMetadata();var v=C.getVisible();if(v){r=m.getRenderer();}else{var V=m.getProperty("visible");var u=V&&V._oParent&&V._oParent.getName()=="sap.ui.core.Control";r=u?d:m.getRenderer();}q.sap.measure.resume(C.getId()+"---renderControl");t(this,C);var f=C.aBindParameters;if(f&&f.length>0){var D=q(C.getDomRef());if(D&&D[0]){for(var i=0;i<f.length;i++){var p=f[i];D.unbind(p.sEventType,p.fnProxy);}}}if(r&&typeof r.render==="function"){r.render(this.getRendererInterface(),C);}else{q.sap.log.error("The renderer for class "+m.getName()+" is not defined or does not define a render function! Rendering of "+C.getId()+" will be skipped!");}this.aStyleStack.pop();this.aRenderedControls.push(C);if(C.getUIArea&&C.getUIArea()){C.getUIArea()._onControlRendered(C);}C.bOutput=this.aBuffer.length!=e;if(r===d){C.bOutput="invisible";}q.sap.measure.end(C.getId()+"---renderControl");this.aRenderStack.shift();if(this.aRenderStack&&this.aRenderStack.length>0){q.sap.measure.resume(this.aRenderStack[0]+"---renderControl");}else if(C.getParent()&&C.getParent().getMetadata().getName()=="sap.ui.core.UIArea"){q.sap.measure.resume(C.getParent().getId()+"---rerender");}return this;};R.prototype.getHTML=function(C){var e=this.aBuffer;var r=this.aBuffer=[];this.renderControl(C);this.aBuffer=e;return r.join("");};(function(){var f=function(r,g,s){var i,h=g.length;for(i=0;i<h;i++){g[i]._sapui_bInAfterRenderingPhase=true;}r._bLocked=true;try{for(i=0;i<h;i++){var C=g[i];if(C.bOutput&&C.bOutput!=="invisible"){var E=q.Event("AfterRendering");E.srcControl=C;q.sap.measure.start(C.getId()+"---AfterRendering","AfterRendering of "+C.getMetadata().getName(),["rendering","after"]);C._handleEvent(E);q.sap.measure.end(C.getId()+"---AfterRendering");}}}finally{for(i=0;i<h;i++){delete g[i]._sapui_bInAfterRenderingPhase;}r._bLocked=false;}try{r.oFocusHandler.restoreFocus(s);}catch(e){q.sap.log.warning("Problems while restoring the focus after rendering: "+e,null,r);}for(i=0;i<h;i++){var C=g[i],k=C.aBindParameters;if(k&&k.length>0){var D=q(C.getDomRef());if(D&&D[0]){for(var j=0;j<k.length;j++){var p=k[j];D.bind(p.sEventType,p.fnProxy);}}}}};R.prototype.flush=function(T,D,v){if(this.bRendererMode){q.sap.log.info("Flush must not be called from control renderers. Call ignored.",null,this);return;}if(!D&&(typeof v!=="number")&&!v){R.preserveContent(T);}var s=this.oFocusHandler?this.oFocusHandler.getControlFocusInfo():null;var h=this.aBuffer.join("");if(this._fPutIntoDom){this._fPutIntoDom(T,h);}else{for(var i=0;i<this.aRenderedControls.length;i++){var o=this.aRenderedControls[i].getDomRef();if(o&&!R.isPreservedContent(o)){if(R.isInlineTemplate(o)){q(o).empty();}else{q(o).remove();}}}if(typeof v==="number"){if(v<=0){q(T).prepend(h);}else{var $=q(T).children().eq(v-1);if($.length===1){$.after(h);}else{q(T).append(h);}}}else if(!v){q(T).html(h);}else{q(T).append(h);}}f(this,this.aRenderedControls,s);this.aRenderedControls=[];this.aBuffer=[];this.aStyleStack=[{}];q.sap.act.refresh();q.sap.interaction.notifyStepEnd();};R.prototype.render=function(C,T){if(this.bRendererMode){q.sap.log.info("Render must not be called from control renderers. Call ignored.",null,this);return;}if(this._bLocked){q.sap.log.error("Render must not be called within Before or After Rendering Phase. Call ignored.",null,this);return;}this.aRenderedControls=[];this.aBuffer=[];this.aStyleStack=[{}];this.renderControl(C);this._fPutIntoDom=function(o,h){if(C&&T){var e=C.getDomRef();if(!e||R.isPreservedContent(e)){e=q.sap.domById(b.Invisible+C.getId())||q.sap.domById(b.Dummy+C.getId());}var n=e&&e.parentNode!=T;var A=function(){var j=q(T);if(T.innerHTML==""){j.html(h);}else{j.append(h);}};if(n){if(!R.isPreservedContent(e)){if(R.isInlineTemplate(e)){q(e).empty();}else{q(e).remove();}}if(h){A();}}else{if(h){if(e){if(R.isInlineTemplate(e)){q(e).html(h);}else if(this._isDomPathingEnabled()){q.sap.replaceDOM(e,h,true);}else{q(e).replaceWith(h);}}else{A();}}else{if(R.isInlineTemplate(e)){q(e).empty();}else{if(!C.getParent()||!C.getParent()._onChildRerenderedEmpty||!C.getParent()._onChildRerenderedEmpty(C,e)){q(e).remove();}}}}}};this.flush(T,true);this._fPutIntoDom=null;};}());R.getRenderer=function(C){return C.getMetadata().getRenderer();};R.forceRepaint=function(D){var o=typeof D=="string"?q.sap.domById(D):D;if(o){q.sap.log.debug("forcing a repaint for "+(o.id||String(o)));var O=o.style.display;var A=document.activeElement;o.style.display="none";o.offsetHeight;o.style.display=O;if(document.activeElement!==A){q.sap.focus(A);}}};R.createInvisiblePlaceholderId=function(e){return b.Invisible+e.getId();};(function(){var e="sap-ui-preserve",f="sap-ui-static",A="data-sap-ui-preserve",g="data-sap-ui-area";function h(){var $=q.sap.byId(e);if($.length===0){$=q("<DIV/>",{"aria-hidden":"true",id:e}).addClass("sapUiHidden").addClass("sapUiForcedHidden").css("width","0").css("height","0").css("overflow","hidden").appendTo(document.body);}return $;}function m(n){q("<DIV/>",{id:b.Dummy+n.id}).addClass("sapUiHidden").insertBefore(n);}R.preserveContent=function(r,p,P){sap.ui.getCore().getEventBus().publish("sap.ui","__preserveContent",{domNode:r});var $=h();function k(i){if(i.id===e||i.id===f){return;}if(i.hasAttribute(A)){if(i===r){m(i);}$.append(i);}else if(P&&i.id){R.markPreservableContent(q(i),i.id);$.append(i);return;}if(!i.hasAttribute(g)){var n=i.firstChild;while(n){i=n;n=n.nextSibling;if(i.nodeType===1){k(i);}}}}q.sap.measure.start(r.id+"---preserveContent","preserveContent for "+r.id,["rendering","preserve"]);if(p){k(r);}else{q(r).children().each(function(i,n){k(n);});}q.sap.measure.end(r.id+"---preserveContent");};R.findPreservedContent=function(i){var $=h(),k=$.children("["+A+"='"+i.replace(/(:|\.)/g,'\\$1')+"']");return k;};R.markPreservableContent=function($,i){$.attr(A,i);};R.isPreservedContent=function(D){return(D&&D.getAttribute(A)&&D.parentNode&&D.parentNode.id==e);};R.getPreserveAreaRef=function(){return h()[0];};var j="data-sap-ui-template";R.markInlineTemplate=function($){$.attr(j,"");};R.isInlineTemplate=function(D){return(D&&D.hasAttribute(j));};}());R.prototype.write=function(T){this.aBuffer.push.apply(this.aBuffer,arguments);return this;};R.prototype.writeEscaped=function(T,l){T=q.sap.encodeHTML(T);if(l){T=T.replace(/&#xa;/g,"<br>");}this.aBuffer.push(T);return this;};R.prototype.translate=function(k){};R.prototype.writeAcceleratorKey=function(){return this;};R.prototype.addStyle=function(n,v){if(v!==undefined&&v!==null){var s=this.aStyleStack[this.aStyleStack.length-1];if(!s.aStyle){s.aStyle=[];}s.aStyle.push(n+":"+v);}return this;};R.prototype.writeStyles=function(){var s=this.aStyleStack[this.aStyleStack.length-1];if(s.aStyle){this.write(" style=\""+s.aStyle.join(";")+"\" ");}s.aStyle=null;return this;};R.prototype.addClass=function(n){if(n){var s=this.aStyleStack[this.aStyleStack.length-1];if(!s.aClasses){s.aClasses=[];}s.aClasses.push(n);}return this;};R.prototype.writeClasses=function(e){var s=this.aStyleStack[this.aStyleStack.length-1];var C;if(e){C=e.aCustomStyleClasses;}else if(e===false){C=[];}else{C=s.aCustomStyleClasses;}if(s.aClasses||C){var f=[].concat(s.aClasses||[],C||[]);f.sort();f=q.map(f,function(n,i){return(i==0||n!=f[i-1])?n:null;});this.write(" class=\"",f.join(" "),"\" ");}if(!e){s.aCustomStyleClasses=null;}s.aClasses=null;return this;};R.prototype.writeControlData=function(C){this.writeElementData(C);return this;};R.prototype.writeInvisiblePlaceholderData=function(e){var p=R.createInvisiblePlaceholderId(e),P=' '+'id="'+p+'" '+'class="sapUiHiddenPlaceholder" '+'data-sap-ui="'+p+'" '+'style="display: none;"'+'aria-hidden="true" ';this.write(P);return this;};R.prototype.writeElementData=function(e){var s=e.getId();if(s){this.writeAttribute("id",s).writeAttribute("data-sap-ui",s);}var D=e.getCustomData();var l=D.length;for(var i=0;i<l;i++){var C=D[i]._checkWriteToDom(e);if(C){this.writeAttributeEscaped(C.key,C.value);}}return this;};R.prototype.writeAttribute=function(n,v){this.write(" ",n,"=\"",v,"\"");return this;};R.prototype.writeAttributeEscaped=function(n,v){this.writeAttribute(n,q.sap.encodeHTML(String(v)));return this;};R.prototype.writeAccessibilityState=function(e,P){if(!sap.ui.getCore().getConfiguration().getAccessibility()){return this;}if(arguments.length==1&&!(a(e,'sap/ui/core/Element'))){P=e;e=null;}var A={};if(e!=null){var m=e.getMetadata();var f=function(E,s,v){var o=m.getProperty(E);if(o&&e[o._sGetter]()===v){A[s]="true";}};var g=function(E,s){var o=m.getAssociation(E);if(o&&o.multiple){var n=e[o._sGetter]();if(E=="ariaLabelledBy"){var r=L.getReferencingLabels(e);var u=r.length;if(u){var F=[];for(var i=0;i<u;i++){if(n.indexOf(r[i])<0){F.push(r[i]);}}n=F.concat(n);}}if(n.length>0){A[s]=n.join(" ");}}};f("editable","readonly",false);f("enabled","disabled",false);f("visible","hidden",false);if(L.isRequired(e)){A["required"]="true";}f("selected","selected",true);f("checked","checked",true);g("ariaDescribedBy","describedby");g("ariaLabelledBy","labelledby");}if(P){var h=function(v){var i=typeof(v);return v===null||v===""||i==="number"||i==="string"||i==="boolean";};var j={};var x,k,l;for(x in P){k=P[x];if(h(k)){j[x]=k;}else if(typeof(k)==="object"&&h(k.value)){l="";if(k.append&&(x==="describedby"||x==="labelledby")){l=A[x]?A[x]+" ":"";}j[x]=l+k.value;}}q.extend(A,j);}if(a(e,'sap/ui/core/Element')&&e.getParent()&&e.getParent().enhanceAccessibilityState){e.getParent().enhanceAccessibilityState(e,A);}for(var p in A){if(A[p]!=null&&A[p]!==""){this.writeAttributeEscaped(p==="role"?p:"aria-"+p,A[p]);}}return this;};R.prototype.writeIcon=function(u,C,A){var e=sap.ui.requireSync("sap/ui/core/IconPool"),i=e.isIconURI(u),s=i?"<span ":"<img ",f=false,g,p,o,D,l,h;if(typeof C==="string"){C=[C];}if(i){o=e.getIconInfo(u);if(!o){q.sap.log.error("An unregistered icon: "+u+" is used in sap.ui.core.RenderManager's writeIcon method.");return this;}if(!C){C=[];}C.push("sapUiIcon");if(!o.suppressMirroring){C.push("sapUiIconMirrorInRTL");}}this.write(s);if(Array.isArray(C)&&C.length){g=C.join(" ");this.write("class=\""+g+"\" ");}if(i){D={"data-sap-ui-icon-content":o.content,"role":"presentation","title":o.text||null};this.write("style=\"font-family: "+o.fontFamily+";\" ");}else{D={role:"presentation",alt:"",src:u};}A=q.extend(D,A);if(!A.id){A.id=q.sap.uid();}if(i){l=A.alt||A.title||o.text||o.name;h=A.id+"-label";if(A["aria-labelledby"]){f=true;A["aria-labelledby"]+=(" "+h);}else if(!A.hasOwnProperty("aria-label")){A["aria-label"]=l;}}if(typeof A==="object"){for(p in A){if(A.hasOwnProperty(p)&&A[p]!==null){this.writeAttributeEscaped(p,A[p]);}}}if(i){this.write(">");if(f){this.write("<span style=\"display:none;\" id=\""+h+"\">"+l+"</span>");}this.write("</span>");}else{this.write("/>");}return this;};R.prototype._isDomPathingEnabled=function(){if(this._bDomPathing===undefined){this._bDomPathing=this.getConfiguration().getDomPatching();if(this._bDomPathing){q.sap.log.warning("DOM Patching is enabled: This feature should be used only for the testing purposes!");}}return this._bDomPathing;};var d={render:function(r,C){r.write("<span");r.writeInvisiblePlaceholderData(C);r.write("></span>");}};return R;});