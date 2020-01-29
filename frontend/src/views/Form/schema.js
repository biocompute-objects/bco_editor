export default {
    "description": "All BioCompute object types must adhere to this type in order to be compliant with BioCompute specification",
    "title": "Base type for all BioCompute Objects",
    "$id": "http://www.w3id.org/biocompute/1.3.0/schemas/biocomputeobject.json",
    "required": [
        "bco_id",
        "bco_spec_version",
        "provenance_domain",
        "usability_domain",
        "description_domain",
        "execution_domain",
        "io_domain",
        "error_domain"
    ],
    "additionalProperties": false,
    "definitions": {
        "contributor": {
            "additionalProperties": false,
            "required": [
                "contribution",
                "name",
                "email"
            ],
            "type": "object",
            "description": "Contributor identifier and type of contribution (determined according to PAV ontology) is required",
            "properties": {
                "orcid": {
                    "examples": [
                        "https://orcid.org/0000-0003-1409-4549"
                    ],
                    "type": "string",
                    "description": "Field to record author information. ORCID identifiers allow for the author to curate their information after submission. ORCID identifiers must be valid and must have the prefix \u2018https://orcid.org/\u2019",
                    "format": "uri"
                },
                "affiliation": {
                    "type": "string",
                    "description": "Organization the particular contributor is affiliated with",
                    "examples": [
                        "George Washington University"
                    ]
                },
                "contribution": {
                    "items": {
                        "enum": [
                            "authoredBy",
                            "contributedBy",
                            "createdAt",
                            "createdBy",
                            "createdWith",
                            "curatedBy",
                            "derivedFrom",
                            "importedBy",
                            "importedFrom",
                            "providedBy",
                            "retrievedBy",
                            "retrievedFrom",
                            "sourceAccessedBy"
                        ],
                        "type": "string"
                    },
                    "type": "array",
                    "description": "type of contribution determined according to PAV ontology",
                    "reference": "https://doi.org/10.1186/2041-1480-4-37"
                },
                "name": {
                    "type": "string",
                    "description": "Name of contributor",
                    "examples": [
                        "Charles Hadley King"
                    ]
                },
                "email": {
                    "examples": [
                        "hadley_king@gwu.edu"
                    ],
                    "type": "string",
                    "description": "electronic means for identification and communication purposes",
                    "format": "email"
                }
            }
        },
        "uri": {
            "additionalProperties": false,
            "required": [
                "uri"
            ],
            "type": "object",
            "description": "A Uniform Resource Identifer",
            "properties": {
                "access_time": {
                    "type": "string",
                    "format": "datetime"
                },
                "uri": {
                    "type": "string",
                    "format": "uri"
                },
                "sha1_checksum": {
                    "pattern": "[A-Za-z0-9]+",
                    "type": "string",
                    "description": "value of sha1 checksum of file"
                },
                "filename": {
                    "type": "string"
                }
            }
        },
        "bco_id": {
            "propertyOrder": 1,
            "type": "string",
            "description": "A unique identifier that should be applied to each BCO instance. IDs should never be reused",
            "examples": [
                "https://w3id.org/biocompute/examples/HCV1a.json"
            ]
        }
    },
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "bco_id": {
            "propertyOrder": 1,
            "type": "string",
            "description": "A unique identifier that should be applied to each BCO instance. IDs should never be reused",
            "examples": [
                "https://w3id.org/biocompute/examples/HCV1a.json"
            ]
        },
        "bco_spec_version": {
            "description": "Version of the BCO specification used to define this document",
            "readOnly": true,
            "propertyOrder": 2,
            "examples": [
                "https://w3id.org/biocompute/spec/v1.2"
            ],
            "type": "string"
        },
        "checksum": {
            "propertyOrder": 3,
            "readOnly": true,
            "type": "string",
            "description": "A string-type, read-only value, protecting the object from internal or external alterations without proper validation generated with a SHA-256 hash function.",
            "examples": [
                "5986B05969341343E77A95B4023600FC8FEF48B7E79F355E58B0B404A4F50995"
            ]
        },
        "provenance_domain": {
            "description": "Structured field for tracking data through transformations, including contributors, reviewers, and versioning.",
            "title": "Provenance Domain",
            "$id": "http://www.w3id.org/biocompute/1.3.0/schemas/provenance_domain.json",
            "required": [
                "name",
                "version",
                "created",
                "modified",
                "contributors",
                "license"
            ],
            "propertyOrder": 4,
            "additionalProperties": false,
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": {                
                "license": {
                    "propertyOrder": 1,
                    "type": "string",
                    "description": "Creative Commons license or other license information (text) space. The default or recommended license can be Attribution 4.0 International as shown in example",
                    "examples": [
                        "https://spdx.org/licenses/CC-BY-4.0.html"
                    ]
                },
                "name": {
                    "propertyOrder": 2,
                    "type": "string",
                    "description": "Public searchable name for BioCompute Object. This public field should take free text value using common biological research terminology supporting the terminology used in the usability_domain, external references (xref), and keywords sections.",
                    "examples": [
                        "HCV1a ledipasvir resistance SNP detection"
                    ]
                },
                "contributors": {
                    "items": {
                        "additionalProperties": false,
                        "title": "Contributor",
                        "required": [
                            "contribution",
                            "name",
                            "email"
                        ],
                        "type": "object",
                        "description": "Contributor identifier and type of contribution (determined according to PAV ontology) is required",
                        "properties": {
                            "orcid": {
                                "examples": [
                                    "https://orcid.org/0000-0003-1409-4549"
                                ],
                                "type": "string",
                                "description": "Field to record author information. ORCID identifiers allow for the author to curate their information after submission. ORCID identifiers must be valid and must have the prefix \u2018https://orcid.org/\u2019",
                            },
                            "affiliation": {
                                "type": "string",
                                "description": "Organization the particular contributor is affiliated with",
                                "examples": [
                                    "George Washington University"
                                ]
                            },
                            "contribution": {
                                "items": {
                                    "enum": [
                                        "authoredBy",
                                        "contributedBy",
                                        "createdAt",
                                        "createdBy",
                                        "createdWith",
                                        "curatedBy",
                                        "derivedFrom",
                                        "importedBy",
                                        "importedFrom",
                                        "providedBy",
                                        "retrievedBy",
                                        "retrievedFrom",
                                        "sourceAccessedBy"
                                    ],
                                    "type": "string"
                                },
                                "type": "array",
                                "description": "type of contribution determined according to PAV ontology",
                                "reference": "https://doi.org/10.1186/2041-1480-4-37"
                            },
                            "name": {
                                "type": "string",
                                "description": "Name of contributor",
                                "examples": [
                                    "Charles Hadley King"
                                ]
                            },
                            "email": {
                                "examples": [
                                    "hadley_king@gwu.edu"
                                ],
                                "type": "string",
                                "description": "electronic means for identification and communication purposes",
                                "format": "email"
                            }
                        }
                    },
                    "type": "array",
                    "description": "This is a list to hold contributor identifiers and a description of their type of contribution, including a field for ORCIDs to record author information, as they allow for the author to curate their information after submission. The contribution type is a choice taken from PAV ontology: provenance, authoring and versioning, which also maps to the PROV-O.",
                    "propertyOrder": 6
                },
                "created": {
                    "title": "Created Timestamp",
                    "propertyOrder": 4,
                    "readOnly": true,
                    "type": "string",
                    "description": "Date and time of the BioCompute Object creation",
                    "format": "datetime"
                },
                "modified": {
                    "title": "Updated Timestamp",
                    "propertyOrder": 5,
                    "readOnly": true,
                    "type": "string",
                    "description": "Date and time the BioCompute Object was last modified",
                    "format": "datetime"
                },
                "obsolete_after": {
                    "title": "Obsolete Timestamp",
                    "propertyOrder": 10,
                    "type": "string",
                    "description": "If the object has an expiration date, this optional field will specify that using the \u2018datetime\u2019 type described in ISO-8601 format, as clarified by W3C https://www.w3.org/TR/NOTE-datetime.",
                    "format": "datetime"
                },
                "version": {
                    "propertyOrder": 3,
                    "type": "string",
                    "description": "Records the versioning of this BCO instance object. BioCompute Object Version should adhere to semantic versioning as recommended by Semantic Versioning 2.0.0.",
                    "reference": "https://semver.org/",
                    "examples": [
                        "2.9"
                    ]
                },
                "review": {
                    "items": {
                        "additionalProperties": false,
                        "required": [
                            "status",
                            "reviewer"
                        ],
                        "type": "object",
                        "properties": {
                            "date": {
                                "type": "string",
                                "format": "datetime"
                            },
                            "reviewer": {
                                "additionalProperties": false,
                                "required": [
                                    "contribution",
                                    "name",
                                    "email"
                                ],
                                "type": "object",
                                "description": "Contributor identifier and type of contribution (determined according to PAV ontology) is required",
                                "properties": {
                                    "orcid": {
                                        "examples": [
                                            "https://orcid.org/0000-0003-1409-4549"
                                        ],
                                        "type": "string",
                                        "description": "Field to record author information. ORCID identifiers allow for the author to curate their information after submission. ORCID identifiers must be valid and must have the prefix \u2018https://orcid.org/\u2019",
                                    },
                                    "affiliation": {
                                        "type": "string",
                                        "description": "Organization the particular contributor is affiliated with",
                                        "examples": [
                                            "George Washington University"
                                        ]
                                    },
                                    "contribution": {
                                        "items": {
                                            "enum": [
                                                "authoredBy",
                                                "contributedBy",
                                                "createdAt",
                                                "createdBy",
                                                "createdWith",
                                                "curatedBy",
                                                "derivedFrom",
                                                "importedBy",
                                                "importedFrom",
                                                "providedBy",
                                                "retrievedBy",
                                                "retrievedFrom",
                                                "sourceAccessedBy"
                                            ],
                                            "type": "string"
                                        },
                                        "type": "array",
                                        "description": "type of contribution determined according to PAV ontology",
                                        "reference": "https://doi.org/10.1186/2041-1480-4-37"
                                    },
                                    "name": {
                                        "type": "string",
                                        "description": "Name of contributor",
                                        "examples": [
                                            "Charles Hadley King"
                                        ]
                                    },
                                    "email": {
                                        "examples": [
                                            "hadley_king@gwu.edu"
                                        ],
                                        "type": "string",
                                        "description": "electronic means for identification and communication purposes",
                                        "format": "email"
                                    }
                                }
                            },
                            "reviewer_comment": {
                                "type": "string",
                                "description": "Optional free text comment by reviewer",
                                "examples": [
                                    "Approved by GW staff. Waiting for approval from FDA Reviewer"
                                ]
                            },
                            "status": {
                                "default": "unreviewed",
                                "enum": [
                                    "unreviewed",
                                    "in-review",
                                    "approved",
                                    "rejected",
                                    "suspended"
                                ],
                                "type": "string",
                                "description": "Current verification status of the BioCompute Object"
                            }
                        }
                    },
                    "type": "array",
                    "description": "Description of the current verification status of an object in the review process. The unreviewed flag indicates that the object has been submitted, but no further evaluation or verification has occurred. The in-review flag indicates that verification is underway. The approved flag indicates that the BCO has been verified and reviewed. The suspended flag indicates an object that was once valid is no longer considered valid. The rejected flag indicates that an error or inconsistency was detected in the BCO, and it has been removed or rejected. The fields from the contributor object (described in section 2.1.10) is inherited to populate the reviewer section.",
                    "propertyOrder": 7
                },
                "embargo": {
                    "additionalProperties": false,
                    "propertyOrder": 8,
                    "type": "object",
                    "description": "If the object has a period of time during which it shall not be made public, that range can be specified using these optional fields. Using the datetime type, a start and end time are specified for the embargo.",
                    "properties": {
                        "start_time": {
                            "type": "string",
                            "description": "Beginning date of embargo period.",
                            "format": "datetime"
                        },
                        "end_time": {
                            "type": "string",
                            "description": "End date of embargo period.",
                            "format": "datetime"
                        }
                    }
                },
                "derived_from": {
                    "propertyOrder": 9,
                    "type": "string",
                    "description": "A unique identifier that should be applied to each BCO instance. IDs should never be reused",
                    "examples": [
                        "https://w3id.org/biocompute/examples/HCV1a.json"
                    ]
                }
            }
        },

        "usability_domain": {
            "description": "Author-defined usability domain of the BCO. This field is to aid in search-ability and provide a specific description of the function of the object. It is recommended that a novel use of the BCO could result in the creation of a new entry with a new usability domain",
            "title": "Usability Domain",
            "$id": "http://www.w3id.org/biocompute/1.3.0/schemas/usability_domain.json",
            "items": {
                "type": "string",
                "description": "Free text values that can accept template language to indicate values from the external_references",
                "examples": [
                    "Identify baseline single nucleotide polymorphisms SNPs [SO:0000694], insertions [so:SO:0000667], and deletions [so:SO:0000045] that correlate with reduced ledipasvir [pubchem.compound:67505836] antiviral drug efficacy in Hepatitis C virus subtype 1 [taxonomy:31646]",
                    "Identify treatment emergent amino acid substitutions [so:SO:0000048] that correlate with antiviral drug treatment failure",
                    "Determine whether the treatment emergent amino acid substitutions [so:SO:0000048] identified correlate with treatment failure involving other drugs against the same virus",
                    "GitHub CWL example: https://github.com/mr-c/hive-cwl-examples/blob/master/workflow/hive-viral-mutation-detection.cwl#L20"
                ]
            },
            "propertyOrder": 5,
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "array"
        },
        "extension_domain": {
            "propertyOrder": 6,
            "properties": {
                "fhir_extension": {
                    "items": {
                        "$id": "http://www.w3id.org/biocompute/1.3.0/schemas/extension_domain/fhir_extension.json",
                        "$schema": "http://json-schema.org/draft-07/schema#",
                        "required": [
                            "fhir_endpoint",
                            "fhir_version",
                            "fhir_resources"
                        ],
                        "type": "object",
                        "properties": {
                            "fhir_version": {
                                "type": "string",
                                "description": "FHIR version of the server endpoint"
                            },
                            "fhir_resources": {
                                "items": {
                                    "required": [
                                        "fhir_resource",
                                        "fhir_id"
                                    ],
                                    "type": "object",
                                    "properties": {
                                        "fhir_id": {
                                            "type": "string",
                                            "description": "Server-specific identifier string"
                                        },
                                        "fhir_resource": {
                                            "type": "string",
                                            "description": "Type of FHIR resource used"
                                        }
                                    }
                                },
                                "type": "array"
                            },
                            "fhir_endpoint": {
                                "examples": [
                                    "http://fhirtest.uhn.ca/baseDstu3"
                                ],
                                "type": "string",
                                "description": "Base URI of FHIR server where the resources are stored",
                            }
                        }
                    },
                    "type": "array"
                },
                "scm_extension": {
                    "$id": "http://www.w3id.org/biocompute/1.3.0/schemas/extension_domain/scm_extension.json",
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "required": [
                        "scm_repository"
                    ],
                    "type": "object",
                    "properties": {
                        "scm_repository": {
                            "type": "string",
                            "examples": [
                                "https://github.com/example/repo1"
                            ],
                        },
                        "scm_preview": {
                            "type": "string",
                            "examples": [
                                "https://github.com/example/repo1/blob/c9ffea0b60fa3bcf8e138af7c99ca141a6b8fb21/workflow/hive-viral-mutation-detection.cwl"
                            ],
                        },
                        "scm_path": {
                            "type": "string",
                            "examples": [
                                "workflow/hive-viral-mutation-detection.cwl"
                            ],
                            "format": "string"
                        },
                        "scm_type": {
                            "enum": [
                                "git",
                                "svn",
                                "hg",
                                "other"
                            ],
                            "type": "string"
                        },
                        "scm_commit": {
                            "type": "string",
                            "examples": [
                                "c9ffea0b60fa3bcf8e138af7c99ca141a6b8fb21"
                            ]
                        }
                    }
                }
            },
            "title": "Extension Domain"
        },
        "description_domain": {
            "description": "Structured field for description of external references, the pipeline steps, and the relationship of I/O objects.",
            "title": "Description Domain",
            "$id": "http://www.w3id.org/biocompute/1.3.0/schemas/description_domain.json",
            "required": [
                "keywords",
                "pipeline_steps"
            ],
            "propertyOrder": 7,
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": {
                "keywords": {
                    "items": {
                        "type": "string",
                        "description": "This field should take free text value using common biological research terminology.",
                        "examples": [
                            "HCV1a",
                            "Ledipasvir",
                            "antiviral resistance",
                            "SNP",
                            "amino acid substitutions"
                        ]
                    },
                    "type": "array",
                    "description": "Keywords to aid in search-ability and description of the object."
                },
                "platform": {
                    "items": {
                        "type": "string",
                        "examples": [
                            "hive"
                        ]
                    },
                    "type": "array",
                    "description": "reference to a particular deployment of an existing platform where this BCO can be reproduced."
                },
                "xref": {
                    "items": {
                        "required": [
                            "namespace",
                            "name",
                            "ids",
                            "access_time"
                        ],
                        "type": "object",
                        "description": "External references are stored in the form of prefixed identifiers (CURIEs). These CURIEs map directly to the URIs maintained by Identifiers.org.",
                        "reference": "https://identifiers.org/",
                        "properties": {
                            "access_time": {
                                "type": "string",
                                "description": "Date and time the external reference was accessed",
                                "format": "datetime"
                            },
                            "namespace": {
                                "type": "string",
                                "description": "External resource vendor prefix",
                                "examples": [
                                    "pubchem.compound"
                                ]
                            },
                            "name": {
                                "type": "string",
                                "description": "Name of external reference",
                                "examples": [
                                    "PubChem-compound"
                                ]
                            },
                            "ids": {
                                "items": {
                                    "type": "string",
                                    "description": "Reference identifier",
                                    "examples": [
                                        "67505836"
                                    ]
                                },
                                "type": "array",
                                "description": "List of reference identifiers"
                            }
                        }
                    },
                    "type": "array",
                    "description": "List of the databases or ontology IDs that are cross-referenced in the BCO."
                },
                "pipeline_steps": {
                    "items": {
                        "additionalProperties": false,
                        "required": [
                            "step_number",
                            "name",
                            "description",
                            "input_list",
                            "output_list"
                        ],
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "description": "This is the common name of the software tool",
                                "examples": [
                                    "HIVE-hexagon"
                                ]
                            },
                            "step_number": {
                                "type": "integer",
                                "description": "Non-negative integer value representing the position of the tool in a one-dimensional representation of the pipeline."
                            },
                            "version": {
                                "type": "string",
                                "description": "Version assigned to the instance of the tool used.",
                                "examples": [
                                    "1.3"
                                ]
                            },
                            "input_list": {
                                "items": {
                                    "additionalProperties": false,
                                    "required": [
                                        "uri"
                                    ],
                                    "type": "object",
                                    "description": "A Uniform Resource Identifer",
                                    "properties": {
                                        "access_time": {
                                            "type": "string",
                                            "format": "datetime"
                                        },
                                        "uri": {
                                            "type": "string",
                                            "format": "uri"
                                        },
                                        "sha1_checksum": {
                                            "pattern": "[A-Za-z0-9]+",
                                            "type": "string",
                                            "description": "value of sha1 checksum of file"
                                        },
                                        "filename": {
                                            "type": "string"
                                        }
                                    }
                                },
                                "type": "array",
                                "description": "URIs (expressed as a URN or URL) of the input files for each tool."
                            },
                            "output_list": {
                                "items": {
                                    "additionalProperties": false,
                                    "required": [
                                        "uri"
                                    ],
                                    "type": "object",
                                    "description": "A Uniform Resource Identifer",
                                    "properties": {
                                        "access_time": {
                                            "type": "string",
                                            "format": "datetime"
                                        },
                                        "uri": {
                                            "type": "string",
                                            "format": "uri"
                                        },
                                        "sha1_checksum": {
                                            "pattern": "[A-Za-z0-9]+",
                                            "type": "string",
                                            "description": "value of sha1 checksum of file"
                                        },
                                        "filename": {
                                            "type": "string"
                                        }
                                    }
                                },
                                "type": "array",
                                "description": "URIs (expressed as a URN or URL) of the output files for each tool."
                            },
                            "prerequisite": {
                                "items": {
                                    "required": [
                                        "name",
                                        "uri"
                                    ],
                                    "type": "object",
                                    "description": "Text value to indicate a package or prerequisite for running the tool used.",
                                    "properties": {
                                        "name": {
                                            "type": "string",
                                            "description": "Public searchable name for reference or prereq.",
                                            "examples": [
                                                "Hepatitis C virus genotype 1"
                                            ]
                                        },
                                        "uri": {
                                            "additionalProperties": false,
                                            "required": [
                                                "uri"
                                            ],
                                            "type": "object",
                                            "description": "A Uniform Resource Identifer",
                                            "properties": {
                                                "access_time": {
                                                    "type": "string",
                                                    "format": "datetime"
                                                },
                                                "uri": {
                                                    "type": "string",
                                                    "format": "uri"
                                                },
                                                "sha1_checksum": {
                                                    "pattern": "[A-Za-z0-9]+",
                                                    "type": "string",
                                                    "description": "value of sha1 checksum of file"
                                                },
                                                "filename": {
                                                    "type": "string"
                                                }
                                            }
                                        }
                                    }
                                },
                                "type": "array",
                                "description": "Reference or required prereqs"
                            },
                            "description": {
                                "type": "string",
                                "description": "Specific purpose of the tool.",
                                "examples": [
                                    "Alignment of reads to a set of references"
                                ]
                            }
                        }
                    },
                    "type": "array",
                    "description": "Each individual tool (or a well defined and reusable script) is represented as a step. Parallel processes are given the same step number."
                }
            }
        },
        "execution_domain": {
            "description": "The fields required for execution of the BCO are herein encapsulated together in order to clearly separate information needed for deployment, software configuration, and running applications in a dependent environment",
            "title": "Execution Domain",
            "$id": "http://www.w3id.org/biocompute/1.3.0/schemas/execution_domain.json",
            "required": [
                "script",
                "script_driver",
                "software_prerequisites",
                "external_data_endpoints",
                "environment_variables"
            ],
            "propertyOrder": 8,
            "additionalProperties": false,
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": {
                "external_data_endpoints": {
                    "items": {
                        "additionalProperties": false,
                        "required": [
                            "name",
                            "url"
                        ],
                        "type": "object",
                        "description": "Requirement for network protocol endpoints used by a pipeline\u2019s scripts, or other software.",
                        "properties": {
                            "url": {
                                "type": "string",
                                "description": "The endpoint to be accessed.",
                                "examples": [
                                    "https://hive.biochemistry.gwu.edu/dna.cgi?cmd=login"
                                ]
                            },
                            "name": {
                                "type": "string",
                                "description": "Description of the service that is accessed",
                                "examples": [
                                    "HIVE",
                                    "access to e-utils"
                                ]
                            }
                        }
                    },
                    "type": "array",
                    "description": "Minimal necessary domain-specific external data source access in order to successfully run the script to produce BCO."
                },
                "environment_variables": {
                    "additionalProperties": false,
                    "type": "object",
                    "patternProperties": {
                        "^[a-zA-Z_]+[a-zA-Z0-9_]*$": {
                            "type": "string"
                        }
                    },
                    "description": "Environmental parameters that are useful to configure the execution environment on the target platform."
                },
                "script_driver": {
                    "type": "string",
                    "description": "Specification of the kind of executable that can be launched in order to perform a sequence of commands described in the script in order to run the pipeline",
                    "examples": [
                        "hive",
                        "cwl-runner",
                        "shell"
                    ]
                },
                "software_prerequisites": {
                    "items": {
                        "additionalProperties": false,
                        "required": [
                            "name",
                            "version",
                            "uri"
                        ],
                        "type": "object",
                        "description": "A necessary prerequisite, library, or tool version.",
                        "properties": {
                            "version": {
                                "type": "string",
                                "description": "Versions of the software prerequisites",
                                "examples": [
                                    "babajanian.1"
                                ]
                            },
                            "name": {
                                "type": "string",
                                "description": "Names of software prerequisites",
                                "examples": [
                                    "HIVE-hexagon"
                                ]
                            },
                            "uri": {
                                "additionalProperties": false,
                                "required": [
                                    "uri"
                                ],
                                "type": "object",
                                "description": "A Uniform Resource Identifer",
                                "properties": {
                                    "access_time": {
                                        "type": "string",
                                        "format": "datetime"
                                    },
                                    "uri": {
                                        "type": "string",
                                        "format": "uri"
                                    },
                                    "sha1_checksum": {
                                        "pattern": "[A-Za-z0-9]+",
                                        "type": "string",
                                        "description": "value of sha1 checksum of file"
                                    },
                                    "filename": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    },
                    "type": "array",
                    "description": "Minimal necessary prerequisites, library, tool versions needed to successfully run the script to produce BCO."
                },
                "script": {
                    "items": {
                        "additionalProperties": false,
                        "properties": {
                            "uri": {
                                "additionalProperties": false,
                                "required": [
                                    "uri"
                                ],
                                "type": "object",
                                "description": "A Uniform Resource Identifer",
                                "properties": {
                                    "access_time": {
                                        "type": "string",
                                        "format": "datetime"
                                    },
                                    "uri": {
                                        "type": "string",
                                        "format": "uri"
                                    },
                                    "sha1_checksum": {
                                        "pattern": "[A-Za-z0-9]+",
                                        "type": "string",
                                        "description": "value of sha1 checksum of file"
                                    },
                                    "filename": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    },
                    "type": "array",
                    "description": "points to internal or external references to a script object that was used to perform computations for this BCO instance."
                }
            }
        },
        "parametric_domain": {
            "description": "This represents the list of NON-default parameters customizing the computational flow which can affect the output of the calculations. These fields can be custom to each kind of analysis and are tied to a particular pipeline implementation",
            "title": "Parametric Domain",
            "$id": "http://www.w3id.org/biocompute/1.3.0/schemas/parametric_domain",
            "items": {
                "additionalProperties": false,
                "required": [
                    "param",
                    "value",
                    "step"
                ],
                "properties": {
                    "step": {
                        "pattern": "^(.*)$",
                        "title": "step",
                        "type": "string",
                        "examples": [
                            "1"
                        ],
                        "description": "Refers to the specific step of the workflow relevant to the parameters specified in 'param' and 'value'"
                    },
                    "param": {
                        "pattern": "^(.*)$",
                        "title": "param",
                        "type": "string",
                        "examples": [
                            "seed"
                        ],
                        "description": "Specific variables for the computational workflow"
                    },
                    "value": {
                        "pattern": "^(.*)$",
                        "title": "value",
                        "type": "string",
                        "examples": [
                            "14"
                        ],
                        "description": "Specific (non-default) parameter values for the computational workflow"
                    }
                }
            },
            "propertyOrder": 9,
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "array"
        },

        "io_domain": {
            "description": "The list of global input and output files created by the computational workflow, excluding the intermediate files. Custom to every specific BCO implementation, these fields are pointers to objects that can reside in the system performing the computation or any other accessible system.",
            "title": "Input and Output Domain",
            "$id": "http://www.w3id.org/biocompute/1.3.0/schemas/io_domain.json",
            "required": [
                "input_subdomain",
                "output_subdomain"
            ],
            "propertyOrder": 10,
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": {
                "input_subdomain": {
                    "items": {
                        "additionalProperties": false,
                        "required": [
                            "uri"
                        ],
                        "type": "object",
                        "properties": {
                            "uri": {
                                "additionalProperties": false,
                                "required": [
                                    "uri"
                                ],
                                "type": "object",
                                "description": "A Uniform Resource Identifer",
                                "properties": {
                                    "access_time": {
                                        "type": "string",
                                        "format": "datetime"
                                    },
                                    "uri": {
                                        "type": "string",
                                        "format": "uri"
                                    },
                                    "sha1_checksum": {
                                        "pattern": "[A-Za-z0-9]+",
                                        "type": "string",
                                        "description": "value of sha1 checksum of file"
                                    },
                                    "filename": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    },
                    "type": "array",
                    "description": "A record of the references and input files for the entire pipeline. Each type of input file is listed under a key for that type.",
                    "title": "input_domain"
                },
                "output_subdomain": {
                    "items": {
                        "required": [
                            "mediatype",
                            "uri"
                        ],
                        "type": "object",
                        "properties": {
                            "mediatype": {
                                "pattern": "^(.*)$",
                                "title": "mediatype",
                                "type": "string",
                                "examples": [
                                    "text/csv"
                                ],
                                "description": "https://www.iana.org/assignments/media-types/"
                            },
                            "uri": {
                                "additionalProperties": false,
                                "required": [
                                    "uri"
                                ],
                                "type": "object",
                                "description": "A Uniform Resource Identifer",
                                "properties": {
                                    "access_time": {
                                        "type": "string",
                                        "format": "datetime"
                                    },
                                    "uri": {
                                        "type": "string",
                                        "format": "uri"
                                    },
                                    "sha1_checksum": {
                                        "pattern": "[A-Za-z0-9]+",
                                        "type": "string",
                                        "description": "value of sha1 checksum of file"
                                    },
                                    "filename": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "title": "The Items Schema"
                    },
                    "type": "array",
                    "description": "A record of the outputs for the entire pipeline.",
                    "title": "output_subdomain"
                }
            }
        },
        "error_domain": {
            "description": "",
            "title": "Error Domain",
            "$id": "http://www.w3id.org/biocompute/1.3.0/schemas/error_domain.json",
            "required": [],
            "propertyOrder": 11,
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": {
                "empirical_error": {
                    "type": "object",
                    "description": "empirically determined values such as limits of detectability, false positives, false negatives, statistical confidence of outcomes, etc. This can be measured by running the algorithm on multiple data samples of the usability domain or through the use of carefully designed in-silico data.",
                    "title": "Empirical Error"
                },
                "algorithmic_error": {
                    "type": "object",
                    "description": "descriptive of errors that originate by fuzziness of the algorithms, driven by stochastic processes, in dynamically parallelized multi-threaded executions, or in machine learning methodologies where the state of the machine can affect the outcome.",
                    "title": "Algorithmic Error"
                }
            }
        }
    }
}