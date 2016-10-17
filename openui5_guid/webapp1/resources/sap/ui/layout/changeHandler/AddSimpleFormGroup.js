/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/fl/Utils','jquery.sap.global','sap/ui/fl/changeHandler/Base'],function(U,q,B){"use strict";var A={};A.applyChange=function(c,f,m,v){var C=c.getDefinition();if(C.texts&&C.texts.groupLabel&&C.texts.groupLabel.value&&C.content&&C.content.group&&C.content.group.id){var g=C.content.group.id;var l=C.texts.groupLabel.value;var i=C.content.group.index;var t=m.createControl("sap.ui.core.Title",v,g,v);m.setProperty(t,"text",l);m.insertAggregation(f,"content",t,i,v);}else{U.log.error("Change does not contain sufficient information to be applied: ["+C.layer+"]"+C.namespace+"/"+C.fileName+"."+C.fileType);}return true;};A.completeChangeContent=function(c,s){var C=c.getDefinition();if(s.groupLabel){B.setTextInChange(C,"groupLabel",s.groupLabel,"XFLD");}else{throw new Error("oSpecificChangeInfo.groupLabel attribute required");}if(!C.content){C.content={};}if(!C.content.group){C.content.group={};}if(s.newControlId){C.content.group.id=s.newControlId;}else{throw new Error("oSpecificChangeInfo.newControlId attribute required");}if(s.index===undefined){throw new Error("oSpecificChangeInfo.index attribute required");}else{C.content.group.index=s.index;}};A.getControlIdFromChangeContent=function(c){var C;if(c&&c._oDefinition){C=c._oDefinition.content.group.id;}return C;};return A;},true);