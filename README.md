# Warehouse app.
## Table of contents
* [Info about the project](#info-about-the-project)
* [How to use](#how-to-use)
    + [Dependancies](#dependancies)
    + [Start the app 🚀](#start-the-app-🚀)
    + [Exposed ports](#exposed-ports)
        - [Access to PgAdmin4](#access-to-pgadmin4)
        - [Add a new server in PgAdmin4](#add-a-new-server-in-pgadmin4)

## Info about the project

- The project uses Docker to help the user with running and testing it.

- In the `docker_compose.yml` file I specifically map a
volume to this file `docker_postgres_init`. With the start of the 
db container this file runs. 

- Some depedencies like helmet probably could be avoided since security 
and authentication are beyond of the scope of the project.

- I tried to create and implement a 'weird' design pattern for the Models
instead of installing a third party ORM. I tried a bit to copy the popular `mongoose` library.

- The validators are mainly for debugging.

- The front-end React app's code is close to atrocious. I just wanted to quickly
hit the endpoints without wasting time in the front-end.

## How to use
- Install the dependancies.
- Clone the project.
- Start up the docker containers.
- Open the corrisponding services in the browser.
### Dependancies

You will need to install:

- [Docker](https://docs.docker.com/get-docker/)
- [Node.JS / NPM](https://nodejs.org/en/download/)

Please install the latest versions if possible.

### Start the app 🚀

Clone the project:
```
git clone https://github.com/cloud-np/warehouse-app.git
```

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

If something went wrong with the database run:

```
sudo rm -rf ./db/data && mkdir ./db/data
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


