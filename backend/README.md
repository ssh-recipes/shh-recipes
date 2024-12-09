## Development Instructions

`npm install -g nodemon`
Nodemon is used to automatically restart the server upon files being changed

`npm install`
Install dependencies locally

`cp .env.template .env.local`
Copy the .env template file, and fill it out. PORT can be anything, using something like 8080 is standard.

You will need a SQL database. SQL_DATABASE name can be anything too.

`npm run seed`
This will setup the database, aswell as introduce some mock recipes.

`npm run dev`
This will run the development script, which will automatically restart the server upon files being changed.

## Main Instructions

`npm run main`
This will run the server
