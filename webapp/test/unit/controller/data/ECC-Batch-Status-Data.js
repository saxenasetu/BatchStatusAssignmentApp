sap.ui.define([], function() {
	return {
		"BatchesWithoutCharacteristics": [{
			"Characteristics": [],
			"BatchTree": [{
				"Characteristics": []
			}]
		}],
		"BatchesWithoutStatusCharacteristics": [{
			"Characteristics": ["OnlyOtherCharateristics/0", "OnlyOtherCharateristics/1"],
			"BatchTree": [{
				"Characteristics": ["OnlyOtherCharateristics/0", "OnlyOtherCharateristics/1"]
			}]
		}],
		"ThreeAcceptedBatches": [{
			"Characteristics": ["AcceptedCharateristic/0"],
			"BatchTree": [{
				"Characteristics": ["AcceptedCharateristic/0", "AcceptedCharateristic/0"]
			}]
		}],
		"TwoApprovedBatches": [{
			"Characteristics": [],
			"BatchTree": [{
				"Characteristics": ["ApprovedCharateristic/0", "ApprovedCharateristic/0"]
			}]
		}],
		"FourDispensationBatches": [{
			"Characteristics": ["DispensationCharateristic/0"],
			"BatchTree": [{
				"Characteristics": ["DispensationCharateristic/0", "DispensationCharateristic/0", "DispensationCharateristic/0"]
			}]
		}],
		"TwoLimitedBatches": [{
			"Characteristics": ["LimitedCharateristic/0"],
			"BatchTree": [{
				"Characteristics": ["LimitedCharateristic/0"]
			}]
		}],
		"ThreeOnHoldBatches": [{
			"Characteristics": [],
			"BatchTree": [{
				"Characteristics": ["OnHoldCharateristic/0", "OnHoldCharateristic/0", "OnHoldCharateristic/0"]
			}]
		}],
		"FourPreApprovedBatches": [{
			"Characteristics": ["PreApprovedCharateristic/0"],
			"BatchTree": [{
				"Characteristics": ["PreApprovedCharateristic/0", "PreApprovedCharateristic/0", "PreApprovedCharateristic/0"]
			}]
		}],
		"TwoQuarantineBatches": [{
			"Characteristics": ["QuarantineCharateristic/0"],
			"BatchTree": [{
				"Characteristics": ["QuarantineCharateristic/0"]
			}]
		}],
		"ThreeRejectedBatches": [{
			"Characteristics": ["AcceptedCharateristic/0"],
			"BatchTree": [{
				"Characteristics": ["RejectedCharateristic/0", "RejectedCharateristic/0", "RejectedCharateristic/0"]
			}]
		}],
		"FourTechnicalBatches": [{
			"Characteristics": ["AcceptedCharateristic/0"],
			"BatchTree": [{
				"Characteristics": ["TechnicalCharateristic/0", "TechnicalCharateristic/0", "TechnicalCharateristic/0", "TechnicalCharateristic/0"]
			}]
		}],
		"TwoQuarantineTransferBatches": [{
			"Characteristics": ["QuarantineTransferCharateristic/0"],
			"BatchTree": [{
				"Characteristics": ["QuarantineTransferCharateristic/0", "AcceptedCharateristic/0"]
			}]
		}],
		
		"OnlyOtherCharateristics": [{
			"CharacteristicName": "ZBM_0021",
			"CharacteristicValue": "Foo"
		}, {
			"CharacteristicName": "ZBM_0022",
			"CharacteristicValue": "Bar"
		}],
		"AcceptedCharateristic": [{
			"CharacteristicName": "ZBM_0020",
			"CharacteristicValue": "Accepted"
		}],
		"ApprovedCharateristic": [{
			"CharacteristicName": "ZBM_0020",
			"CharacteristicValue": "Approved"
		}],
		"DispensationCharateristic": [{
			"CharacteristicName": "ZBM_0020",
			"CharacteristicValue": "Dispensation"
		}],
		"LimitedCharateristic": [{
			"CharacteristicName": "ZBM_0020",
			"CharacteristicValue": "Limited"
		}],
		"OnHoldCharateristic": [{
			"CharacteristicName": "ZBM_0020",
			"CharacteristicValue": "On-Hold"
		}],
		"PreApprovedCharateristic": [{
			"CharacteristicName": "ZBM_0020",
			"CharacteristicValue": "Pre-Approved"
		}],
		"QuarantineCharateristic": [{
			"CharacteristicName": "ZBM_0020",
			"CharacteristicValue": "Quarantine"
		}],
		"RejectedCharateristic": [{
			"CharacteristicName": "ZBM_0020",
			"CharacteristicValue": "Rejected"
		}],
		"TechnicalCharateristic": [{
			"CharacteristicName": "ZBM_0020",
			"CharacteristicValue": "Technical"
		}],
		"QuarantineTransferCharateristic": [{
			"CharacteristicName": "ZBM_0020",
			"CharacteristicValue": "Quarantine Transfer"
		}]
	};
});