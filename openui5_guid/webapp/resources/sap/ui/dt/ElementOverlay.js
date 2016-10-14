/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/dt/Overlay','sap/ui/dt/ControlObserver','sap/ui/dt/ManagedObjectObserver','sap/ui/dt/ElementDesignTimeMetadata','sap/ui/dt/AggregationDesignTimeMetadata','sap/ui/dt/AggregationOverlay','sap/ui/dt/OverlayRegistry','sap/ui/dt/ElementUtil','sap/ui/dt/OverlayUtil','sap/ui/dt/DOMUtil'],function(O,C,M,E,A,a,b,c,d,D){"use strict";var e=O.extend("sap.ui.dt.ElementOverlay",{metadata:{library:"sap.ui.dt",properties:{selected:{type:"boolean",defaultValue:false},selectable:{type:"boolean",defaultValue:false},movable:{type:"boolean",defaultValue:false},editable:{type:"boolean",defaultValue:false}},aggregations:{aggregationOverlays:{type:"sap.ui.dt.AggregationOverlay",multiple:true},designTimeMetadata:{type:"sap.ui.dt.ElementDesignTimeMetadata",altTypes:["object"],multiple:false}},events:{selectionChange:{parameters:{selected:{type:"boolean"}}},movableChange:{parameters:{movable:{type:"boolean"}}},selectableChange:{parameters:{selectable:{type:"boolean"}}},editableChange:{parameters:{editable:{type:"boolean"}}},elementModified:{parameters:{type:"string",name:"string",value:"any",oldValue:"any",target:"sap.ui.core.Element"}},requestElementOverlaysForAggregation:{parameters:{name:{type:"string"}}}}}});e.prototype.init=function(){O.prototype.init.apply(this,arguments);this._oMutationObserver=O.getMutationObserver();this._oMutationObserver.attachDomChanged(this._onDomChanged,this);};e.prototype.exit=function(){if(this._oMutationObserver){this._oMutationObserver.detachDomChanged(this._onDomChanged,this);delete this._oMutationObserver;}O.prototype.exit.apply(this,arguments);this._unobserve();b.deregister(this._sElementId);if(!b.hasOverlays()){O.destroyMutationObserver();O.removeOverlayContainer();}delete this._sElementId;};e.prototype.setLazyRendering=function(l){O.prototype.setLazyRendering.apply(this,arguments);if(!l){this.placeInOverlayContainer();}};e.prototype.placeInOverlayContainer=function(){if(!this.getParent()){this.placeAt(O.getOverlayContainer());var u=this.getUIArea();u._onChildRerenderedEmpty=function(){return true;};}};e.prototype.setElement=function(v){var o=this.getElementInstance();if(o instanceof sap.ui.core.Element){b.deregister(o);this._unobserve();}this.setAssociation("element",v);var f=this.getElementInstance();this._sElementId=f.getId();b.register(f,this);this._observe(f);if(this.getDesignTimeMetadata()){this._renderAndCreateAggregation();}return this;};e.prototype.setDesignTimeMetadata=function(v){var o;if(v instanceof E){o=v;}else{o=new E({data:v});}var r=this.setAggregation("designTimeMetadata",o);if(this.getElementInstance()){this._renderAndCreateAggregation();}return r;};e.prototype._renderAndCreateAggregation=function(){this.getAggregationOverlays().forEach(function(o){o.getChildren().forEach(function(f){f.setParent(null);});});this.destroyAggregationOverlays();this._createAggregationOverlays();var p=d.getClosestOverlayFor(this.getElementInstance().getParent());if(p){p.sync();}};e.prototype.getAssociatedDomRef=function(){return c.getDomRef(this.getElementInstance());};e.prototype.setSelectable=function(s){if(s!==this.isSelectable()){if(!s){this.setSelected(false);}this.toggleStyleClass("sapUiDtOverlaySelectable",s);this.setProperty("selectable",s);this.fireSelectableChange({selectable:s});}this.setFocusable(s);return this;};e.prototype.setSelected=function(s,S){if(this.isSelectable()&&s!==this.isSelected()){this.setProperty("selected",s);this.toggleStyleClass("sapUiDtOverlaySelected",s);if(!S){this.fireSelectionChange({selected:s});}}return this;};e.prototype.setMovable=function(m){if(this.getMovable()!==m){this.toggleStyleClass("sapUiDtOverlayMovable",m);this.setProperty("movable",m);this.fireMovableChange({movable:m});}return this;};e.prototype.setEditable=function(f){if(this.getEditable()!==f){this.toggleStyleClass("sapUiDtOverlayEditable",f);this.setProperty("editable",f);this.fireEditableChange({editable:f});}return this;};e.prototype.sync=function(){var t=this;if(this.isVisible()){var f=this.getAggregationOverlays();f.forEach(function(o){t._syncAggregationOverlay(o);});}};e.prototype._createAggregationOverlay=function(s,i){var o=this.getDesignTimeMetadata().getAggregation(s);var f=new A({data:o});var g=new a({aggregationName:s,element:this.getElementInstance(),designTimeMetadata:f,inHiddenTree:i});this._mAggregationOverlays[s]=g;this.addAggregation("aggregationOverlays",g);this._syncAggregationOverlay(g);g.attachVisibleChanged(this._onAggregationVisibleChanged,this);return g;};e.prototype._createAggregationOverlays=function(){var t=this;this._mAggregationOverlays={};var o=this.getElementInstance();var f=this.getDesignTimeMetadata();var m={};c.iterateOverAllPublicAggregations(o,function(i,j){var s=i.name;m[s]=true;t._createAggregationOverlay(s,t.isInHiddenTree());});var g=f.getAggregations();var h=Object.keys(g);h.forEach(function(s){var i=g[s];if(i.ignore===false&&!m[s]){t._createAggregationOverlay(s,true);}});this.sync();};e.prototype._observe=function(o){if(o instanceof sap.ui.core.Control){this._oObserver=new C({target:o});this._oObserver.attachAfterRendering(this._onElementAfterRendering,this);}else{this._oObserver=new M({target:o});}this._oObserver.attachModified(this._onElementModified,this);this._oObserver.attachDestroyed(this._onElementDestroyed,this);};e.prototype._unobserve=function(){if(this._oObserver){this._oObserver.destroy();}};e.prototype._onAggregationVisibleChanged=function(o){var f=o.getSource();this._syncAggregationOverlay(f);};e.prototype._syncAggregationOverlay=function(o){var t=this;if(o.isVisible()){var s=o.getAggregationName();var i=this.getElementInstance()instanceof sap.ui.core.Control;if(!i||this._getElementInstanceVisible()){if(!o.getChildren().length){this.fireRequestElementOverlaysForAggregation({name:s});}}var f=c.getAggregation(this.getElementInstance(),s);f.forEach(function(g){var h=b.getOverlay(g);if(h&&h.getParent()!==t){o.addChild(h);}});}};e.prototype.setVisible=function(v){O.prototype.setVisible.apply(this,arguments);this.sync();};e.prototype.destroyAggregation=function(s,S){O.prototype.destroyAggregation.apply(this,arguments);if(s==="aggregationOverlays"){delete this._mAggregationOverlays;}};e.prototype._onElementModified=function(o){var p=o.getParameters();var s=o.getParameters().name;if(s){this.sync();var f=this.getAggregationOverlay(s);var g=f&&f.isVisible();if(g){this.fireElementModified(p);}}else if(o.getParameters().type==="setParent"){this.fireElementModified(p);}this.invalidate();};e.prototype._onDomChanged=function(o){var i=o.getParameters().elementIds||[];var f=this.getElementInstance();if(f&&i.indexOf(f.getId())!==-1){if(this._mGeometry&&!this._mGeometry.visible){delete this._mGeometry;this.invalidate();}}if(this.isRoot()){this.applyStyles();}};e.prototype._onElementAfterRendering=function(){if(!this.getDomRef()){this.invalidate();}this.sync();};e.prototype._onElementDestroyed=function(){this.destroy();};e.prototype.getAggregationOverlays=function(){return this.getAggregation("aggregationOverlays")||[];};e.prototype.getChildren=function(){return this.getAggregationOverlays();};e.prototype.getAggregationOverlay=function(s){if(this._mAggregationOverlays){return this._mAggregationOverlays[s];}};e.prototype.getParentElementOverlay=function(){var p=this.getParentAggregationOverlay();if(p){return p.getParent();}};e.prototype.getParentAggregationOverlay=function(){var p=this.getParent();return p instanceof sap.ui.dt.AggregationOverlay?p:null;};e.prototype.isSelected=function(){return this.getSelected();};e.prototype.isSelectable=function(){return this.getSelectable();};e.prototype.isMovable=function(){return this.getMovable();};e.prototype.isEditable=function(){return this.getEditable();};e.prototype._getElementInstanceVisible=function(){var o=this.getElementInstance();if(o){var g=this.getGeometry();return g&&g.visible;}else{return false;}};e.prototype.getPublicParentElementOverlay=function(){var p=this.getParentElementOverlay();while(p&&c.isInstanceOf(p,"sap.ui.dt.ElementOverlay")&&p.isInHiddenTree()){p=p.getParentElementOverlay();}return p;};e.prototype.getPublicParentAggregationOverlay=function(){var p;var P=this.getPublicParentElementOverlay();var o=this.getElementInstance();if(P){P.getAggregationOverlays().some(function(f){if(!f.isInHiddenTree()){var g=P.getElementInstance();var s=f.getAggregationName();var i=c.getIndexInAggregation(o,g,s);if(i!==-1){p=f;return true;}}});}return p;};return e;},true);