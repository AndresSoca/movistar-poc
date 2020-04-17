# Movistar AR POC 

For the sake of making it more real-world, setup has also a build step (here with **TypeScript**).

## Run

    docker-compose up --build

## Test

```sh
curl http://localhost:3000/ping
# {"environment":"development","database":"up"}
```

## WARNING

Don't forget to create table `mi_movistar` and run scripts `data/db-schema.sql` and `data/db-data.sql`.

You can use Adminer that should be running on `localhost:8080` (System: PostgreSQL, Server: postgres, Username: postgres, Password: postgres, Database: mi_movistar)
