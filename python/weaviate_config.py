import os
from dotenv import load_dotenv
import weaviate
from utilities import weaviate_helper as helper

# Load environment variables
load_dotenv()

# Shape the connection string
connection_string = f"https://{os.environ.get('WEAVIATE_URL')}"

# Add the auth config
auth_config = weaviate.AuthApiKey(api_key=os.environ.get('WEAVIATE_API_KEY'))

client = weaviate.Client(url=connection_string, auth_client_secret=auth_config, additional_headers={
    "X-OpenAI-Api-Key": "YOUR_API_KEY"
})


# function to add documents to Weaviate
def add_to_weaviate(schema, table, data):
    def create_custom_class(class_name, schema):
        properties = [
            {
                "name": prop_name,
                "dataType": [data_type],
            }
            for prop_name, data_type in schema.items()
        ]

        print(properties)
        helper.convert_data_types(properties)

        class_obj = {
            "class": class_name,
            "properties": properties,
            "vectorizer": "text2vec-openai",
            "moduleConfig": {
                "text2vec-openai": {
                    "vectorizeClassName": False,
                    "model": "ada",
                    "modelVersion": "002",
                    "type": "text"
                }
            }
        }
        return class_obj

    class_obj = create_custom_class(table, schema)
    client.schema.create_class(class_obj)

    return f"✅ {len(data)} objects added to Weaviate"
