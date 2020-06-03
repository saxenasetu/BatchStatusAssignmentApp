QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/novonordisk/ibr/BatchStatusAssignmentApp/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});