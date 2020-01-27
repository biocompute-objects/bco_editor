export default {
	"bco_id": {
		"ui:title": "BCO ID",
		"type": "Control",
		"scope": "#/properties/bco_id"
	},
	"provenance_domain": {
		"type": "VerticalLayout",
		"elements": [
			{
				"type": "Control",
				"scope": "#/properties/provenance_domain",
				"options": {
					"elementLabelProp": "Provenance name",
					"detail": {
						"type": "VerticalLayout",
						"elements": [
							{
								"type": "Control",
								"scope": "#/properties/message"
							},
							{
								"type": "Control",
								"scope": "#/properties/name"
							}
						]
					}
				}
			}
		]		
	}
}