sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"com/novonordisk/ibr/BatchStatusAssignmentApp/model/models"
], function (UIComponent, Device, JSONModel, models) {
	"use strict";

	return UIComponent.extend("com.novonordisk.ibr.BatchStatusAssignmentApp.Component", {

		_pWhenBatchKeyReceived: null,

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();
			

			// set the models
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createMappedDataModel(), "mappedData");
			this.setModel(models.createStateModel(),"state");

		}
		
/*
		whenBatchKeyAvailable: function () {
			if (!this._pWhenBatchKeyAvailable) {
				this._pWhenBatchKeyAvailable = new Promise(function (resolve, reject) {

					if (this._isTaskModelAvailable()) {
						var oTaskData = this.getComponentData().startupParameters.taskModel.getData();
						var sTaskId = oTaskData.InstanceID;
						var oContextModel = new JSONModel(
								"/comnovonordiskbatchstatusassignmentBatchStatusAssignmentApp/bpmworkflowruntime/v1/task-instances/" + sTaskId + "/context")
							.attachRequestCompleted(function (oEvent) {
								var oModel = oEvent.getSource();

								var sMaterialNumber = oModel.getProperty("/materialNumber");
								var sPlant = oModel.getProperty("/plant");
								var sBatchNumber = oModel.getProperty("/batchNumber");

								resolve({
									MaterialNumber: sMaterialNumber,
									Plant: sPlant,
									BatchNumber: sBatchNumber
								});
							});
						this.setModel(oContextModel, "context");
					} else {
						//TODO: Get parameters from cross-app routing
						resolve({
							MaterialNumber: jQuery.sap.getUriParameters().get("materialNumber") ? jQuery.sap.getUriParameters().get("materialNumber") : "5050700",
							Plant: jQuery.sap.getUriParameters().get("plant") ? jQuery.sap.getUriParameters().get("plant") : "2038",
							BatchNumber: jQuery.sap.getUriParameters().get("batchNumber") ? jQuery.sap.getUriParameters().get("batchNumber") : "H081030"
						});
					}
				}.bind(this));
			}

			return this._pWhenBatchKeyAvailable;
		},

		_isTaskModelAvailable: function () {
			return (this.getComponentData() && this.getComponentData().startupParameters && this.getComponentData().startupParameters.taskModel);
		}*/
	});
});