# Datadog: 1 MySQL reported by 2 hosts

* Run [MySQL via Docker](https://hub.docker.com/_/mysql/):
  ```
  docker run -p 3306:3306 --name kelnerhax-mysql -e MYSQL_ROOT_PASSWORD=<password> -d mysql:latest
  ```
* `docker inspect <container-name>` to get the container ip from `NetworkSettings.IPAddress"
* `docker exec -it <container-name> /bin/bash` to get on the docker container
* Follow https://docs.datadoghq.com/integrations/mysql/#prepare-mysql
  * `mysql -u root --password=<password>`
  * `CREATE USER 'datadog'@'%' IDENTIFIED BY '<dd-mysql-password>';`
  * `GRANT REPLICATION CLIENT ON *.* TO 'datadog'@'%' WITH MAX_USER_CONNECTIONS 5;`
  * `GRANT PROCESS ON *.* TO 'datadog'@'%';`
  * `exit`
* Use https://github.com/ckelner/datadog-mysql-vagrant to spin up to vagrants and configure the mysql check
  * Use the special virtualbox IP `10.0.2.2` to connect to the mysql instance via the host on port `3306`
  * Spin up a second vagrant the same way using `./second_vagrant/Vagrantfile` in the repo

This will result in duplicate hosts reporting the same metric as seen here:

![two-hosts-one-db](https://i.imgur.com/3WD3M1C.png)
