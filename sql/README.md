## Process taxi data in SQL via Docker

Clone the repo and enter the sql directory:

```
git clone https://github.com/andreytyu/taxi-test.git
cd taxi-test/sql
```
*Copy taxi trip data to the directory!*

Start a container with a PostGIS-enabled database as follows:
```
docker run -p 9900:5432 -v $(pwd):/data --name taxi-postgis -e POSTGRES_PASSWORD=password -d mdillon/postgis
```
Database `postgres` with user `postgres` and password `password` will start on `localhost:9900`, create a `/data` volume and mount all data from current directory there

Connect to the database:
```
docker run -v $(pwd):/data  -it --link taxi-postgis:postgres --rm postgres     sh -c 'exec psql -h "$POSTGRES_PORT_5432_TCP_ADDR" -p "$POSTGRES_PORT_5432_TCP_PORT" -U postgres'
```

Run https://github.com/andreytyu/taxi-test/blob/master/sql/data_prep.sql from psql console with this command:

```
\i /data/data_prep.sql
```