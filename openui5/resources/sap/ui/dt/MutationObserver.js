/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/dt/OverlayUtil','sap/ui/dt/ElementUtil','sap/ui/base/ManagedObject'],function(q,O,E,M){"use strict";var a=M.extend("sap.ui.dt.MutationObserver",{metadata:{library:"sap.ui.dt",events:{domChanged:{parameters:{type:{type:"string"},elemenIds:{type:"string[]"},targetNodes:{type:"element[]"}}}}}});a.prototype.init=function(){var t=this;this._fnFireResizeDomChanged=function(){t.fireDomChanged({type:"resize"});};this._onScroll=this._fireDomChangeOnScroll.bind(this);this._startMutationObserver();this._startResizeObserver();this._startScrollObserver();};a.prototype.exit=function(){this._stopMutationObserver();this._stopResizeObserver();this._stopScrollObserver();};a.prototype._startMutationObserver=function(){var t=this;if(this._oMutationObserver){return;}var a=window.MutationObserver||window.WebKitMutationObserver;if(a){this._oMutationObserver=new a(function(m){var T=[];var e=[];m.forEach(function(o){var b=o.target;if(o.type==="characterData"){b=o.target.parentNode;}if(!O.isInOverlayContainer(b)){T.push(b);var c=O.getClosestOverlayForNode(b);var s=c?c.getElementInstance().getId():undefined;if(s){e.push(s);}}});if(T.length){t.fireDomChanged({type:"mutation",elementIds:e,targetNodes:T});}});this._oMutationObserver.observe(window.document,{childList:true,subtree:true,attributes:true,attributeFilter:["style","class","width","height","border"],characterData:true});}else{q.sap.log.error("Mutation Observer is not available");}};a.prototype._stopMutationObserver=function(){if(this._oMutationObserver){this._oMutationObserver.disconnect();delete this._oMutationObserver;}};a.prototype._startResizeObserver=function(){q(window).on("resize",this._fnFireResizeDomChanged);};a.prototype._stopResizeObserver=function(){q(window).off("resize",this._fnFireResizeDomChanged);};a.prototype._fireDomChangeOnScroll=function(e){var t=e.target;if(!O.isInOverlayContainer(t)&&!O.getClosestOverlayForNode(t)){this.fireDomChanged({type:"scroll"});}};a.prototype._startScrollObserver=function(){window.addEventListener("scroll",this._onScroll,true);};a.prototype._stopScrollObserver=function(){window.removeEventListener("scroll",this._onScroll,true);};return a;},true);
