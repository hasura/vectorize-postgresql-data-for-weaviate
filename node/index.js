import { config } from 'dotenv';
import express from 'express';
import { vectorize, nearText, deleteClass, capitalize } from './utilities/weaviateHelpers.js';
import { showColumns } from './utilities/showHelpers.js';
import { db } from './pg.js';

config();

const app = express();

// show all available tables
app.get('/show_tables', (req, res) => {
  db.query('SELECT * FROM information_schema.tables WHERE table_schema = $1', ['public'], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.send(error);
    } else {
      console.log('Query results:', results.rows);
      res.json(results.rows);
    }
  });
});

// show columns' names and types of a table
app.get('/show_columns/:table', (req, res) => {
  const table = req.params.table;
  db.query('SELECT * FROM information_schema.columns WHERE table_name = $1', [table], (error, results) => {
    let columns;
    if (error) {
      console.error('Error executing query:', error);
      res.send(error);
    } else {
      columns = showColumns(results.rows);
      console.log('Query results:', columns);
    }
    res.json(columns);
  });
});

// show all data from a table
app.get('/show_data/:table', (req, res) => {
  const table = req.params.table;
  const query = `SELECT * FROM ${table}`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Query results:', results.rows);
      res.json(results.rows);
    }
  });
});

// vectorize a table and all its rows
app.get('/vectorize/:table', async (req, res) => {
  const table = req.params.table;
  const query = `SELECT * FROM ${table}`;

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          reject(error);
        } else {
          resolve(results.rows);
        }
      });
    });

    const statusMessage = `Vectorizing ${results.length} rows from ${table}`;
    console.log(statusMessage);
    const vectorizedData = await vectorize(table, results);

    res.json({
      data: vectorizedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// make a near_text query to Weaviate
app.get('/near_text/:className/:fields/:text', async (req, res) => {
  const className = capitalize(req.params.className);
  const fields = req.params.fields.split(',');
  const results = await nearText(className, fields, req.params.text);
  res.json({
    results,
  });
});

// delete a class in Weaviate
app.get('/delete_class/:className', async (req, res) => {
  const className = capitalize(req.params.className);
  try {
    await deleteClass(className);
    res.json({
      message: `Class ${className} deleted`,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
