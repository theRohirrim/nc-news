# Summary

Northcoders News is a fully functional back end API which simulates an online news website with articles and comments, similar to Reddit. It can be accessed here:

- https://northcoders-news-r0zu.onrender.com/api


## Cloning the project to your local machine

First click the green 'Code' button on the repository page for this project on GitHub. Next copy the URL, and in a location of your choosing on your local machine terminal, run the command:

- git clone -URL-

Then, to ensure you have all required packages to run, develop, and test this project, run this command in your terminal:

- npm install

## Connecting your databases locally

You will need to create .env files to link both the development and test databases locally. You must create two new files in the root directory:

1. .env.development
2. .env.test

These will each contain a single line connecting the databases by name. These names can be found in db/data/setup.sql, and the lines you will add to the files, respectively, are:

1. PGDATABASE=nc_news
2. PGDATABASE=nc_news_test

## Set-up and seeding of your databases

To set up your local PostgreSQL development and test databases, run this command in your terminal:

- npm run setup-dbs

Next, you can seed your databases with appropriate development and test data with the command:

- npm run seed

Finally, to run the test suites for this project, run:

- npm run test

## Versions of PostgreSQL and Node

This project runs on the following versions of PostgreSQL and Node:

- NodeJs: 16.14.2
- PostgreSQL: 8.7.3