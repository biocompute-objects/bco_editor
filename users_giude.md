BioCompute Editor
=================

The BioCompute Editor is a web application that can be used to create and edit BioCompute objects based on BioCompute schema described in the BCO specification document. This editor uses <a href="https://github.com/jdorn/json-editor">JSON Editor</a> developed by Jeremy Dorn.


Software requirement
====================
* Any linux operating system
* MongoDB Community or Enterprise version


### Downloading
Use git clone to clone the bco_editor repository

```
git clone https://github.com/biocompute-objects/bco_editor.git

```


### MongoDB Installation Example
If you do not have MongoDB installed on your server, here is an example installation steps for CentOs server. 

```
1) vim /etc/yum.repos.d/mongodb.repo and put the following in it

[mongodb]
name=MongoDB Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
gpgcheck=0
enabled=1

2) yum -y update

3) yum -y install mongodb-org mongodb-org-server

4) change dppath in /etc/mongod.conf to /path/to/your/mongodata

5) Make mongod the owner of mongodata dir
        $ sudo chown -R mongod:mongod /path/to/your/mongodata

6) Start mongod
        $ sudo service mongod start

7) Start MongoDB without authentication
        $ mongo
        
8) Create the user administrator
        > use admin
        > db.createUser({
                user: "useradmin",
                pwd: "thepianohasbeendrinking",
                roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
        })
        
Then disconnect from the mongo shell (Ctrl+D).

9. Disconnect from mongo shell and enable authentication in mongod configuration file and change "disabled" to "enabled"
        $ sudo vi /etc/mongod.conf
      
        #security:
        #        authorization: "disabled"

10) Restart mongod
        $ sudo service mongodb restart
  
    From now on, all clients connecting to this server must authenticate themselves as a valid users, and they will be only able to perform actions as determined by their assigned roles.


11) Connect and authenticate as the user administrator
        $ mongo mongodb://<host>:<port>
        > db.auth("superadmin", "thepianohasbeendrinking")
        1

    You can also connect and authenticate in one single step with 
        $ mongo mongodb://superadmin:thepianohasbeendrinking@<host>:<port>
        
       "mongodbname":"bcodb_1_tst"
        ,"mongodbuser":"bcodbadmin"
        ,"mongodbpassword":"pass123!"
        ,"mongocl_bco":"c_bco"
        ,"mongocl_counters":"c_counters"
        ,"mongocl_users":"c_users"
        ,"sessionlife":3600
        
12. Finally, create additional users.
        > use bcodb_1_tst
        > db.createUser({
                user: "bcodbadmin",
                pwd: "pass123!",
                roles: [ { role: "readWrite", db: "bcodb_1_tst" } ]
        })

```



