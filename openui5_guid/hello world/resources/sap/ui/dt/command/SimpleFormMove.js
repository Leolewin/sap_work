/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/dt/command/BaseCommand','sap/ui/dt/ElementUtil'],function(q,B,E){"use strict";var S=B.extend("sap.ui.dt.command.SimpleFormMove",{metadata:{properties:{movedElements:{type:"array"},target:{type:"object"},source:{type:"object"},changeType:{type:"string",defaultValue:"moveSimpleFormElement"},action:{type:"object"}}}});S.prototype._setReverseAction=function(o){this._reverseAction=o;};S.prototype._getReverseAction=function(){return(this._reverseAction);};S.prototype._executeWithElement=function(o){o=g(o);var h=this.getAction();if(!h){var i=o;var j=this.getMovedElements();if(j.length>1){q.sap.log.warning("Moving more than 1 Formelement is not yet supported.");}var k=j[0].element;var t=this.getTarget();if(k instanceof sap.ui.layout.form.FormContainer){h=f(i,k,t);}else if(k instanceof sap.ui.layout.form.FormElement){h=b(i,k,t);}this.setAction(h);var R=q.extend(true,{},h);R.source.elements=G(sap.ui.getCore().byId(h.target.parent),h);this._setReverseAction(R);}if(h){d(h);}};S.prototype._undoWithElement=function(o){s(this);this._executeWithElement(o);};var g=function(o){if(E.isInstanceOf(o,"sap.ui.layout.form.SimpleForm")){return o;}else if(E.isInstanceOf(o,"sap.ui.layout.form.Form")||E.isInstanceOf(o,"sap.ui.layout.form.FormContainer")||E.isInstanceOf(o,"sap.ui.layout.form.FormElement")){return g(o.getParent());}};var m=function(t,C,h){var R;var j=-1;for(var i=0;i<C.length;i++){if(C[i]instanceof t){j++;if(j===h){R=C[i];break;}}}return C.indexOf(R);};var M=function(F){var h=F.getFormElements();var i=h.reduce(function(p,j,k,l){p+=j.getFields().length+1;return p;},1);return i;};var e=function(C){var R=[];for(var i=0;i<C.length;i++){R.push(C[i].getId());}return R;};var a=function(h,j,t,T,k){var R=t;for(var i=0;i<k;i++){R.splice(T+i,0,h[j+i]);}return R;};var c=function(p,h){return{changeType:'reorder_aggregation',source:{elements:h},target:{parent:p,aggregation:'content'}};};var f=function(o,h,t){var C=o.getContent();var i=h.getTitle();var j=C.indexOf(i);var T=m(sap.ui.core.Title,C,t.index);var k=M(h);var l=C.slice();l.splice(j,k);l=a(C,j,l,T,k);return c(o.getId(),e(l));};var b=function(o,h,t){var C=o.getContent();var F=t.parent.getFormElements();var i=C.indexOf(h.getLabel());var j=F[t.index].getFields().length+1;var T=C.indexOf(t.parent.getTitle());if(T>i){T=T-j;}var O=0;for(var k=0;k<t.index;k++){O=O+F[k].getFields().length+1;}T=T+O+1;var l=C.slice();l.splice(i,j);l=a(C,i,l,T,j);return c(o.getId(),e(l));};var G=function(t,o){var h=E.getAggregationAccessors(t,o.target.aggregation).get;return e(t[h]());};var r=function(t,o){var h=E.getAggregationAccessors(t,o.target.aggregation).removeAll;t[h]();};var A=function(t,o){var h=E.getAggregationAccessors(t,o.target.aggregation).add;var i;for(var j=0;j<o.source.elements.length;j++){i=sap.ui.getCore().byId(o.source.elements[j]);t[h](i);}};var d=function(o){var t=sap.ui.getCore().byId(o.target.parent);r(t,o);A(t,o);};var s=function(C){var t=C._getReverseAction();C._setReverseAction(C.getAction());C.setAction(t);};return S;},true);