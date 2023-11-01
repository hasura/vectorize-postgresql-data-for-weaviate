import os
from dotenv import load_dotenv
import psycopg2
from psycopg2 import extras

# Load environment variables
load_dotenv()

# Establish a connection
conn = psycopg2.connect(os.environ.get('POSTGRESQL_CONNECTION_STRING'))

# Create a cursor
cur = conn.cursor(cursor_factory=extras.RealDictCursor)


# function to get the schema of a table as a dictionary with column names as keys and data types as values
def get_schema(table):
    cur.execute(
        f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table}'")
    schema = cur.fetchall()
    return schema
