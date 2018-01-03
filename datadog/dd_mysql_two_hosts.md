# Datadog: 1 MySQL reported by 2 hosts

* Run [MySQL via Docker](https://hub.docker.com/_/mysql/):
  ```
  docker run --name kelnerhax-mysql -e MYSQL_ROOT_PASSWORD=<password> -d mysql:latest
  ```
* `docker inspect <container-name>` to get the container ip from `NetworkSettings.IPAddress"
* `docker exec -it <container-name> /bin/bash` to get on the docker container
* Follow https://docs.datadoghq.com/integrations/mysql/#prepare-mysql
  * `mysql -u root --password=<password>`
  * `CREATE USER 'datadog'@'localhost' IDENTIFIED BY '<dd-mysql-password>';`
  * `GRANT REPLICATION CLIENT ON *.* TO 'datadog'@'localhost' WITH MAX_USER_CONNECTIONS 5;`
  * `GRANT PROCESS ON *.* TO 'datadog'@'localhost';`
  * `exit`
  * `mysql -u datadog --password=<dd-mysql-password> -e "show status" | grep Uptime && echo -e "\033[0;32mMySQL user - OK\033[0m"`
* 
