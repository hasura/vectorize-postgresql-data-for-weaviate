import pg
import weaviate_config as wv
from flask import Flask

app = Flask(__name__)


# health check
@app.route('/weaviate/health')
def weaviate_health():
    schema = wv.client.schema.get()
    return {'message': '✅ weaviate is healthy', 'schema': schema}


# vectorize a table
@app.route('/vectorize/<string:table>')
def vectorize(table):
    # get the schema of the table and shape it
    schema = pg.get_schema(table)
    schema = {row['column_name']: row['data_type'] for row in schema}
    # change id to <table>_id to avoid conflicts with Weaviate's id
    schema[f'{table}_id'] = schema.pop('id')
    # query the db
    pg.cur.execute(f"SELECT * FROM {table}")
    data = pg.cur.fetchall()
    # change id to <table>_id to avoid conflicts with Weaviate's id
    for row in data:
        row[f'{table}_id'] = row.pop('id')
    # add the data to Weaviate
    results = wv.add_to_weaviate(schema, table, data)
    # json response with data, message, and results
    # return {'message': '✅ vectorized', 'data': data, 'results': results}
    return "✅ vectorized"


# delete a class from Weaviate
@app.route('/delete/<string:table>')
def delete(table):
    # delete the class
    wv.client.schema.delete_class(table)
    # json response with message
    return {'message': f"✅ deleted {table}"}


if __name__ == '__main__':
    app.run(debug=True)
