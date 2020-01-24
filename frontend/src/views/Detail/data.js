export default {
    "bco_id": "http://biocomputeobject.org/BCO_000010",
    "checksum": "4021cff7b9be9719556ebbd62e99d4cd0a822e0645d255dd354f4a4d194177c5",
    "bco_spec_version": "1.3.0",
    "provenance_domain": {
        "name": "CGC Smart Variant Filtering- train, test, and run",
        "version": "1.0.0",
        "license": "https://spdx.org/licenses/CC-BY-4.0.html",
        "created": "2019-04-02T20:19:58.182724",
        "modified": "2019-12-02T00:06:56.942392",
        "contributors": [
            {
                "name": "Janisha Patel",
                "orcid": "https://orcid.org/0000-0002-8824-4637",
                "affiliation": "George Washington University",
                "contribution": [
                    "createdBy"
                ],
                "email": "janishapatel@gwu.edu"
            },
            {
                "name": "Charles Hadley King",
                "orcid": "https://orcid.org/0000-0003-1409-4549",
                "affiliation": "George Washington University",
                "contribution": [
                    "createdWith"
                ],
                "email": "hadley_king@gwu.edu"
            }
        ]
    },
    "usability_domain": [
        "Smart Variant Filtering (SVF) uses machine learning algorithms trained on features from the existing Genome In A Bottle (GIAB) variant-called samples (HG001-HG005) to perform variant filtering (classification).  Smart Variant Filtering increases the precision of called SNVs (removes false positives) for up to 0.2% while keeping the overall f-score higher by 0.12-0.27% than in existing solutions. Indel precision is increased by up to 7.8%, while the f-score increase is in range of 0.1 to 3.2%."
    ],
    "extension_domain": {
        "fhir_extension": [],
        "scm_extension": {
            "scm_repository": "",
            "scm_path": "",
            "scm_type": "git",
            "scm_commit": ""
        }
    },
    "description_domain": {
        "keywords": [
            "variants",
            "variant calling",
            "CGC",
            ""
        ],
        "pipeline_steps": [
            {
                "name": "Apply Smart Variant Filtering Parallel ",
                "version": "svf v1.0",
                "step_number": 1,
                "input_list": [
                    {
                        "access_time": "2018-03-19T13:54:00-0400",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c8fe583e4b04e14bb83f741/",
                        "filename": "dbsnp_147.tab.vcf.gz"
                    },
                    {
                        "access_time": "2018-03-19T13:54:01-0400",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c8fe583e4b04e14bb83f766/",
                        "filename": "human_g1k_v37_decoy.breakpoints.bed"
                    },
                    {
                        "access_time": "2018-03-19T13:54:02-0400",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c8fe583e4b04e14bb83f76c/",
                        "filename": "model_6_features_indel.sav"
                    },
                    {
                        "access_time": "2018-03-19T13:54:03-0400",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c8fe583e4b04e14bb83f789/",
                        "filename": "human_g1k_v37_decoy.fasta"
                    },
                    {
                        "access_time": "2018-03-19T13:54:04-0400",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c8fe583e4b04e14bb83f77c/",
                        "filename": "model_6_features_snv.sav"
                    },
                    {
                        "access_time": "2018-03-19T13:54:05-0400",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c8fe583e4b04e14bb83f739/",
                        "filename": "HG002-NA24385-50x.vcf"
                    }
                ],
                "output_list": [
                    {
                        "access_time": "2018-03-19T14:15:05-0400",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c91321de4b04e14bb899b99/",
                        "filename": "_2_annotated_HG002-NA24385-50x.tab.vcf.svf.vcf"
                    }
                ],
                "prerequisite": [
                    {
                        "name": "Apply Smart Variant Filtering Parallel",
                        "uri": {
                            "access_time": "2018-03-19T13:50:00-0400",
                            "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/apps/#jpat/copy-of-smart-variant-filtering/apply-filtering-parallel",
                            "filename": "Apply Smart Variant Filtering Parallel"
                        }
                    }
                ],
                "description": "Filter large VCF files"
            },
            {
                "name": "Smart Variant Filtering - Prepare features",
                "version": "Smart Variant Filtering 1.0",
                "step_number": 2,
                "input_list": [
                    {
                        "access_time": "2018-03-19T14:55:00-0400",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c8fe583e4b04e14bb83f73b/",
                        "filename": "annotated_HG003_oslo_exome.tab.vcf_SNVs.table"
                    },
                    {
                        "access_time": "2018-03-19T14:55:01-0400",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c8fe583e4b04e14bb83f785/",
                        "filename": "annotated_HG003_oslo_exome.tab.vcf_indels.table"
                    },
                    {
                        "access_time": "2018-03-19T14:55:02-0400",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c91321de4b04e14bb899b99/",
                        "filename": "_2_annotated_HG002-NA24385-50x.tab.vcf.svf.vcf"
                    }
                ],
                "output_list": [
                    {
                        "access_time": "2018-03-19T18:31:0-0400",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c91a689e4b07db6ffeff9fc/",
                        "filename": "_2_annotated_HG002-NA24385-50x.tab.vcf.svf.svf.vcf"
                    },
                    {
                        "access_time": "2018-03-19T18:31:0-0400",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c91a689e4b07db6ffeffa02/",
                        "filename": "_1_annotated_HG003_oslo_exome.tab.vcf_SNVs_6_features_snv.sav"
                    },
                    {
                        "access_time": "2018-03-19T18:31:0-0400",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c91a689e4b07db6ffeff9ff/",
                        "filename": "_1_annotated_HG003_oslo_exome.tab.vcf_indels_6_features_indel.sav"
                    }
                ],
                "prerequisite": [],
                "description": "The purpose of this workflow is to create dataset with features which will be used by machine learning algorithm to perform classification. Reads from GIAB HG001-HG005 samples with available truth sets (gold standard VCFs) are processed with variant calling workflows resulted in raw VCFs. "
            },
            {
                "name": "",
                "version": "",
                "step_number": 3,
                "input_list": [
                    {
                        "access_time": "",
                        "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/files/5c8fe583e4b04e14bb83f741/",
                        "filename": "dbsnp_147.tab.vcf.gz"
                    }
                ],
                "output_list": [],
                "prerequisite": [],
                "description": ""
            }
        ]
    },
    "execution_domain": {
        "external_data_endpoints": [
            {
                "name": "CGC_SBG",
                "url": "https://cgc-accounts.sbgenomics.com/auth/login?next=https%3A%2F%2Fcgc-accounts.sbgenomics.com%2Foauth2%2Fauthorization%3Fresponse_type%3Dcode%26client_id%3D08bbb98f354e4554bd7fd315de64d955%26redirect_uri%3Dhttps%253A%252F%252Fcgc.sbgenomics.com%252Foauth2%252Fredirect%26scope%3Dopenid%26state%3DtuC3hyHOyfpX3pmbAuG0HcWiut36dV%26nonce%3Dwpr5TTTQxg92YakVGNJpxRe3g77Qcl"
            }
        ],
        "environment_variables": {},
        "script_driver": "https://github.com/sbg/sevenbridges-python#installation",
        "software_prerequisites": [
            {
                "name": "Apply Smart Variant Filtering Parallel",
                "version": "svf 1.0",
                "uri": {
                    "access_time": "",
                    "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/apps/#jpat/copy-of-smart-variant-filtering/apply-filtering-parallel",
                    "filename": "Apply Smart Variant Filtering Parallel"
                }
            },
            {
                "name": "Smart Variant Filtering- Prepare features",
                "version": "svf 1.0",
                "uri": {
                    "access_time": "",
                    "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/apps/#jpat/copy-of-smart-variant-filtering/prepare-features",
                    "filename": "Smart Variant Filtering- Prepare features"
                }
            },
            {
                "name": "Smart Variant Filtering - Train, filter and test",
                "version": "svf 1.0",
                "uri": {
                    "access_time": "",
                    "uri": "https://cgc.sbgenomics.com/u/jpat/copy-of-smart-variant-filtering/apps/#jpat/copy-of-smart-variant-filtering/train-filter-and-test",
                    "filename": "Smart Variant Filtering - Train, filter and test"
                }
            }
        ],
        "script": [
            {
                "uri": {
                    "access_time": "",
                    "uri": "https://github.com/sbg/sevenbridges-python/blob/develop/setup.py",
                    "filename": "setup.py"
                }
            },
            {
                "uri": {
                    "access_time": "",
                    "uri": "https://cgc.sbgenomics.com/public/apps#admin/sbg-public-data/smart-variant-filtering/",
                    "filename": "svf_train.py"
                }
            }
        ]
    },
    "parametric_domain": [
        {
            "step": "",
            "param": "",
            "value": ""
        }
    ],
    "io_domain": {
        "input_subdomain": [],
        "output_subdomain": []
    },
    "error_domain": {
        "empirical_error": {},
        "algorithmic_error": {}
    }
}