# Movistar AR POC 

For the sake of making it more real-world, setup has also a build step (here with **TypeScript**).

## Run

    Install docker and nodejs

    git clone https://github.com/AndresSoca/movistar-poc.git

    npm install

    docker-compose up --build

    Create db (see Warning section at the end)

## Test

```sh
curl 'http://localhost:3000/health-check/ping'
# {"environment":"development","database":"up"}

curl 'http://localhost:3000/customer/1'
# {"customer_id":1,"name":"Carlos López","document_type":"dni","document_id":"123456789"}

curl 'http://localhost:3000/purchase'
# {"items":[{"id":1,"name":"Equipo telefónico inalámbrico hogar","type":"product"},{"id":2,"name":"Moto G6","type":"product"},{"id":3,"name":"Moto G8","type":"product"},{"id":4,"name":"Desvío de llamadas","type":"service"},{"id":5,"name":"Internet 50Mb","type":"service"},{"id":6,"name":"L;inea fija","type":"service"},{"id":7,"name":"Tv digital","type":"service"},{"id":8,"name":"Roaming","type":"service"},{"id":9,"name":"Identificación de llamadas","type":"service"}]}

curl 'http://localhost:3000/products/1/'
# {"customer_id":"1","products":[{"id":1,"name":"Equipo telefónico inalámbrico hogar","brand":"Samsung","category":"landline","status":"activated"},{"id":3,"name":"Moto G8","brand":"Motorola","category":"mobile","status":"delivery_pending"}]}

curl 'http://localhost:3000/products/1/product/3'
# {"customer_id":"1","product":{"id":3,"name":"Moto G8","brand":"Motorola","category":"mobile","status":"delivery_pending","delivereyOrderId":"GFFKKAS"}}

curl 'http://localhost:3000/services/1/'
# {"customer_id":"1","services":[{"id":4,"name":"Desvío de llamadas","start":"2020-04-17T06:24:52.842Z","end":"2020-04-17T10:55:37.024Z","status":"terminated"}]}

curl 'http://localhost:3000/services/1/service/4'
# {"customer_id":"1","service":{"id":4,"name":"Desvío de llamadas","start":"2020-04-17T06:24:52.842Z","end":"2020-04-17T10:55:37.024Z","status":"terminated"}}

curl 'http://localhost:3000/order/GFFKKAS'
# {"order":"GFFKKAS","eta":"2020-05-02T10:55:37.024Z","tracking":[{"status":"started","timestamp":"2020-04-16T10:58:45.761Z"},{"status":"in_progress","timestamp":"2020-04-17T10:58:45.761Z"}]}
```

## WARNING

Don't keep `.env` file in the repo. It's here as it makes PoC simpler.

Don't forget to create table `mi_movistar` and run scripts `data/db-schema.sql` and `data/db-data.sql`.

You can use Adminer that should be running on `localhost:8080` (System: PostgreSQL, Server: postgres, Username: postgres, Password: postgres, Database: mi_movistar)
