
### MongoDB Installation Example

If you do not have MongoDB installed on your server, here is an example installation steps for CentOs server (taken from
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/)

```

1) Create a /etc/yum.repos.d/mongodb-org-4.0.repo file so that you can install MongoDB directly using yum:

[mongodb-org-4.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc

2) sudo yum install -y mongodb-org

3) Start mongod
        $ sudo service mongod start

4) Start MongoDB without authentication
        $ mongo
        
5) Create the user administrator
        > use admin
        > db.createUser({ 
                user: "superadmin", 
                pwd: "superpass", 
                roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase","readWriteAnyDatabase"]
        })
        
Then disconnect from the mongo shell (Ctrl+D).

6) Disconnect from mongo shell and enable authentication in mongod configuration file and change "disabled" to "enabled"
        $ sudo vi /etc/mongod.conf
      
        #security:
        #        authorization: "disabled"

7) Restart mongod
        $ sudo service mongod restart
  
    From now on, all clients connecting to this server must authenticate themselves as a valid users, and they will be only able to perform actions as determined by their assigned roles.


8) Connect and authenticate as the user administrator, and create additional users

        $ mongo 
        > use admin
        > db.auth("superadmin", "superpass")
        1
        > use bcodb_1_tst
        > db.createUser({user: "bcodbadmin", pwd: "bcodbpass", roles: [ { role: "readWrite", db: "bcodb_1_tst" } ]})
        

