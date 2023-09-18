git checkout master

yarn build
scp -r dist/* root@167.71.80.195:/var/www/html
