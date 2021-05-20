# Tech used

- TypeScript
- Node
- Graphql
- TypeORM
- mysql
- Express
- Argon2
- ioredis
- Nodemon

# Commands available

I used yarn for this. Following examples will be using yarn, feel free to use npm instead. <br>

```bash
yarn watch # this will help you to avoid compiling TypeScript
```

```bash
yarn dev # this will start using nodemon the project using js files (to keep as close as prod)
```

```bash
yarn dev2 # same as dev but using typescript
```

```bash
yarn start # same as dev but without nodemon
```

```bash
yarn start2 # same as dev2 but without nodemon
```

# Requirements

- mysql
- redis
- node (16.x)
- yarn or npm

# Setting up

1. yarn
2. yarn watch
3. open new terminal
4. yarn dev

# To use PostgreSQL

- add the "pg" module.
- remove "mysql2" module.
- change TypeORM config to use postgres.
- There may be some changes on code (duplicate entries).
