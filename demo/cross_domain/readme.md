###host
127.0.0.1   test.cross_domain.163.com

###httpd-vhosts.conf
```xml
<VirtualHost *:8080>
    DocumentRoot "D:\frontend\demo\cross_domain\server"
    ServerName test.cross_domain.163.com

    <Directory "D:\frontend\demo\cross_domain\server">
        Options Indexes FollowSymLinks Includes ExecCGI
        AllowOverride All
        Order allow,deny
        Allow from all
    </Directory>
    
</VirtualHost>
```