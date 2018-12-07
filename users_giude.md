BioCompute Editor
=================

The BioCompute Editor is a web application that can be used to create and edit BioCompute objects based on BioCompute schema described in the BCO specification document. This editor uses <a href="https://github.com/jdorn/json-editor">JSON Editor</a> developed by Jeremy Dorn.


Software requirement
====================
* Any linux operating system
* MongoDB Community or Enterprise version


<<<<<<< HEAD
### MongoDB Installation
Use git clone to clone the bco_editor repository

```
git clone https://github.com/biocompute-objects/bco_editor.git

```
=======
### MongoDB Installation Example
If you do not have MongoDB installed on your server, here is an [example installation](mongodb_installation.md) steps for CentOs server. 
>>>>>>> a3a0c23899a306768c755eb659a178be2d151664


### Downloading BioCompute Editor
Use git clone to clone the bco_editor repository

```
git clone https://github.com/biocompute-objects/bco_editor.git

```

### BioCompute Editor Setup
Assuming you have followed [MongoDB installation instructions](mongodb_installation.md), edit the bco_editor/cgi-bin/conf/config.json file to change some values that are specific to your server. In the example given below, there is a mongodb named "bcodb_1_tst", a mongodb user "bcodbadmin" (with password "pass123!") who has a "readWrite" role in "bcodb_1_tst".


```
  "dbinfo":{
        "mongodbname":"bcodb_1_tst"
        ,"mongodbuser":"bcodbadmin"
        ,"mongodbpassword":"pass123!"
        ,"mongocl_bco":"c_bco"
        ,"mongocl_counters":"c_counters"
        ,"mongocl_users":"c_users"
        ,"sessionlife":3600
    }
    ,"rootinfo":{
        "htmlroot":"http://example.com/bco_editor/"
        ,"cgiroot":"http://exacmple.com/cgi-bin/bco_editor/"
    }
    ,"pathinfo":{
        "htmlpath":"/myrepositories/bco_editor/html/"
        ,"cgipath":"/myrepositories/bco_editor/cgi-bin/"
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


Finally, you need to make sure the htmlRoot and cgiRoot javascript variables in bco_editor/html/index.html are assigned right values

```
  <script>
    var htmlRoot = '/bco_editor/';
    var cgiRoot = '/cgi-bin/bco_editor/';
  </script>
```





