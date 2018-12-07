BioCompute Editor
=================

The BioCompute Editor is a web application that can be used to create and edit BioCompute objects based on BioCompute schema described in the BCO specification document. This editor uses <a href="https://github.com/jdorn/json-editor">JSON Editor</a> developed by Jeremy Dorn.

=======
The BioCompute Editor is a web application that can be used to create and edit BioCompute objects based on BioCompute schema described in the BCO specification document.
=======

Software requirement
====================
* Any linux operating system
* MongoDB Community or Enterprise version


### MongoDB Installation Example
If you do not have MongoDB installed on your server, here is an example of [MongoDB installation instruction steps](mongodb_installation.md) steps for CentOs server. 


### Downloading BioCompute Editor
Use git clone to clone the bco_editor repository

```
git clone https://github.com/biocompute-objects/bco_editor.git

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

As for html and cgi-bin directories, the easiest way (assuming your apache is set to allow following symbolic links) is to make symbolic links from your server html and cgi-bin roots.

```
  $ sudo ln -s  /myrepositories/bco_editor/cgi-bin /var/www/cgi-bin/bco_editor
  $ sudo ln -s  /myrepositories/bco_editor/html /var/www/html/bco_editor
```

Or you can copy the folders physically.

```
  $ sudo cp -r /myrepositories/bco_editor/cgi-bin /var/www/cgi-bin/bco_editor
  $ sudo cp -r /myrepositories/bco_editor/html /var/www/html/bco_editor
```

You also need to make sure that apache has write access to /var/www/html/bco_editor/log/.

```
  $ sudo chown -R apache:apache /var/www/html/bco_editor/log/
```

Finally, you need to make sure the htmlRoot and cgiRoot javascript variables in bco_editor/html/index.html are assigned right values

```
  <script>
    var htmlRoot = '/bco_editor/';
    var cgiRoot = '/cgi-bin/bco_editor/';
  </script>
```

### Admin Utility
The script admin_util under cgi-bin/ subdirectory is used to manage the BioCompute Editor portal. Given below are commands (issued from the cgi-bin subdirectory) that can be used to perform various tasks.
 
```
Listing registered users 
  $ python admin_util -a list_users

Registration is public but users cannot login before they are activated using this admin_util tool (read below on how to activate pending registerations).

Adding new user
  $ python admin_util -a upsert_user -e jim.jones@gmail.com -f James -l Jones -p pass123 -s 1

Activating or updating user
 $ python admin_util -a upsert_user -e jim.jones@gmail.com -s 1

Removing user
  $ python admin_util -a delete_user -e jim.jones@gmail.com

Listing BioCompute objects
  $ python admin_util -a list_bco

Deleting BioCompute object
  $ python admin_util -a delete_bco -o 2

```



### Other Links
BioCompute Partnership: http://biocomputeobject.org

GitHub repository for BioCompute Objects:
https://github.com/biocompute-objects/bco_editor

