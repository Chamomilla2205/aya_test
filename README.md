## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation and running the app
Go to root folder of the app.
1) Install all required packages
```
npm install
```
2) Build app:
```
npm run build
```
3) Run docker container:
```
docker-compose -f ./docker-compose.yml up
```
4) Start nodejs app in dev mode:
```
npm run start:dev
```
5) Regenerate dump to sql format(not required)
```
node ./seed/parse-dump.js
```
6) Run database migrations:
```
npm run migration:run
```
7) Populate database with dump data
```
$ docker exec -i postgres-db psql -U postgres -d aya_software < dump.sql
```

## QUESTIONS

### How to change the code to support different file versions?
```
We could create different versions of a parser and call the appropriate one using a factory pattern. This way, 
each version of the file can be processed correctly by its corresponding parser.
```

### How the import system will change if data on exchange rates disappears from the file, and it will need to be received asynchronously (via API)?
```
We could check if the exchange rates are missing from the file and, if so, make an asynchronous API call to fetch the exchange rates before processing the donations. This ensures that we have the necessary data before proceeding with any calculations.
```

### In the future the client may want to import files via the web interface, how can the system be modified to allow this?
```
We could add an endpoint for file import. The uploaded file would be stored in a cloud bucket, and the file key would be saved in our database. Anytime the client wants to access the file, they can retrieve it using the file key.
```
   
## License

Nest is [MIT licensed](LICENSE).
