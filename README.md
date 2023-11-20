# Connecting your databases locally

You will need to create .env files to link both the development and test databases locally. You must create two new files in the root directory:
    .env.development
    .env.test
These will each contain a single line connecting the databases by name. These names can be found in db/data/setup.sql, and the lines you will add to the files, respectively, are:
    PGDATABASE=nc_news
    PGDATABASE=nc_news_test
