import re
import datetime
import os, hashlib, time, base64, string
import Cookie
import json
import bcrypt
import util
import traceback


def make_hash_string():
    m = hashlib.md5()
    m.update(str(time.time()))
    m.update(str(os.urandom(64)))
    
    return string.replace(base64.encodestring(m.digest())[:-3], '/', '$')



def login(mongo_cl_users, in_json, session_life, mongo_cl_log):
   
    try:
        
        login_user = mongo_cl_users.find_one({'email' : in_json["email"]})
        
        out_json = {}
        if login_user:
            stored_password = login_user['password'].encode('utf-8')
            submitted_password = in_json['password'].encode('utf-8')
            if bcrypt.hashpw(submitted_password, stored_password) == stored_password:
                c = Cookie.SimpleCookie()
                session_id = make_hash_string() + make_hash_string()
                c['sessionid']= session_id
                c['email']= in_json["email"]
                c['sessionid']['expires'] = session_life
                email = in_json["email"]
                msg = "Signed in as " + email
                out_json = {"status":1, "email":email, "sessionid":session_id}
                if login_user["status"] == 0:
                    out_json = {"status":0, "errormsg":"Looks like your account has not been activated yet!"}
            else:
                out_json = {"status":0, "errormsg":"Login failed! Invalid email/password combination"}
        else:
            out_json = {"status":0, "errormsg":"Login failed! Invalid email/password combination"}
    except Exception, e:
        out_json = util.log_error(mongo_cl_log, traceback.format_exc())

    return out_json



def authenticate(mongo_cl_log):

    out_json = {}
    try:
        if 'HTTP_COOKIE' in os.environ:
            string = os.environ.get('HTTP_COOKIE')
            c = Cookie.SimpleCookie()
            c.load(string)
            if 'sessionid' in c:
                session_id = c['sessionid'].value
                email = c['email'].value
                msg = "Signed in as " + email
                out_json = {"status":1, "email":email, "sessionid":session_id}
            else:
                out_json =  {"status":0, "errormsg": "session ID not in cookie"}
        else:
            out_json =  {"status":0, "errormsg": "No cookie found!"}
    except Exception, e:
        out_json = util.log_error(mongo_cl_log, traceback.format_exc())

    return out_json



def reset_password(mongo_cl_users, logged_email, current_password, new_password, mongo_cl_log):

    out_json = {}
    try:
        login_user = mongo_cl_users.find_one({'email' : logged_email})
        stored_password = login_user['password'].encode('utf-8')
        current_password = current_password.encode('utf-8')
        if bcrypt.hashpw(current_password, stored_password) == stored_password:
            new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            update_obj = {"password":new_password}
            result = mongo_cl_users.update_one({"email":logged_email}, {'$set': update_obj}, upsert=False)
            return {"taskstatus": 1}
        else:
            return {"taskstatus":0, "errormsg":"Current password does not match stored password"} 
    except Exception, e:
        out_json = util.log_error(mongo_cl_log, traceback.format_exc())

    return out_json



def register_user(mongo_cl_users, user_obj, mongo_cl_log):
    user_obj["status"] = 0
    try:
        user_obj["password"] = bcrypt.hashpw(user_obj["password"].encode('utf-8'), bcrypt.gensalt())
        if mongo_cl_users.find({"email":user_obj["email"]}).count() != 0:
            out_json = {"taskstatus":0, "errormsg":"The email submitted is already registered!"}
        else:
            res = mongo_cl_users.insert_one(user_obj)
            out_json = {"taskstatus":1}
    except Exception, e:
        out_json = util.log_error(mongo_cl_log, traceback.format_exc())

    return out_json




def save_user(mongo_cl_users, in_json, logged_email, mongo_cl_log):
    out_json = {}
    try:
        result = mongo_cl_users.update_one({"email":logged_email}, {'$set': in_json}, upsert=False)
        return {"taskstatus": 1}
    except Exception, e:
        out_json = util.log_error(mongo_cl_log, traceback.format_exc())

    return out_json

def get_profile(mongo_cl_users, auth_obj, profile_obj, mongo_cl_log):

    out_json = {}
    try:
        doc = mongo_cl_users.find_one({"email":auth_obj["email"]})
        doc.pop("_id")
        doc.pop("password")
        if doc == None:
            out_json = {"taskstatus":0, "errormsg":"Object does not exist!"}
        else:
            out_json = {"userinfo":[]}
            for o in profile_obj:
                o["value"] = doc[o["field"]]
                out_json["userinfo"].append(o)
    except Exception, e:
        out_json = util.log_error(mongo_cl_log, traceback.format_exc())

    return out_json


