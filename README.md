# Vectorize PostgreSQL Data

This repository is a set of services to vectorize PostgreSQL data for Weaviate. After configuring your environment
variables, spinning up either the NodeJS or Python service, you can use the `/vectorize` endpoint to vectorize your
data.

## Prerequisites

- [OpenAI API key](https://openai.com/blog/openai-api)
- [Weaviate instance](https://weaviate.io/)
- PostgreSQL database

## NodeJS

### Step 1: Create a `.env` file

Create a `.env` file in the `/node` repository with the following contents:

```bash
POSTGRESQL_CONNECTION_STRING=<YOUR_PG_URL>
WEAVIATE_URL=<YOUR_WEAVIATE_URL_WITHOUT_HTTPS_INCLUDED>
WEAVIATE_API_KEY=<YOUR_WEAVIATE_API_KEY>
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
```

| Variable                       | Description                                                         |
| ------------------------------ | ------------------------------------------------------------------- |
| `POSTGRESQL_CONNECTION_STRING` | The connection string to your PostgreSQL database.                  |
| `WEAVIATE_URL`                 | The URL to your Weaviate instance, not including `HTTP` or `HTTPS`. |
| `WEAVIATE_API_KEY`             | The API key to your Weaviate instance.                              |
| `OPENAI_API_KEY`               | An API key for OpenAI.                                              |

### Step 2: Install dependencies

```bash
cd node && npm i
```

### Step 3: Run the service

```bash
# This will utilize Nodemon to watch for changes and restart the service.
npm run dev

# This will run the service without Nodemon.
npm run start
```

### Step 4: Vectorize your data

```bash
curl localhost:3000/vectorize/<TABLE_NAME>
```

By passing a table's name to the `/vectorize` endpoint, the service will vectorize all of the data in that table and
send it to Weaviate.

You can introspect your data source by hitting the `/show_tables` endpoint:

```bash
curl localhost:3000/show_tables
```

And see more detail for each table by hitting the `/show_table/<TABLE_NAME>` endpoint:

```bash
curl localhost:3000/show_table/<TABLE_NAME>
```

### Step 5: Test your data

```bash
curl localhost:3000/near_text/<TABLE_NAME>/<COLUMN_NAME>/<SEARCH_TERM>
```

By passing a table's name, column name, and search term to the `/near_text` endpoint, the service will search for
similar text in Weaviate.

For example:

```bash
curl localhost:3000/near_text/employees/first_name/John
```

You can also search multiple fields by passing a comma-separated list of column names:

```bash
curl localhost:3000/near_text/employees/first_name,last_name/John
```

## Python

Coming soon!

# vectorize-postgresql-data
