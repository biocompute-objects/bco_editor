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
The example given below is for CentOs server. 

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
        > sudo chown -R mongod:mongod /path/to/your/mongodata

6) sudo service mongod start
```




