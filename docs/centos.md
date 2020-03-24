# BioCompute Editor Setup: CentOS instalation

This instalation was run on a 
<a href="https://aws.amazon.com/marketplace/pp/Centosorg-CentOS-7-x8664-with-Updates-HVM/B00O7WM7QW" target="_blank">CentOS Linux 7 x86_64 HVM EBS ENA</a>

For Ubuntu instalation [click here](./ubuntu.md)
### 1. python3 install

reference this url:
https://codingpaths.com/deploy-django-application-with-uwsgi-and-nginx-on-centos/

```
sudo yum install -y epel-release
sudo yum install -y https://centos7.iuscommunity.org/ius-release.rpm
sudo yum update
sudo yum install -y python36u python36u-libs python36u-devel python36u-pip python-devel
```

### 2. Install http server

reference this url: 
https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-centos-7

````
sudo yum install epel-release
sudo yum install nginx
sudo systemctl enable nginx
````

### 3. `python3`, `pip3`, and `virtualenv` install

reference this url:
https://codingpaths.com/deploy-django-application-with-uwsgi-and-nginx-on-centos/

```
sudo pip3.6 install --upgrade pip
pip3 install virtualenv virtualenvwrapper
```


### 4. MongoDB install
reference this url:
https://www.attosol.com/how-to-install-mongodb-in-aws-linux-step-by-step/

1. Install VIM:

	`sudo yum install vim`

	or use another text editor

2. Create the following file at `/etc/yum.repos.d/mongodb-org-4.2.repo`:

	`sudo vim /etc/yum.repos.d/mongodb-org-4.2.repo`

```
[mongodb-org-4.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.2.asc
```

3. Install MongoDB with:

	`sudo yum install mongodb-org`

4. Increase User Limits

	`sudo vim /etc/security/limits.conf`

	- Add the following to the file:
```
mongod     soft    nofiles   64000
mongod     soft    nproc     64000
```

5. Start MongoDb

	`sudo systemctl start mongod`

6. Check the status of MongoDB to make sure it is running:

	`sudo systemctl status mongod`

7. Enable MongoDB to start on boot:

	`sudo systemctl enable mongod`

### 5. Set up backend

1. If git is not installed: 

	`sudo yum install git`

2. Clone the project into your home directory:

	`git clone https://github.com/biocompute-objects/bco_editor`

	Example project directory for this manual:

	`/home/centos/bco_editor`

	****************************************************************
	`centos` **should be replaced by current user name logged in**

	For example, assuming that current user name is centos:
	`/home/centos/bco_editor`
	****************************************************************

**/ you can skip this step to set virtual environment /**

3. install packages in environment 
	
	`pip3 install -r requirements.txt` 

4. migrate database:
	
	`python3 manage.py migrate`

5. collect static:
	
	`python3 manage.py collectstatic`

6. create admin:
	
	`python3 manage.py createsuperuser`

7. You will be asked Admin Email, First/Last Name, and Password.

8. Set allowed domain/hosts:
	
	`sudo vim ~/bco_editor/django_react_proj/settings.py`
	
	Then at line 27 add your domain or ip like this:

	`ALLOWED_HOSTS = ['exampleproject.org', '1.1.1.1.1']`

### 5. Set up frontend:
Copy the frontend project to `/var/www`

`sudo cp -rf ~/bco_editor/frontend /var/www/frontend` 

### 6. SElinux available for /var/www
reference this url:	https://linuxize.com/post/how-to-disable-selinux-on-centos-7/

`sudo setsebool -P httpd_can_network_connect on`

`sudo chcon -Rt httpd_sys_content_t /var/www`

Otherwise you can disable SELinux ( best way )

`sudo setenforce 0`

### 7. Deploy project
1. install gunicorn
	
	`sudo pip3 install gunicorn`

2. set gunicorn service to run django
	
	`sudo vim /etc/systemd/system/gunicorn.socket`

	copy below content and insert to file open and save

```
[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/var/www/gunicorn.sock

[Install]
WantedBy=sockets.target
```

3. Verify the gunicorn path:

	`which gunicorn` 

4. Creat the gunicorn service

	`sudo vim /etc/systemd/system/gunicorn.service`

***************************
Copy the text below to creat the gunicorn service

**centos should be replaced by current user name logged in centos and the `ExecStart` should match the path you got from #3 above**
***************************
```
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=centos
Group=nginx
WorkingDirectory=/home/centos/bco_editor
ExecStart=/usr/local/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/var/www/gunicorn.sock \
          django_react_proj.wsgi:application

[Install]
WantedBy=multi-user.target

```

5. enable gunicorn socket:
	
	`sudo systemctl enable gunicorn.socket`

6. enable and start gunicorn service:

	`sudo systemctl enable gunicorn.service`

	`sudo systemctl start gunicorn.service`

7. check status gunicorn:

	`sudo systemctl status gunicorn.service`
	
	You should get a notification that the service is working

8. add to startup

	`sudo systemctl daemon-reload`

	`sudo systemctl restart gunicorn`

9. Nginx Configuration
	
	`sudo vim /etc/nginx/conf.d/biocompute.conf`
	***************************
	Copy the text below to create the Nginx configuration

	**Make sure you replace `SERVER_IP_OR_DOMAIN` with your own server ip or domain address**

	**`centos` should be replaced by the current user name logged in**
	***************************
```
server {
    listen 80;
    server_name SERVER_IP_OR_DOMAIN;

    location = /favicon.ico { access_log off; log_not_found off; }

    # Django Admin assets
    location /assets/ {
        alias /home/centos/bco_editor/static/;
    }

    # Django Api access
    location /api/ {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://unix:/var/www/gunicorn.sock;
    }

    # Django Admin access
    location /admin {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://unix:/var/www/gunicorn.sock;
    }

    # Frontend access		    
    location / {
        autoindex on;
        root /var/www/frontend/build;
        index index.html;
        try_files $uri $uri/ =404;
    }
    error_page  404 /index.html;
    location = /index.html {
        root /var/www/frontend/build;
    }
}
```
To enable the above configuration you next need to remove or comment out the 'server' section in `/etc/nginx/nginx.conf` file.

10. Test Nginx Configuration for syntax error:
	
	`sudo nginx -t`

11. Reload Nginx and restart this configuration:
	
	`sudo systemctl restart nginx`

	If you use AWS, open a port number in Inbound Rule of AWS console. See <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html" target="_blank">the AWS help page</a> for more information.

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

### 9. Check website
- frontend:
	`http(s)://domain/`
- admin:
	`http(s)://domain/admin`
