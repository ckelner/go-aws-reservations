# Datadog: 1 MySQL reported by 2 hosts

Run [MySQL via Docker](https://hub.docker.com/_/mysql/):

```
docker run --name kelnerhax-mysql -e MYSQL_ROOT_PASSWORD=kelnerhax -d mysql:latest
```

`docker inspect <container-name>` to get the container ip from `NetworkSettings.IPAddress"

`docker exec -it <container-name> /bin/bash` to get on the docker container
