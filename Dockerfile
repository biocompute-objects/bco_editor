FROM httpd:2.4

RUN apt update && apt install -y python-pip

# Enable the Apache CGI module.
# Serve HTML from /var/www/html
# Server Python CGI script from /var/www/cgi-bin
RUN sed -i \
  -e 's|#LoadModule cgid_module modules/mod_cgid.so|LoadModule cgid_module modules/mod_cgid.so|' \
  -e 's|/usr/local/apache2/htdocs|/var/www/html|g' \
  -e 's|/usr/local/apache2/cgi-bin|/var/www/cgi-bin|g' \
  /usr/local/apache2/conf/httpd.conf && echo "$0 FOOBAR" && cat /usr/local/apache2/conf/httpd.conf

COPY requirements.txt .

RUN pip install -r requirements.txt
