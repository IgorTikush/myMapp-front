git checkout master

yarn build
scp -r dist/* root@142.93.129.79:/var/www/html
