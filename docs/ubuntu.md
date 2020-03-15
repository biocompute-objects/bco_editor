# BioCompute Editor Setup: Ubuntu instalation
For CentOS instalation [click here](./centos.md)

### 1. install http server
`sudo apt update`

`sudo apt install nginx`

### 2. python3 and pip3, virtualenv install
`sudo apt-get install build-essential libssl-dev libffi-dev python-dev`

`sudo apt install python3-pip`

`sudo pip3 install virtualenv`

### 3. mongodb install

`sudo apt update`

`sudo apt install -y mongodb`

`sudo systemctl status mongodb`

### 4. Set up backend
Clone the project from git into home (or prefered) directory:

`git clone https://github.com/ITsolution-git/bio-react.git`

Example project directory for this manual:

	/home/[user]/bio-react

****************************************************************
**[user] should be replaced by current user name logged in centos**

For example, assuming that current user name is centos:
`/home/centos/bio-react`
****************************************************************

**/ you can skip this step to set virtual environment /**

- set virtual environment in project directory:

`virtualenv env`

activate environment
`source env/bin/activate`

`sudo apt-get install postgresql`

then fire:

sudo apt-get install python-psycopg2
and last:

sudo apt-get install libpq-dev`

- install packages in environment 
`pip3 install -r requirements.txt` 

- migrate database:
`python3 manage.py migrate`

- collect static:
`python3 manage.py collectstatic`

- create admin:
`python3 manage.py createsuperuser`

- You will be asked Admin Email, First/Last Name, and Password.

- allow domain/host:
	
Go to `project root/django_react_proj`, open `settings.py`. 
Then at line 27, you can see 'ALLOWED_HOSTS = []'
You can add your domain or ip like this.

`ALLOWED_HOSTS = ['biocomputeobject.org', '3.56.15.15']`

`There are allowed host names.`

### 5. Set up frontend:
Copy the frontend project to `/var/www`
	`sudo cp -rf ~/bio-react/frontend /var/www/` 

### 6. Deploy project
- install gunicorn
`sudo pip3 install gunicorn`

- set gunicorn service to run django
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

Then: `sudo vim /etc/systemd/system/gunicorn.service`

```
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=[user]
Group=nginx
WorkingDirectory=/home/[user]/bio-react
ExecStart=/home/[user]/.local/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/var/www/gunicorn.sock \
          django_react_proj.wsgi:application

[Install]
WantedBy=multi-user.target

```


***************************
**[user] should be replaced by current user name logged in centos**
***************************

- enable gunicorn socket:
	`sudo systemctl enable gunicorn.socket`

- enable and start gunicorn service:

	`sudo systemctl enable gunicorn.service`

	`sudo systemctl start gunicorn.service`

- check status gunicorn:

	`sudo systemctl status gunicorn.service`
	
You should get a notification that the service is working

- add to startup

	`sudo systemctl daemon-reload`

	`sudo systemctl restart gunicorn`

**Make sure you replace SERVER_IP_OR_DOMAIN with your own server ip or domain address in the next steps**

- Nginx Configuration
	
	`sudo vim /etc/nginx/conf.d/biocompute.conf`

```
server {
    listen 80;
    server_name 10.10.0.2;

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
	

**[user] should be replaced by the current user name logged in to centos**

	
Test Nginx Configuration for syntax error:
	`sudo nginx -t`

Reload Nginx and restart this configuration:
	`sudo systemctl restart nginx`

If you use AWS, open a port number in Inbound Rule of AWS console.
