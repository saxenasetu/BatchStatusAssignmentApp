sap.ui.define([
	"sap/ui/base/ManagedObject",
	"com/novonordisk/ibr/BatchStatusAssignmentApp/controller/Main.controller",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit",
	"./data/ECC-Batch-Status-Data"
], function (ManagedObject, MainController, Controller, JSONModel, sinon, sinonQunit, eccBatchStatusData) {
	"use strict";

	QUnit.module("ECC Batch Status", {
		beforeEach: function() {
			this._oController = new MainController();
			var oJSONModelStub = new JSONModel(eccBatchStatusData);
			var oViewStub = new ManagedObject();
			this._oGetViewStub = sinon.stub(Controller.prototype, "getView").returns(oViewStub);
			oViewStub.setModel(oJSONModelStub, "ecc");
		},
		afterEach: function() {
			this._oGetViewStub.restore();
		}
	});

	QUnit.test("US-22505_Negative: No characteristics available at all", function (assert) {
		var iCount = this._oController._countAcceptedBatches(["BatchesWithoutCharacteristics/0", "BatchesWithoutCharacteristics/0/BatchTree/0"]);
		assert.strictEqual(iCount, 0, "Counted 0 when no characteristics available");
	});
	
	QUnit.test("US-22505_Negative: No status characteristics available", function (assert) {
		var iCount = this._oController._countAcceptedBatches(["BatchesWithoutStatusCharacteristics/0", "BatchesWithoutStatusCharacteristics/0/BatchTree/0"]);
		assert.strictEqual(iCount, 0, "Counted 0 when no status characteristics available");
	});

	QUnit.test("US-22505_Positive: Count accepted status", function (assert) {
		var iCount = this._oController._countAcceptedBatches(["ThreeAcceptedBatches/0", "ThreeAcceptedBatches/0/BatchTree/0"]);
		assert.strictEqual(iCount, 3, "Counted 3 when 3 accepted characteristics were available");
	});
	
	QUnit.test("US-22505_Positive: Count approved status", function (assert) {
		var iCount = this._oController._countApprovedBatches(["TwoApprovedBatches/0", "TwoApprovedBatches/0/BatchTree/0"]);
		assert.strictEqual(iCount, 2, "Counted 2 when 2 approved characteristics were available");
	});
	
	QUnit.test("US-22505_Positive: Count dispensation status", function (assert) {
		var iCount = this._oController._countDispensationBatches(["FourDispensationBatches/0", "FourDispensationBatches/0/BatchTree/0"]);
		assert.strictEqual(iCount, 4, "Counted 4 when 4 dispensation characteristics were available");
	});
	
	QUnit.test("US-22505_Positive: Count limited status", function (assert) {
		var iCount = this._oController._countLimitedBatches(["TwoLimitedBatches/0", "TwoLimitedBatches/0/BatchTree/0"]);
		assert.strictEqual(iCount, 2, "Counted 2 when 2 limited characteristics were available");
	});
	
	QUnit.test("US-22505_Positive: Count on-hold status", function (assert) {
		var iCount = this._oController._countOnHoldBatches(["ThreeOnHoldBatches/0", "ThreeOnHoldBatches/0/BatchTree/0"]);
		assert.strictEqual(iCount, 3, "Counted 3 when 3 on-hold characteristics were available");
	});
	
	QUnit.test("US-22505_Positive: Count pre-approved status", function (assert) {
		var iCount = this._oController._countPreApprovedBatches(["FourPreApprovedBatches/0", "FourPreApprovedBatches/0/BatchTree/0"]);
		assert.strictEqual(iCount, 4, "Counted 4 when 4 pre-approved characteristics were available");
	});
	
	QUnit.test("US-22505_Positive: Count quarantine status", function (assert) {
		var iCount = this._oController._countQuarantineBatches(["TwoQuarantineBatches/0", "TwoQuarantineBatches/0/BatchTree/0"]);
		assert.strictEqual(iCount, 2, "Counted 2 when 2 quarantine characteristics were available");
	});
	
	QUnit.test("US-22505_Positive: Count rejected status", function (assert) {
		var iCount = this._oController._countRejectedBatches(["ThreeRejectedBatches/0", "ThreeRejectedBatches/0/BatchTree/0"]);
		assert.strictEqual(iCount, 3, "Counted 3 when 3 rejected characteristics were available");
	});
	
	QUnit.test("US-22505_Positive: Count technical status", function (assert) {
		var iCount = this._oController._countTechnicalBatches(["FourTechnicalBatches/0", "FourTechnicalBatches/0/BatchTree/0"]);
		assert.strictEqual(iCount, 4, "Counted 4 when 4 technical characteristics were available");
	});
	
	QUnit.test("US-22505_Positive: Count quarantine transfer status", function (assert) {
		var iCount = this._oController._countQuarantineTransferBatches(["TwoQuarantineTransferBatches/0", "TwoQuarantineTransferBatches/0/BatchTree/0"]);
		assert.strictEqual(iCount, 2, "Counted 2 when 2 quarantine transfer characteristics were available");
	});

});