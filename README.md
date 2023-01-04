# Warehouse app.

## How to use
- Install the dependancies.
- Start up the docker containers.
- Open the corrisponding services in the browser.
### Dependancies

You will need to install:

- [Docker](https://docs.docker.com/get-docker/)
- [Node.JS / NPM](https://nodejs.org/en/download/)

Please install the latest versions if possible.

### Start the app

Start Docker containers, networks and creates the needed volumes for the database:

```
npm run docker:build
npm run docker:up
```
You could also just use ```npm run docker:up``` it will build all the containers if they do not exist.

Stops Docker containers and networks:

```
npm run docker:down
```

### Exposed ports 

Once you have started the Docker container using the provided tools and commands below you will need to navigate to:

- **React app:**
[http://localhost:5173](http://localhost:5173).
- **Node:**
[http://localhost:3000](http://localhost:3000).


#### Access to PgAdmin4

- **URL:** [http://localhost:8000](http://localhost:8000)
- **Username:** `pgadmin4@pgadmin.org`
- **Password:** `admin`

#### Add a new server in PgAdmin4

- **Host name/address** `db`
- **Port** `5432`
- **Username** `pern_db`
- **Password** `root`
