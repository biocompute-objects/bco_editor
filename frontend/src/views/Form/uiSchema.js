export default {
	"object_id": {
		"ui:title": "BCO ID",
		"type": "Control",
		"scope": "#/properties/object_id"
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
	},
	"error_domain": {
		"empirical_error": {
			"ui:widget": "textarea"
		},
		"algorithmic_error": {
			"ui:widget": "textarea"
		}
	}
}