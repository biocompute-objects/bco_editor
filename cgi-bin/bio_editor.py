#!/usr/bin/python
import os,sys
import string
import cgi
import commands
from optparse import OptionParser
import traceback
import json
import re
import time
import datetime
import auth
import util
import bio_hash
import bcrypt
import hashlib
import requests
import pdb

import pymongo
from pymongo import MongoClient
import jsonref
from jsonschema import validate
import threading
import warnings
from requests.packages.urllib3.exceptions import InsecureRequestWarning

__version__="1.0"

def make_correct_data(input_json):
    for i in range(len(input_json['description_domain']['pipeline_steps'])):
        for j in range(len(input_json['description_domain']['pipeline_steps'][i]['input_list'])):
            try:
                if input_json['description_domain']['pipeline_steps'][i]['input_list'][j]['sha1_chksum'] != None:
                    input_json['description_domain']['pipeline_steps'][i]['input_list'][j]['sha1_checksum'] = input_json['description_domain']['pipeline_steps'][i]['input_list'][j]['sha1_chksum']
                del input_json['description_domain']['pipeline_steps'][i]['input_list'][j]['sha1_chksum']
            except:
                pass
        for j in range(len(input_json['description_domain']['pipeline_steps'][i]['output_list'])):
            try:
                if input_json['description_domain']['pipeline_steps'][i]['output_list'][j]['sha1_chksum'] != None:
                    input_json['description_domain']['pipeline_steps'][i]['output_list'][j]['sha1_checksum'] = input_json['description_domain']['pipeline_steps'][i]['output_list'][j]['sha1_chksum']
                del input_json['description_domain']['pipeline_steps'][i]['output_list'][j]['sha1_chksum']
            except:
                pass
        try:
            for j in range(len(input_json['description_domain']['pipeline_steps'][i]['prerequisite'])):
                try:
                    if input_json['description_domain']['pipeline_steps'][i]['prerequisite'][j]['uri']['sha1_chksum'] != None:
                        input_json['description_domain']['pipeline_steps'][i]['prerequisite'][j]['uri']['sha1_checksum'] = input_json['description_domain']['pipeline_steps'][i]['prerequisite'][j]['uri']['sha1_chksum']
                    del input_json['description_domain']['pipeline_steps'][i]['prerequisite'][j]['uri']['sha1_chksum']
                except:
                    pass
        except:
            pass

    for i in range(len(input_json['execution_domain']['software_prerequisites'])):
        try:
            if input_json['execution_domain']['software_prerequisites'][i]['uri']['sha1_chksum'] != None: 
                input_json['execution_domain']['software_prerequisites'][i]['uri']['sha1_checksum'] = input_json['execution_domain']['software_prerequisites'][i]['uri'].pop('sha1_chksum')
            del input_json['execution_domain']['software_prerequisites'][i]['uri']['sha1_chksum']
        except:
            pass
    for i in range(len(input_json['execution_domain']['script'])):
        try:
            if input_json['execution_domain']['script'][i]['uri']['sha1_chksum'] != None:
                input_json['execution_domain']['script'][i]['uri']['sha1_checksum'] = input_json['execution_domain']['script'][i]['uri'].pop('sha1_chksum')
            del input_json['execution_domain']['script'][i]['uri']['sha1_chksum']
        except:
            pass

    for i in range(len(input_json['io_domain']['input_subdomain'])):
        try:
            if input_json['io_domain']['input_subdomain'][i]['uri']['sha1_chksum'] != None:
                input_json['io_domain']['input_subdomain'][i]['uri']['sha1_checksum'] = input_json['io_domain']['input_subdomain'][i]['uri'].pop('sha1_chksum')
            del input_json['io_domain']['input_subdomain'][i]['uri']['sha1_chksum']
        except:
            pass
    for i in range(len(input_json['io_domain']['output_subdomain'])):
        try:
            if input_json['io_domain']['output_subdomain'][i]['uri']['sha1_chksum'] != None:
                input_json['io_domain']['output_subdomain'][i]['uri']['sha1_checksum'] = input_json['io_domain']['output_subdomain'][i]['uri'].pop('sha1_chksum')
            del input_json['io_domain']['output_subdomain'][i]['uri']['sha1_chksum']
        except:
            pass

    return input_json
def save_object(in_json, logged_email):
    # validating json data with schema
    
    try:
        mainschema_file = config_json["pathinfo"]["schemapath"] + "biocomputeobject.json"
        schema_file = open(mainschema_file, "r")
        base_uri = 'file://{}/'.format(os.path.dirname(schema_file.name))
        schema = jsonref.load(schema_file, base_uri=base_uri, jsonschema=True)        
    except Exception as e:
        out_json = util.log_error(mongo_cl_log, traceback.format_exc())
        return out_json

    out_json = {}
    util.log_error(mongo_cl_log, 'bco_id', 'msg')
    real_id = bco_id = in_json["bco_id"]

    # pdb.set_trace()
    try:
        data = bio_hash.hashed_object(in_json)
	print data['checksum']
	doc = mongo_cl_bco.find_one({"bco_id": "http://biocomputeobject.org/BCO_000012"})
	print doc['checksum']
	return ''
        if bco_id != "-1":
            doc = mongo_cl_bco.find_one({"bco_id":bco_id})
            creator_list = []
            for o in doc["provenance_domain"]["contributors"]:
                if "createdBy" in o["contribution"]:
                    creator_list.append(o["email"])
            if logged_email not in creator_list:
                return {"taskstatus":0, "errormsg":"You do not have privilege to change this object!"}
            else:
                in_json["provenance_domain"]["modified"] = datetime.datetime.now().isoformat()
                data = bio_hash.hashed_object(in_json)

                #in_json["provenance_domain"]["modified"] = datetime.datetime.now().strftime("%b %d, %Y %H:%M:%S")
                validate(in_json, schema)                    
                
                data.pop("bco_id")
                result = mongo_cl_bco.update_one({"bco_id":bco_id}, {'$set': data}, upsert=False)
                return {"taskstatus": 1, "bcoid":bco_id}
        else:

            doc = mongo_cl_bco.find_one({"checksum":data["checksum"]})
            if doc != None:
                return {"taskstatus":0, "errormsg":"Error. We found an exact copy of your BCO in our database. Duplicate BCOs cannot be submitted!"}            
            else:
                bco_id = util.get_next_sequence_value(mongo_cl_counters, "bcoid")
                bco_str_id = "000000"[0:6-len(str(bco_id))] + str(bco_id)
                bco_url = config_json["pathinfo"]["bcoprefix"] % (bco_str_id)
                data["bco_id"] = bco_url
                data["provenance_domain"]["created"] = datetime.datetime.now().isoformat()
                data["provenance_domain"]["contributors"] = [
                    {
                        "name": "", 
                        "affiliation": "", 
                        "email": logged_email,
                        "orcid": "", 
                        "contribution": ["createdBy"]
                    }
                ]
                validate(data, schema)
                data = bio_hash.hashed_object(data)
                result = mongo_cl_bco.insert_one(data)
                out_json = {"bcoid":bco_url, "taskstatus":1}
    except Exception as e:
        print "*"*100
        print e
        util.add_id(mongo_cl_invalid, real_id)
        out_json = util.log_error(mongo_cl_log, traceback.format_exc(), str(e))

    return out_json

def read_file():
    result = []
    with open('correct.json', 'r') as f:
        data = json.load(f)
        for item in data:
            save_object(item, '')

def import_bcos(in_json, logged_email):
    bco_domain = "https://data.glygen.org"
    bco_version = "v-1.0.13"
    file_obj = open('input1.json', 'a')
    file_obj.write('[')
    for i in xrange(1,1000):
        bco_id = "DSBCO_000000"[0:12-len(str(i))] + str(i)
        bco_url = "%s/%s/%s" % (bco_domain, bco_id, bco_version)
        try:
            with warnings.catch_warnings():
                warnings.filterwarnings('ignore', category=InsecureRequestWarning)
                response = requests.get(bco_url, verify=False)            
                if response.content.strip() != "":
                    bco_obj = json.loads(response.content)
                    print response.content
                    file_obj.write(response.content)
                    file_obj.write(', \n')
        except Exception as e:
            pdb.set_trace()
            util.log_error(mongo_cl_log, str(e), str(e))

    bco_domain = "https://data.oncomx.org"
    bco_version = "v-1.0.6"
    for i in xrange(1,1000):
        bco_id = "DSBCO_000000"[0:12-len(str(i))] + str(i)
        bco_url = "%s/%s/%s" % (bco_domain, bco_id, bco_version)
        try:
            with warnings.catch_warnings():
                warnings.filterwarnings('ignore', category=InsecureRequestWarning)
                response = requests.get(bco_url, verify=False)            
                if response.content.strip() != "":
                    bco_obj = json.loads(response.content)
                    print response.content
                    file_obj.write(response.content)
                    file_obj.write(', \n')
        except Exception as e:
            pdb.set_trace()
            print "-"*100
            print e
            util.log_error(mongo_cl_log, str(e), str(e))

    file_obj.write(']')
    file_obj.close()
    return {"result": True}

def search_objects(in_json):
    try:
        query_obj = {}
        if in_json["queryvalue"] != "":
            query = str(in_json["queryvalue"])
            cond_objs = []
            cond_objs.append({"bco_id":{'$regex':query, '$options': 'i'}})
            cond_objs.append({"provenance_domain.name":{'$regex':query, '$options': 'i'}})
            cond_objs.append({"provenance_domain.contributors.name":{'$regex':query, '$options': 'i'}})
            query_obj = { "$or": cond_objs }
        row = []
        obj_list = []
        obj_list.append(config_json["tableheaders"]["searchresults"]["labellist"])
        obj_list.append(config_json["tableheaders"]["searchresults"]["typelist"])

        for doc in mongo_cl_bco.find(query_obj):
            if "provenance_domain" not in doc:
                continue
            tv_list = ["name" in doc["provenance_domain"]]
            tv_list += ["created" in doc["provenance_domain"]]
            tv_list += ["contributors" in doc["provenance_domain"]]
            if False in tv_list:
                continue
            tv_list = [len(doc["provenance_domain"]["contributors"]) > 0]

            if False in tv_list:
                continue
            doc.pop("_id")
            created_by = doc["provenance_domain"]["contributors"][0]["email"]
            bco_id = str(doc["bco_id"])
            creators = []
            for o in doc["provenance_domain"]["contributors"]:
                val = o["name"] if o["name"].strip() != "" else o["email"]
                creators.append(val)
            row = [
                bco_id
                ,doc["provenance_domain"]["name"]
                ,doc["provenance_domain"]["created"]
                ,", ".join(creators)
            ]
            obj_list.append(row)
        
        taskstatus = 1
        out_json = {}
        out_json["searchresults"] = obj_list
        out_json["taskstatus"] = taskstatus
    except Exception, e:
        out_json = util.log_error(mongo_cl_log, traceback.format_exc())


        
    return out_json


def get_object_view_json(in_json):
 
    out_json = {}
    try:
        doc = mongo_cl_bco.find_one({"bco_id":in_json["bcoid"]})
        if doc == None:
            out_json = {"taskstatus":0, "errormsg":"Object does not exist!"}
        else:
            doc.pop("_id")
            out_json = {"bco":doc, "creators":[]}
            for o in doc["provenance_domain"]["contributors"]:
                if "createdBy" in o["contribution"]:
                    out_json["creators"].append(o["email"])
            out_json["creators"] = sorted(set(out_json["creators"]))
        ordr_dict = json.loads(open("conf/field_order.json").read())
        out_json["bco"] = util.order_json_obj(out_json["bco"],ordr_dict)
    except Exception, e:
        out_json = util.log_error(mongo_cl_log, traceback.format_exc())

    return out_json

def get_schema(internal=False):
    mainschema_file = config_json["pathinfo"]["schemapath"] + "biocomputeobject.json"

    schema_file = open(mainschema_file, "r")
    base_uri = 'file://{}/'.format(os.path.dirname(schema_file.name))
    schema = jsonref.load(schema_file, base_uri=base_uri, jsonschema=True)  
    return schema

def get_object_edit_json(in_json):
    try:
        bco_json = {}
        if in_json["bcoid"] != "-1":
            bco_json = mongo_cl_bco.find_one({"bco_id":in_json["bcoid"]})
            if bco_json == None:
                out_json = {"taskstatus":0, "errormsg":"Object does not exist!"}
            else:
                if "_id" in bco_json:
                    bco_json.pop("_id")
        else:
            bco_json = {
                "bco_id":"-1",
                "bco_spec_version":config_json["specversion"],
                "checksum":"",
                "created":"",
                "modified":"",
                "provenance_domain":{},
                "usability_domain":[],
                "error_domain":{}
            }
            
        
        domain_list  = [
            "provenance_domain", 
            "usability_domain", 
            "execution_domain", 
            "description_domain",
            "parametric_domain",
            "io_domain",
            "error_domain"
        ]

        out_json = {"schema":get_schema()}
        out_json["startval"]= {
            "bco_id":bco_json["bco_id"],
            "bco_spec_version":bco_json["bco_spec_version"],
            "checksum": bco_json["checksum"],
        }
        for domain in domain_list + ["extension_domain"]:
            out_json["startval"][domain] = bco_json[domain] if domain in bco_json else {}
        
        ordr_dict = json.loads(open("conf/field_order.json").read())
        out_json["startval"] = util.order_json_obj(out_json["startval"],ordr_dict) 
        out_json["taskstatus"] = 1
    except Exception, e:
        out_json = util.log_error(mongo_cl_log, traceback.format_exc())
    return out_json

#~~~~~~~~~~~~~~~~~~~~~
def main():
    
    usage = "\n%prog  [options]"
    parser = OptionParser(usage,version="%prog " + __version__)
    msg = "Input JSON text"
    parser.add_option("-j","--injson",action="store",dest="injson",help=msg)


    form_dict = cgi.FieldStorage()
    (options,args) = parser.parse_args()

    local_flag = False
    in_json = {}
    if len(form_dict.keys()) > 0:
        in_json = json.loads(form_dict["injson"].value) if "injson" in form_dict else {}
    else:
        local_flag = True
        for key in ([options.injson]):
            if not (key):
                parser.print_help()
                sys.exit(0)
        in_json = json.loads(options.injson)
    # in_json = {"svc":"save_object","bco":{'bco_spec_version':'1.3.0','checksum':'57cbf5de8052cb15cf2f26561d4b244554849fe4881c44b810f2f1170873cf3e','extension_domain':{'fhir_extension':[],'scm_extension':{'scm_repository':'','scm_path':'','scm_type':'git','scm_commit':''}},'provenance_domain':{'license':'Data - Attribution 4.0 International CC BY 4.0 [https://creativecommons.org/licenses/by/4.0/]','name':'FDA Breast Cancer Biomarkers','contributors':[{'orcid':'','affiliation':'','contribution':['createdBy'],'name':'','email':''}],'created':'2019-07-26T06:36:06.634890','modified':'2019-04-27T10:31:09.359044','version':'1.0.6'},'description_domain':{'keywords':['cancer','breast cancer','biomarker','biomarker test','FDA'],'pipeline_steps':[{'name':'','step_number':1,'version':'','input_list':[],'output_list':[],'prerequisite':[],'description':'FDA-approved tests were downloaded a list of FDA-approved or cleared nucleic acid based tests from https://www.fda.gov/MedicalDevices/ProductsandMedicalProcedures/InVitroDiagnostics/ucm330711.htm'},{'name':'','step_number':2,'version':'','input_list':[],'output_list':[],'prerequisite':[],'description':'Potential headers were added for manual annotation'},{'name':'','step_number':3,'version':'','input_list':[],'output_list':[],'prerequisite':[],'description':'Manual annotation of breast cancer tests - search tools included PubMed, UniProt, EDRN, HGNC, Google'},{'name':'','step_number':4,'version':'','input_list':[],'output_list':[],'prerequisite':[],'description':'Added UniProtID column and EDRN values from biomarkers-joined.xlsx into FDA tests dataset'},{'name':'','step_number':5,'version':'','input_list':[],'output_list':[],'prerequisite':[],'description':' Hyperlinks added clinical use in AdoptionEvidence'},{'name':'','step_number':6,'version':'','input_list':[],'output_list':[],'prerequisite':[],'description':'Incorporated GTR terms https://www.ncbi.nlm.nih.gov/gtr/'},{'name':'','step_number':7,'version':'','input_list':[],'output_list':[],'prerequisite':[],'description':' Modified header definitions and variable descriptions'},{'name':'','step_number':8,'version':'','input_list':[],'output_list':[],'prerequisite':[],'description':'Manual population of chart based on database searches and review of literature'}]},'execution_domain':{'external_data_endpoints':[],'environment_variables':{},'script_driver':'','software_prerequisites':[],'script':[]},'error_domain':{'empirical_error':{},'algorithmic_error':{}},'parametric_domain':[{'step':'','param':'','value':''}],'usability_domain':['FDA-approved or cleared nucleic acid-based human biomarker tests for breast cancer - This file contains FDA-approved human biomarker tests for breast cancer. Each row represents one gene linked to its respective test. Genes are labeled by relevant identifiers/accessions from UniProtKB, HGNC, and EDRN. Tests are distinguished by manufacturer, FDA submission ID(s), clinical trial ID(s), and PubMed ID(s).'],'bco_id':'-1','io_domain':{'input_subdomain':[],'output_subdomain':[{'mediatype':'csv','uri':{'access_time':'','uri':'http://data.oncomx.org/ln2wwwdata/reviewed/human_cancer_biomarkers_breast.csv','filename':' human_cancer_biomarkers_breast.csv'}},{'mediatype':'csv','uri':{'access_time':'','uri':'http://data.oncomx.org/ln2wwwdata/reviewed/human_cancer_biomarkers_breast.stat.csv','filename':'human_cancer_biomarkers_breast.stat.csv'}}]}}}

    global config_json
    global mongo_cl
    global mongo_cl_bco
    global mongo_cl_counters
    global mongo_cl_users
    global mongo_cl_log
    global mongo_cl_invalid
    global client

    print "Content-Type: application/json"
    print

    try:
        config_json = json.loads(open("conf/config.json", "r").read())
        if os.path.exists("conf/config.custom.json"):
            custom_config_json = json.loads(open("conf/config.custom.json", "r").read())
            for k_one in custom_config_json:
                for k_two in custom_config_json[k_one]:
                    if k_one in config_json:
                        if k_two in config_json[k_one]:
                            config_json[k_one][k_two] = custom_config_json[k_one][k_two]
    except Exception, e:
        print(e)
        out_json = {"taskstatus":0, "errormsg":"Loading config failed!"}
        print json.dumps(out_json, indent=4)
        sys.exit()

    try:
        client = MongoClient('mongodb://localhost:27017',
            username=config_json["dbinfo"]["mongodbuser"],
            password=config_json["dbinfo"]["mongodbpassword"],
            authSource=config_json["dbinfo"]["mongodbname"],
            authMechanism='SCRAM-SHA-1',
            serverSelectionTimeoutMS=10000
        )
        client.server_info()
        mongo_dbh = client[config_json["dbinfo"]["mongodbname"]]
        mongo_cl_bco = mongo_dbh[config_json["dbinfo"]["collections"]["bco"]]
        mongo_cl_counters = mongo_dbh[config_json["dbinfo"]["collections"]["counters"]]
        mongo_cl_users = mongo_dbh[config_json["dbinfo"]["collections"]["users"]]
        mongo_cl_log = mongo_dbh[config_json["dbinfo"]["collections"]["log"]]
        mongo_cl_invalid = mongo_dbh[config_json["dbinfo"]["collections"]["invalid_id"]]
        # pdb.set_trace()
        try:
            svc = in_json["svc"] if "svc" in in_json else ""
            auth_obj = {"status": 0}
            if svc != "search_objects_no_auth":
                auth_obj = auth.authenticate(mongo_cl_log)
                logged_email = auth_obj["email"] if auth_obj["status"] == 1 else ""

            if svc == "login_user":
                out_json = {}
                auth_obj = auth.login(mongo_cl_users, in_json, config_json["dbinfo"]["sessionlife"],mongo_cl_log)
                logged_email = auth_obj["email"] if auth_obj["status"] == 1 else ""
            elif svc == "register_user":
                out_json = auth.register_user(mongo_cl_users, in_json, mongo_cl_log)
            elif svc == "get_profile" and (auth_obj["status"] == 1 or local_flag):
                out_json = auth.get_profile(mongo_cl_users, auth_obj, config_json["profileinfo"], mongo_cl_log)
            elif svc == "save_profile" and (auth_obj["status"] == 1 or local_flag):
                out_json = auth.save_user(mongo_cl_users, in_json, logged_email, mongo_cl_log)
            elif svc == "reset_password" and (auth_obj["status"] == 1 or local_flag):
                current_pass, new_pass = in_json["passwordone"], in_json["passwordtwo"]
                out_json = auth.reset_password(mongo_cl_users, logged_email, current_pass,new_pass, mongo_cl_log)
            elif svc == "search_objects" or svc == "search_objects_no_auth":
                out_json = search_objects(in_json)
            elif svc == "importbcos"  and (auth_obj["status"] == 1 or local_flag):
                import_bcos(in_json, logged_email)
                out_json = {"result": True}
            elif svc == "get_object_view_json":
                out_json = get_object_view_json(in_json)
                out_json["editflag"] = logged_email in out_json["creators"]
            elif svc == "get_object_edit_json" and (auth_obj["status"] == 1 or local_flag):
                out_json = get_object_edit_json(in_json)
            elif svc == "save_object" and (auth_obj["status"] == 1 or local_flag):
                out_json = save_object(in_json["bco"], logged_email)
            else:
                out_json = {"taskstatus":0, "errormsg":"Submitted service does not exist!"}
            out_json["auth"] = auth_obj
        except Exception, e:
            out_json = util.log_error(mongo_cl_log, traceback.format_exc())

    except pymongo.errors.ServerSelectionTimeoutError as err:
        out_json = {"taskstatus":0, "errormsg":"Connection to mongodb failed!"}
    except pymongo.errors.OperationFailure as err:
        print err
        return err
        out_json = {"taskstatus":0, "errormsg":"MongoDB auth failed!"}

    
    out_json["editorversion"] = config_json["editorversion"]
    print json.dumps(out_json, indent=4)



if __name__ == '__main__':
    main()



