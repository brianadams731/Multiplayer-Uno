# Term Project: Web Application
Term Project for CSC667 Internet Application Design and Development Spring 2022 where we have successfully created a Web Application.

## Members
- Nakulan Karthikeyan, ID: 920198861
- Johnson Nguyen, ID: 921066533
- Thien, ID: 921100229
- Brian Adams, ID: 921039987


# How To
* project root is considered the directory where the projects package.json is located

## Install dependencies
1. Open project root in terminal
2. Execute npm install

## Set up Dev Environment
1. Install postgres https://www.postgresql.org/  (install cli tools, pgAdmin, remember password)
-  (optional) install DataGrip using student license
-  (optional) create db user (log in to psql, execute CREATE USER <user name here>;), default user is postgres super user
2. Create project DB (log in to psql, execute CREATE DATABASE uno; )
3. Create .env file in project root (touch .env)
4. Add PORT and DATABASE_URL directives, example .env at bottom

## Run Development Server
1. Navigate to project root in terminal
2. Execute npm run dev

## Add Unit Tests
1. Add a new file to the test directory named <file to test>.test.ts
- An example is provided, reference docs when needed. Docs: https://jestjs.io/docs/using-matchers

## Run Unit Tests
1. Navigate to project root in terminal
2. Execute npm test

## End to End Tests/Dev Tooling
- Postman https://www.postman.com/ (install desktop client)

## Example .env
PORT = 8080
DATABASE_URL = postgres://postgres:abcd@localhost:5432/uno


## DB URI Explained
postgres://postgres:abcd@localhost:5432/uno
           ^ username ^pass  ^host  ^port ^ db name

postgres://<username>:<password>@localhost:5432/uno