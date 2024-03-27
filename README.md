# nodejs_fullcycle_nginx_mysql_docker_compose_challenge


# TESTING GABS

docker run --name mysql-local -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=fullcycle -p 3306:3306 -d mysql:8.0

# How to use this lil punk

```
git clone https://github.com/gacerioni/nodejs_fullcycle_nginx_mysql_docker_compose_challenge.git

cd nodejs_fullcycle_nginx_mysql_docker_compose_challenge

docker-compose up
```

# SUMMARY

The compose is building the node.js app during the startup orchestration process.\
All the deps are in the workdir, because of the way I set the volume mappings.\
The scripts are already x+, btw.
