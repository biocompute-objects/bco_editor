
# BioCompute Editor Setup: CentOS installation and configuration

## Before installing

There are a few things to note when following these instructions.
1.  You should be logged in as the root user or as a user with root privileges to begin the installation.  We will create a user specifically for the portal but first you need to have permissions to create such a user.
2.  The instructions use defaults where possible, except where it makes sense to compartmentalize function (for example, creating a virtual environment or a custom configuration file for the HTTP server).
3. These instructions pertain to installing an instance of the BioCompute Object Server (BCOS) on a Linux machine which will have its ports opened to allow access from outside the network (detailed below).  If you do not want to allow the outside world (e.g. anything outside of the LAN that the server exists in) to access the server then simply ignore the steps for opening up the ports.  If you DO want to allow the outside world to access your server, it is likely that your sysadmin or IT department will have to configure additional firewall/DNS settings to allow the connections.

## Useful Commands for Checking Status and Debugging

**gunicorn**
Start|Restart|Stop gunicorn - systemctl [start|restart|stop] gunicorn
logging commands...

**nginx**
Start|Restart|Stop nginx - systemctl [start|restart|stop] nginx
logging commands

**system**
Locate where an executable named [PROGRAM] is - which [PROGRAM]
Example:  which python

## Installation on an EC2 CentOS 7 Instance

### A note about instance type

These instructions are for the <a href="https://aws.amazon.com/marketplace/pp/Centosorg-CentOS-7-x8664-with-Updates-HVM/B00O7WM7QW" target="_blank">CentOS Linux 7 x86_64 HVM EBS ENA</a> image hosted on AWS EC2.

### 1. Create users and directories

#### Users

First we need to create a user, portal_user, specifically for running BCOS, 

```
useradd portal_user
```

then we need to set the password, 

```
passwd portal_user
```

Now that we have our portal user, we need to add them to the group that is allowed to operate with root permissions, 

```
sudo usermod -a -G wheel portal_user
```

Note the "-a" flag in the above command - we want to append this user to the wheel group without removing the user from any other groups it's already a part of.

Log out and back in of the terminal.  Once you've done this, you can switch to the portal user to perform all of our installation steps, 

```
su -u portal_user
```

#### Directories

Create the directories necessary for cloning and deployment.  The directories created here are ones that are **not** created by yum or pip/pip3 installs.  We'll detail the purpose of each directory and who can access it.

**/home/portal_user/bco_editor/**
**Purpose:**  The directory to house the BCOS source code clone from GitHub.

Create the directory, 

```
mkdir /home/portal_user/bco_editor/
```

**/var/www/html/portal/**
**Purpose:**  The directory to house the **built** frontend for BCOS.

Create the directory, 

```
mkdir /var/www/html/portal/
```

Now that we have the necessary directories, we can begin installing dependencies.




### 2. Install programs and dependencies

#### vim

Vim is a text editor that uses keyboard shortcuts to edit text files.  You don't have to use vim to edit the text files in these instructions but it is somewhat easier than editing them on your local machine and then using SFTP to transfer them back to your server.  If you're working with a GUI (such as Gnome or KDE on Ubuntu), then you can also use gedit to edit the files.

Install vim, 

```
yum install vim
```

#### Python 3

Reference URL:
https://codingpaths.com/deploy-django-application-with-uwsgi-and-nginx-on-centos/

The Python installation requires several dependencies for Python itself,

```
sudo yum install -y https://centos7.iuscommunity.org/ius-release.rpm
sudo yum update
sudo yum install -y python36u python36u-libs python36u-devel python36u-pip python-devel
```


#### nginx (HTTP Server)

nginx is an easily configurable web server that we'll use to serve BCOS.

Reference URL: 
https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-centos-7


```
sudo yum install epel-release
sudo yum install nginx
```

#### pip3, virtualenv, and virtualenvwrapper

pip3 is an installer for python, virtualenv is used to create [virtual environments](https://realpython.com/python-virtual-environments-a-primer/) (which are used when installing BCOS), and virtualenvwrapper is a set of utilities for working with virtual environments.

Reference URL:
https://codingpaths.com/deploy-django-application-with-uwsgi-and-nginx-on-centos/

```
sudo pip3.6 install --upgrade pip
pip3 install virtualenv virtualenvwrapper
```

After installing pip3, virtualenv, and virtualenvwrapper, you may get a few warnings, 

```
WARNING: The script virtualenv is installed in '/usr/local/bin' which is not on PATH.
Consider adding this directory to PATH or, if you prefer to suppress this warning, use --no-warn-script-location.
WARNING: The script virtualenv-clone is installed in '/usr/local/bin' which is not on PATH.
Consider adding this directory to PATH or, if you prefer to suppress this warning, use --no-warn-script-location.
WARNING: The script pbr is installed in '/usr/local/bin' which is not on PATH.
Consider adding this directory to PATH or, if you prefer to suppress this warning, use --no-warn-script-location.
```

These warnings simply tell you that the PATH variable (a system variable that maps commands to file locations) does not contain the paths for these particular programs.  In other words, if you try to type 'virtualenv' after running these installations, you'll get an error that the program can't be found, 

[error]

To fix this we'll edit the PATH variable (see [Stack Overflow](https://unix.stackexchange.com/questions/26047/how-to-correctly-add-a-path-to-path) for an explanation of this fix - in our case we are only editing for bash and not a C-style shell).

First, open the path variable file with vim, 

```
vim /home/portal_user/.bash_profile
```

The file should look something like this:

```
# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
        . ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/.local/bin:$HOME/bin

export PATH
```

We want to add a line just below where it says "PATH=\$PATH:\$HOME/.local/bin:\$HOME/bin".  To do this, press the "I" key (which starts insert mode in vim), then scroll down and insert the new line, 

```
# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
        . ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/.local/bin:$HOME/bin
PATH=/usr/local/bin:$PATH

export PATH
```

After you've done this, press the ESC key, type ":w" (for write file), then type ":q" (for quit); type each command without the quotation marks as shown here.

In order for the PATH variable to be updated we have to soft restart our terminal session.  To do this, make sure you're in the home directory of portal_user, then reload the shell, 

```
cd /home/portal_user/
source ./.bash_profile
```

Confirm that the PATH variable has been updated by trying to run the following, 

```
virtualenv
```

You should get an error about usage and arguments, 

```
usage: virtualenv [--version] [--with-traceback] [-v | -q] [--app-data APP_DATA] [--clear-app-data] [--discovery {builtin}] [-p py] [--creator {builtin,cpython3-posix,venv}] [--seeder {app-data,pip}] [--no-seed]
                  [--activators comma_sep_list] [--clear] [--system-site-packages] [--symlinks | --copies] [--download | --no-download] [--extra-search-dir d [d ...]] [--pip version] [--setuptools version] [--wheel version] [--no-pip]
                  [--no-setuptools] [--no-wheel] [--symlink-app-data] [--prompt prompt] [-h]
                  dest
virtualenv: error: the following arguments are required: dest
```

This error is what we want to see because it shows us that virtualenv is being called correctly, albeit without any usable arguments (hence the error).

#### MongoDB

MongoDB is the database used with Django to store the actual BioCompute objects.  Configuration of the database can be quite complex, but in the default installation, which we are performing here, anyone can read and write.

Reference URL:
https://www.attosol.com/how-to-install-mongodb-in-aws-linux-step-by-step/

Any time you call vim with a file name for a file that doesn't exist, it automatically creates the file for you.  Thus, even though the command below to create MongoDB repository file refers to a file that doesn't exist, we can still edit the file as if it does and simply save our work to create it.

A repository file is simply instructions to an installer telling it where to find the package we're looking for.  We will create the repository file then tell our installer to use it.

Create the repository file, 

```
vim /etc/yum.repos.d/mongodb-org-4.2.rep
```

Press the "I" key to enter insert mode, then type in the following, 

```
[mongodb-org-4.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.2.asc
```

After you’ve done this, press the ESC key, type “:w” (for write file), then type “:q” (for quit); type each command without the quotation marks as shown here.

Now we can install MongoDB by typing

```
yum install mongodb-org
```




#### gunicorn

Gunicorn is the intermediary between nginx (the HTTP server) and Django (the application provider).  We can install it by simply running

```
sudo pip3 install gunicorn
```

#### git

We need the git command line tools in order to clone the repository.  Simply run the yum installer, 

```
yum install git
```

### 3. Clone the BCOS repository

The project directory for BCOS is /home/portal_user/bco_editor/.  We need to clone the github repository so that we can test our configurations in the next several steps.  Navigate to /home/portal_user/bco_editor/, then clone the git repository, 

```
cd /home/portal_user/bco_editor/
git clone https://github.com/biocompute-objects/bco_editor
```

This step just clones the **source code** for the editor, but we will still need to **build** the code to use BCOS (Part II of this guide).


### 4. Create a virtual environment and install dependencies

**You should never install libraries or other versions of Python in the "home" Python directory, usually /usr/bin/.  Doing this runs the risk of running into versioning and dependency errors further down the line!**  Virtual environments allow us to compartmentalize Python projects so that we can avoid this problem.  A virtual environment is essentially a clone of the "home" Python installation and therefore if something goes wrong with a project, we can just delete the virtual environment and start over.

Make sure we're in the right directory, then create the virtual environment, 

```
cd /home/portal_user/bco_editor/
virtualenv env
```

Notice that this command has now created the folder /home/portal_user/bco_editor/env/.  This is where our virtual environment is.

Now that we have created the virtual environment, we need to activate it (this just means we're telling the system to use this folder to refer to when we invoke Python commands), 

```
source env/bin/activate
```

You should now see the (env) prefix in bash, 

```
$[user@12.34.56.78](env)
```

Next we want to install everything into our virtual environment that we'll need to run Django.  Start by installing the requirements, 

```
pip3 install -r requirements.txt
```

There should now be a folder named /home/portal_user/bco_editor/django_react_proj.  This is the folder that holds Django.

Migrate the database using manage.py.  manage.py is a utility script to perform administrative functions on Django,

```
python3 manage.py migrate
```

Collect the static files.  These are files that Django doesn't need to change?

```
python3 manage.py collectstatic
```

Create an administrative account for Django.  This step will ask you for several identifiers, such as e-mail and first/last names,  

```
python3 manage.py createsuperuser
```

### 4. Configurations and starting programs

We need to configure all of the programs we've installed.  Once we have workable configuration files, we'll try to start each program.

#### MongoDB

We want to increase the workload that MongoDB can take on at any one time.  We do this by increasing the "user limits" defined in a configuration file.  **Configuration files for MongoDB are read in alphabetical order!**  This means that we have make sure any configuration changes we make override the defaults and any other configuration files in MongoDB's configuration folder.

Create the MongoDB configuration file, 

```
vim /etc/security/limits.d/mongo_limits.conf
```

Press the “I” key to enter insert mode, then type in the following, 

```
mongod     soft    nofiles   64000
mongod     soft    nproc     64000
```

After you’ve done this, press the ESC key, type “:w” (for write file), then type “:q” (for quit); type each command without the quotation marks as shown here.

#### django

We need to configure django to allow incoming connections.  Before we can allow such connections, we need to actually know what our IP is.  **If the following steps do not result in a working server, contact your sysadmin or IT department to determine the public-facing IP of your instance.**

Let's see what the IP of our machine is, 

```
ifconfig
```

This should give you some output describing ethernet settings, 

```
ens5: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9001
        inet 10.201.0.193  netmask 255.255.255.0  broadcast 10.201.0.255
        inet6 fe80::1061:a4ff:feff:cf0f  prefixlen 64  scopeid 0x20<link>
        ether 12:61:a4:ff:cf:0f  txqueuelen 1000  (Ethernet)
        RX packets 492158  bytes 448958959 (428.1 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 350146  bytes 233434569 (222.6 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 736297  bytes 122942625 (117.2 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 736297  bytes 122942625 (117.2 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

```

The part that we want to take note of is the "broadcast" IP (on line 2 of the output here), since this is the IP that can be accessed from the internet.  In this case, the broadcast IP is 10.201.0.255.

Now that we have the broadcast IP, let's adjust Django's settings to allow connections.  Within /home/portal_user/bco_editor/django_react_proj/ we have the file "settings.py".  This file is used to configure Django to allow incoming connections.  Open settings.py, 

```
vim /home/portal_user/bco_editor/django_react_proj/settings.py
```

Press the "I" key to enter insert mode, navigate to the line that says "ALLOWED_HOSTS", and replace anything in the list with the domain name and the broadcast IP, 

```
ALLOWED_HOSTS = ['portal.aws.biochemistry.gwu.edu', '10.201.0.255']
```

After you’ve done this, press the ESC key, type “:w” (for write file), then type “:q” (for quit); type each command without the quotation marks as shown here.



#### gunicorn

gunicorn uses a [socket](https://en.wikipedia.org/wiki/Unix_domain_socket) to receive instructions.  A socket is essentially an intermediary between two programs on a system.  The instructions received by the socket are used to interact with Django and serve our application.

Create the socket file, 

```
vim /etc/systemd/system/gunicorn.socket
```

Press the "I" key to enter insert mode.  Now add the lines below tell the socket where to listen for instructions, 

```
[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/var/run/gunicorn.sock

[Install]
WantedBy=sockets.target
```

After you’ve done this, press the ESC key, type “:w” (for write file), then type “:q” (for quit); type each command without the quotation marks as shown here.

Now that we have the socket defined, we can actually tell gunicorn what to do when it receives instructions.  gunicorn is a "service" (also known as a "daemon"), which means that it runs in the system background and requires no interaction from the user (you) once started.

Create the service file, 

```
vim /etc/systemd/system/gunicorn.service
```

Press the “I” key to enter insert mode. Now add the lines below to define the service,

```
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=portal_user
Group=nginx
WorkingDirectory=/home/portal_user/bco_editor/
ExecStart=/usr/local/bin/gunicorn --access-logfile - --workers 3 --bind unix:/var/www/gunicorn.sock django_react_proj.wsgi:application

[Install]
WantedBy=multi-user.target
```

After you’ve done this, press the ESC key, type “:w” (for write file), then type “:q” (for quit); type each command without the quotation marks as shown here.

Now that we have a configuration file, let's try to start the service.  Enable the socket and the service, 

```
systemctl enable gunicorn.socket
systemctl enable gunicorn.service
```

Try to start gunicorn, 

```
systemctl start gunicorn.service
```

Check the status of gunicorn to make sure it's running without errors, 

```
systemctl status gunicorn.service
```

The first several lines of output from this command should look something like this:

```
● gunicorn.service - gunicorn daemon
   Loaded: loaded (/etc/systemd/system/gunicorn.service; enabled; vendor preset: disabled)
   Active: active (running) since Thu 2020-04-30 18:38:03 UTC; 5 days ago
 Main PID: 6904 (gunicorn)
   CGroup: /system.slice/gunicorn.service
           ├─6904 /home/portal_user/env/bin/python /home/portal_user/env/bin/gunicorn --access-logfile - --workers 3 --bind unix:/var/run/gunicorn.sock django_react_proj.wsgi:application
           ├─6907 /home/portal_user/env/bin/python /home/portal_user/env/bin/gunicorn --access-logfile - --workers 3 --bind unix:/var/run/gunicorn.sock django_react_proj.wsgi:application
           ├─6909 /home/portal_user/env/bin/python /home/portal_user/env/bin/gunicorn --access-logfile - --workers 3 --bind unix:/var/run/gunicorn.sock django_react_proj.wsgi:application
           └─6911 /home/portal_user/env/bin/python /home/portal_user/env/bin/gunicorn --access-logfile - --workers 3 --bind unix:/var/run/gunicorn.sock django_react_proj.wsgi:application
```

The "Active" line is the important one - if it says "active (running)", then the service has started correctly.

Let's make it so that the system starts gunicorn on boot?

```
systemctl daemon-reload
```

Finally, restart the service?

```
systemctl restart gunicorn
```

#### nginx

In general, it is best practice to create a custom configuration file for each website served out of nginx.  We will be following this practice here to create a custom configuration file for our server.  But first, we need to disable the default server settings for nginx.

Open the default configuration file, 

```
vim /etc/nginx/nginx.conf
```

Press the “I” key to enter insert mode.  Comment out the default server lines, ending up with something like this (only the server section is shown here):

```
#    server {
#        listen       80 default_server;
#        listen       [::]:80 default_server;
#        server_name  _;
#        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;

#        location / {
#        }

#        error_page 404 /404.html;
#            location = /40x.html {
#        }

#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }

```

After you’ve done this, press the ESC key, type “:w” (for write file), then type “:q” (for quit); type each command without the quotation marks as shown here.

Now that the default server is no longer configured, let's create our custom configuration file,

```
vim /etc/nginx/conf.d/biocompute.conf
```

Press the “I” key to enter insert mode. Now add the lines below to define the service, noting that the "server_name" lines should have the same values as the "ALLOWED_HOSTS = ['portal.aws.biochemistry.gwu.edu', '10.201.0.255']" line in /home/portal_user/bco_editor/django_react_proj/settings.py, 

```
server {
    listen 80;
    server_name 100.25.1.222 portal.aws.biochemistry.gwu.edu;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name 100.25.1.222 portal.aws.biochemistry.gwu.edu;
    ssl_certificate /etc/pki/tls/certs/portal.aws.biochemistry.gwu.edu.crt;
    ssl_certificate_key /etc/pki/tls/private/portal.aws.biochemistry.gwu.edu.key;

    location = /favicon.ico { access_log off; log_not_found off; }

    # Django Admin assets
    location /assets/ {
        alias /home/portal_user/bco_editor/static/;
    }

    # Django Api access
    location /api/ {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://unix:/var/run/gunicorn.sock;
    }

    # Django Admin access
    location /admin {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://unix:/var/run/gunicorn.sock;
    }

    # Frontend access
    location / {
        autoindex on;
        root /var/www/html/portal/;
        index index.html;
        try_files $uri $uri/ =404;
    }
    error_page  404 /index.html;
    location = /index.html {
        root /var/www/html/portal/;
    }
}

```

After you’ve done this, press the ESC key, type “:w” (for write file), then type “:q” (for quit); type each command without the quotation marks as shown here.

There are a few things to note about the above configuration file.  First, the configuration re-directs all HTTP requests to the server to the Secure Sockets Layer (SSL) version of the server (think http://... vs. https://...).  Second, if you do not have an SSL key and certificate, you'll need to generate (an uncertified) one.  Usually your sysadmin or IT department will procure signed certificates for you.

We'll briefly go through the steps here for an unsigned certificate, adopted from [Linux.com](https://www.linux.com/training-tutorials/creating-self-signed-ssl-certificates-apache-linux/).

Navigate to the SSL directory, 

```
cd /etc/ssl/
```

Generate a Certificate Signing Request (CSR) named after your domain and fill the fields out with the relevant information when prompted, 

```
openssl req -new > portal.aws.biochemistry.gwu.edu.csr
```

Now we want to create our (unsigned) certificate with our domain, 

```
openssl rsa -in privkey.pem -out portal.aws.biochemistry.gwu.edu.key
openssl x509 -in portal.aws.biochemistry.gwu.edu.csr -out portal.aws.biochemistry.gwu.edu.crt -req -signkey portal.aws.biochemistry.gwu.edu.key
```

Lastly, move the certificate and the key to their respective locations, 

```
mv portal.aws.biochemistry.gwu.edu.crt ./certs/
mv portal.aws.biochemistry.gwu.edu.key ./private/
```

Since we haven't built our source yet, there won't be anything in /var/www/html/portal/ - specifically, there will not be an index.html file to serve.  Let's create a dummy index page just to test the configuration, 

```
vim /var/www/html/portal/index.html
```


Press the “I” key to enter insert mode, then add some sample text, 

```
This is an index test file.
```

After you’ve done this, press the ESC key, type “:w” (for write file), then type “:q” (for quit); type each command without the quotation marks as shown here.

Now we have a file to test.  Check nginx for configuration errors, 

```
nginx -t
```

If there are no errors, enable nginx, then restart the server, 

```
systemctl enable nginx
systemctl restart nginx
```

### Adjust Permissions

### 9. Check website
- frontend:
	`http(s)://domain/`
- admin:
	`http(s)://domain/admin`

[REMOVE portal_user from WHEEL AFTER DONE INSTALLING EVERYTHING]

### 2. Adjust permissions [MOVE TO DOWN BELOW]

There are several permissions that need to be adjusted in order for the server to run.

#### Adjust the SELinux security policy

The CentOS image used in these instructions comes with a Security-Enhanced Linux kernel (SELinux), which essentially means that there are extra settings and protocols in place to protect the system from malicious, negligent, or accidental actors.  While these measures are important, they can get in the way of some of the permissions that we'll need in order to run the server.

We'll adjust the policy to allow HTTP connections and to allow HTTP access to our application frontend folder, 

```
setsebool -P httpd_can_network_connect on
chcon -Rt httpd_sys_content_t /var/www/html/portal/
```

If for some reason you are still getting permission errors, you can, **as a last resort**, disable SELinux, 

```
sudo setenforce 0
```

### 8. Grant user permission to access assets and media files.
For the following steps, `centos` should be replaced with what ever your user name is.

1. The current user needs to be added to nginx group.

	- `sudo usermod -aG nginx centos`

2. grant access to assets and media.
	
	- go to project folder:

	`cd ~/bco_editor`
	
	- Give nginx ownership of all the files, recursively. 

	`sudo chown centos:nginx * -R`
	
	- Modify access levels for all `media` files
	
	`sudo chmod 775 media -R`

	- Modify access levels for all `static` files
	
	`sudo chmod 775 static -R`

# Building and deploying BCOS


### 5. Set up frontend:
Copy the frontend project to `/var/www`

`sudo cp -rf ~/bco_editor/frontend /var/www/frontend` 







