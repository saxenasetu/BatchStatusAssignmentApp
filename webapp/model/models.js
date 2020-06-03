sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createMappedDataModel: function () {
			var oModel = new JSONModel();
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},
		
		createStateModel: function () {
			var oModel = new JSONModel();
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		}

	};
});