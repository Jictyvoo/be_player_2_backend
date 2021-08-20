# Be a Player 2 Backend Challenge

## The Challenge


## Instructions

### Requirements

In order to run this application, it's needed to have:

- NodeJS-14
- SQL database -is highly recommended to be a MySQL database.

### Running

With the needed requirements set up, is needed to install all package dependencies, it can be installed using the command

```shell
npm install
```

After that, is needed to setup the `.env` file, containing the info to access your database and a secret key, for encrypting the token for authentication.

As this project uses Prisma engine, it's needed to run the command

```shell
npx prisma migrate
```

that will migrate all tables in your database.

In order to run this project, you can:

- build it: `npm run build`

  - run: `node dist/server.js`

- run on dev mode: `npm run dev`

## Docker

In case is needed to run it on a docker production environment, is only needed to run the command:

```shell
docker-compose up -d
```

This command will build all docker images that the application neededs.

### Database

As the `Dockerfile` for building this server is optimized for production, it's not possible to run prisma commands directly, as they are commands for development. So in order to have this fully operational, it's needed to connect with the database and run the migrations.
