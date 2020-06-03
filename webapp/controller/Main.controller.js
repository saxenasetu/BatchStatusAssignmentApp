sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"com/novonordisk/ibr/BatchStatusAssignmentApp/controller/PDFGenerator",
	"com/novonordisk/ibr/BatchStatusAssignmentApp/model/commonFormatter"
], function (Controller, JSONModel, PDFGenerator, commonFormatter) {
	"use strict";
	return Controller.extend("com.novonordisk.ibr.BatchStatusAssignmentApp.controller.Main", {
		commonFormatter: commonFormatter,
		
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("ReleaseBatch").attachPatternMatched(this._onPathMatched, this);
			this.pingAnalytics();
		},
		
			
		pingAnalytics: function(){
			jQuery.sap.includeScript({
	            url : "//cdn.appdynamics.com/adrum/adrum-4.5.17.2890.js"
	        });
	         
			window["adrum-start-time"] = new Date().getTime(); //eslint-disable-line sap-no-global-define
			(function(config){
			    config.appKey = "EC-AAB-HTF";
			    config.adrumExtUrlHttp = "http://cdn.appdynamics.com"; //eslint-disable-line sap-no-hardcoded-url
			    config.adrumExtUrlHttps = "https://cdn.appdynamics.com"; //eslint-disable-line sap-no-hardcoded-url
			    config.beaconUrlHttp = "http://fra-col.eum-appdynamics.com"; //eslint-disable-line sap-no-hardcoded-url
			    config.beaconUrlHttps = "https://fra-col.eum-appdynamics.com"; //eslint-disable-line sap-no-hardcoded-url
			    config.xd = {enable : false}; 
			})(window["adrum-config"] || (window["adrum-config"] = {})); //eslint-disable-line sap-no-global-define
		},
		
		_onPathMatched: function(oEvent) {
			var oArguments = oEvent.getParameter("arguments");
			var sPlant = oArguments.plant;
			var sMaterialNumber = oArguments.materialNumber;
			var sBatchNumber = oArguments.batchNumber;
			
			this._refreshData(sPlant, sMaterialNumber, sBatchNumber);
		},
		
		_bindData: function(sPlant,sMaterialNumber,sBatchNumber){
			var oView = this.getView();
			var oMappedModel = oView.getModel("mappedData");
			
			var sPath = "/Batches(plant='" + sPlant + "',materialNumber='" + sMaterialNumber + "',batchNumber='" + sBatchNumber + "')";
			oView.bindElement({
				path: sPath
			});
			
			var oIngoingBatchesModel = new JSONModel({});
			oView.setModel(oIngoingBatchesModel, "ingoingBatches");
			this._bindIngoinBatchInformation(sPlant, sMaterialNumber, sBatchNumber);
			this.getBuildingAndPlant(sMaterialNumber, sPlant).then(function (response) {
				if (response.Result[0]) {
					var building = response.Result[0].SiteBuilding.Building;
					var site = response.Result[0].SiteBuilding.Site;
					oMappedModel.setProperty("/building", building);
					oMappedModel.setProperty("/site", site);
				}
			});
			
		},
		
		_refreshData: function(sPlant,sMaterialNumber,sBatchNumber){
			var state = this.getView().getModel("state");
			state.setProperty("/loading", true);
			this._whenDataRefreshed(sPlant,sMaterialNumber,sBatchNumber).then(function(oData){
				this._bindData(sPlant,sMaterialNumber,sBatchNumber);
				state.setProperty("/loading", false);
			}.bind(this)).catch(function(error){
				sap.m.MessageToast.show("Data could not be refreshed");
			});
		},
		
		_whenDataRefreshed: function(sPlant,sMaterialNumber,sBatchNumber){
			var payload = {
				"batchNumber": sBatchNumber,
				"plant": sPlant,
				"materialNumber": sMaterialNumber
			};
				
			return new Promise(function(resolve, reject) {
				$.ajax({
					url:  this._getServicePathFromManifest("cpiDataRefresh"),
					type: "POST",
					data: JSON.stringify(payload),
					contentType: "application/json",
					dataType: "json",
					success: function (oData) {
						resolve(oData);
					},
					error: function (result, status, xhr) {
						reject(status + result.responseText);
					}
				});
			}.bind(this)
		);},
		
		_getServicePathFromManifest: function(sDataSource) {
			var oManifest = this.getOwnerComponent().getManifestObject();
			var oSapApp = oManifest.getEntry("sap.app");
			return oManifest.resolveUri(oSapApp.dataSources[sDataSource].uri);
		},
		
		_bindIngoinBatchInformation: function(sPlant, sMaterialNumber, sBatchNumber) {
			var oIngoingBatchesModel = this.getView().getModel("ingoingBatches");
			this._whenIngoingBatchInformationRetrievedFor(this._expandBatch,"Notifications", sPlant, sMaterialNumber, sBatchNumber, true /*bIncludeCurrentBatch*/).then(function(oData) {
				oIngoingBatchesModel.setProperty("/Notifications", oData);
			});
			this._whenIngoingBatchInformationRetrievedFor(this._expandBatch,"EccLimitingBatchReleases", sPlant, sMaterialNumber, sBatchNumber, true /*bIncludeCurrentBatch*/).then(function(oData) {
				oIngoingBatchesModel.setProperty("/EccLimitingBatchReleases", oData);
			});
			this._whenIngoingBatchInformationRetrievedFor(this._expandBatch,"Deviations", sPlant, sMaterialNumber, sBatchNumber, true /*bIncludeCurrentBatch*/).then(function(oData) {
				oIngoingBatchesModel.setProperty("/Deviations", oData);
			});
			this._whenIngoingBatchInformationRetrievedFor(this._expandComponent,"Components", sPlant, sMaterialNumber, sBatchNumber).then(function(oData) {
				var oGroupedComponents = this._groupComponents(oData,"component_materialNumber");
				var aGroupedComponents = Object.values(oGroupedComponents);
				oIngoingBatchesModel.setProperty("/Components", aGroupedComponents);
			}.bind(this));
		
		},
		
		_expandBatch: function(sEnititySetName, sPlant, sMaterialNumber, sBatchNumber){
			return sEnititySetName + "?$expand=batch($expand=parents($filter=product_plant eq '" + sPlant 
							+ "' and product_materialNumber eq '" + sMaterialNumber + "' and product_batchNumber eq '" + sBatchNumber + "'))";
	
		},
		
		_expandComponent: function(sEnititySetName, sPlant, sMaterialNumber, sBatchNumber){
				return sEnititySetName + "?$apply=filter(product_plant eq '" +sPlant+ "' and product_materialNumber eq '" +sMaterialNumber+ "' and product_batchNumber eq '" +sBatchNumber+ "')/groupby((component_materialNumber,component/materialDescription,component/dateOfManufacture))";
				
		},
		
		_groupComponents: function(aComponents, sProperty) {
		  return aComponents.reduce(function (oAcc, oBatch) {
		    var key = oBatch[sProperty];
		    if (!oAcc[key]) {
		    	oAcc[key] = {
		     	iCount: 0,
		     	sMaterialDescription: oBatch.component.materialDescription,
		     	aDates: [],
		     	sMaterialNumber: ""
		     };
		    }
		    oAcc[key].aDates.push(oBatch.component.dateOfManufacture);
		    oAcc[key].oDates = this._findStartAndEndDate(oAcc[key].aDates);
		    oAcc[key].iCount = +oAcc[key].iCount + 1;
		    oAcc[key].sMaterialNumber = key;
		    return oAcc;
		  }.bind(this), {});
		},
		
		_findStartAndEndDate: function(aDates){
			var min = aDates[0];
			var max = aDates[0];
			aDates.forEach(function(date){
				if (date < min){
				    min = date;
				}
				if (date > max){
				    max = date;
				}
				}.bind(this));
			return {sStartDate: min, sEndDate: max};
		},
	
		
		_whenIngoingBatchInformationRetrievedFor: function(fExpand,sEnititySetName, sPlant, sMaterialNumber, sBatchNumber, bIncludeCurrentBatch) {
			var sPath = fExpand(sEnititySetName, sPlant, sMaterialNumber, sBatchNumber);
			return new Promise(function(resolve, reject) {
				$.ajax({
					url: this._getServicePathFromManifest("default") + sPath,
					contentType: "application/json",
					dataType: "json",
					success: function (oData) {
						if (oData.value && oData.value.length) {
							var aResults = oData.value.filter(function(oEntity) {
								if(oEntity.batch){
									var bIsCurrentBatch = oEntity.batch.plant === sPlant && oEntity.batch.materialNumber === sMaterialNumber && oEntity.batch.batchNumber === sBatchNumber;
									return oEntity.batch.parents.length > 0 || (bIncludeCurrentBatch && bIsCurrentBatch);
								}
								if(oEntity.component_materialNumber){
									return oEntity;
								}
								if (!oEntity.batch || !oEntity.component_materialNumber) {
									return false;
								}
							});
							resolve(aResults);
						} else {
							resolve([]);
						}
					},
					error: function (result, status, xhr) {
						reject(status + result.responseText);
					}
				});
			}.bind(this));
		},
		
		regEx: function(sString, sPattern,index){
			var sResult = sPattern.exec(sString);
			if(!sResult.length === index + 1){
				return null;
			}
			return sResult[index];
		},
		
		assignBatch: function (oEvent) {
			var oView = this.getView();
			var oPage = oView.byId("batchStatusAssignmentPage");
			var oBindingContext = oPage.getBindingContext();
			var oMappedDataModel = oView.getModel("mappedData");
			
			var generator = new PDFGenerator();
			//var file = 
			generator.generateBatchAssignmentPDF({
				plant: oBindingContext.getProperty("plant"),
				materialNumber: oBindingContext.getProperty("materialNumber"),
				batchNumber: oBindingContext.getProperty("batchNumber"),
				batchStatus: oBindingContext.getProperty("batchStatus"),
				summaryStatus: "",
				dateOfManufacture: oBindingContext.getProperty("dateOfManufacture"),
				site: oMappedDataModel.getProperty("/site"),
				building: oMappedDataModel.getProperty("/building")
			});
			//this.postPdfToQD(file);
		},
		
		postPdfToQD: function (file) {
			$.ajax({
				type: "POST",
				url: this._getServicePathFromManifest("cpiDoc"),
				headers: {
					"request-mock": false,
					"request-jsonmeta": JSON.stringify({
						batchNumber: 23,
						plant: 2044
					})
				},
				data: file,
				contentType: "application/octet-stream",
				processData: false,
				success: function (result, status, xhr) {
					$("#result").html(result.responseStatus + JSON.stringify(result));
				},
				error: function (result, status, xhr) {
					$("#result").html(status + result.responseText);
				}
			});
		},
		
		getBuildingAndPlant: function (sMaterialNumber, sPlant) {
			var payload = {
				"RuleServiceId": "a65f1ec2e2eb482984d3f1722589f7b3",
				"Vocabulary": [{
					"PlantAndItem": {
						"ItemNo": sMaterialNumber,
						"PlantNo": sPlant
					}
				}]
			};
			return new Promise(function (resolve, reject) {
				$.ajax({
					type: "POST",
					url: this._getServicePathFromManifest("businessRules"),
					headers: {
						"Content-Type": "application/json"
					},
					data: JSON.stringify(payload),
					success: function (result, status, xhr) {
						resolve(result);
					},
					error: function (result, status, xhr) {
						reject($("#result").html(status + result.responseText));
					}
				});
			}.bind(this));
		}
	});
});