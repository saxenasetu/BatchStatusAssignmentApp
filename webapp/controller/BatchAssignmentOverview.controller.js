sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/novonordisk/ibr/BatchStatusAssignmentApp/model/commonFormatter"
], function (Controller, Filter, FilterOperator, commonFormatter) {
	"use strict";
	return Controller.extend("com.novonordisk.ibr.BatchStatusAssignmentApp.controller.BatchAssignmentOverview", {
		commonFormatter: commonFormatter,
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.novonordisk.ibr.BatchStatusAssignmentApp.view.BatchAssignmentOverview
		 */
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
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
		
		onAfterRendering: function(){
			this.searchTable();	
		},
		
		searchTable: function() {
			var aFilter = [];
			var oView = this.getView();
			var oTable = this.byId("mainTable");
			var oBinding = oTable.getBinding("items");
			var sBatchQuery = oView.byId("batchSearchField").getValue();
			var sQueryPlant = oView.byId("plantSelect").getSelectedItem();
			aFilter.push(new Filter("toBeStatusAssigned", FilterOperator.EQ, true));
			if(sQueryPlant){
				aFilter.push(new Filter("plant", FilterOperator.EQ, sQueryPlant.getKey()));
			}
			if(sBatchQuery) {
				aFilter.push(new Filter("batchNumber", FilterOperator.Contains, sBatchQuery.toUpperCase()));
			}
			oBinding.filter(aFilter);
			
		},
	
		navigateToDetails: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();
			
			this.getOwnerComponent().getRouter().navTo("ReleaseBatch", {
				plant: oBindingContext.getProperty("plant"),
				materialNumber: oBindingContext.getProperty("materialNumber"),
				batchNumber: oBindingContext.getProperty("batchNumber")
			});
		}
		

	});
});