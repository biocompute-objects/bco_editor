BioCompute Editor
=================

The BioCompute Editor is a web application that can be used to create and edit BioCompute objects based on BioCompute schema described in the BCO specification document. This editor uses <a href="https://github.com/jdorn/json-editor">JSON Editor</a> developed by Jeremy Dorn.


Software requirement
====================
* Any linux operating system
* MongoDB Community or Enterprise version


### MongoDB Installation Example
If you do not have MongoDB installed on your server, here is an example of [MongoDB installation instruction steps](mongodb_installation.md) steps for CentOs server. 


### Downloading BioCompute Editor
Use git clone to clone the bco_editor repository

```
git clone https://github.com/ITsolution-git/biocompute.git

```

### BioCompute Editor Setup
Assuming you have followed [MongoDB installation instructions steps](mongodb_installation.md), edit the config.json file under cgi-bin/conf/ subdirectory to customize it to your server. In the example given below, the name of the mongodb database is "bcodb_1_tst", and requires an authenticated mongodb user who has a "readWrite" role to write to it. In the example config file given below, the mongodb username and password are "bcodbadmin" and "pass123!" respectively.


```
  "dbinfo":{
        "mongodbname":"bcodb_1_tst"
        ,"mongodbuser":"bcodbadmin"
        ,"mongodbpassword":"bcodbpass"
        ,"sessionlife":3600
        ,"collections":{
            "bco":"c_bco"
            ,"counters":"c_counters"
            ,"users":"c_users"
        }
    }
    ,"pathinfo":{
        "htmlroot":"http://example.com/bco_editor/"
        ,"htmlpath":"/myrepositories/bco_editor/html/"
    }

```

### Other Links
BioCompute Partnership: http://biocomputeobject.org

GitHub repository for BioCompute Objects:
https://github.com/biocompute-objects/bco_editor




