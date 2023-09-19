import { client } from '../weaviate.js';

// function to add our documents to Weaviate
const addDocuments = async (className, data) => {
  let batcher = client.batch.objectsBatcher();
  let counter = 0;
  const batchSize = 100;

  for (const document of data) {
    console.log(document);
    const obj = {
      class: className,
      properties: { ...document },
    };

    batcher = batcher.withObject(obj);
    if (counter++ == batchSize) {
      await batcher.do();
      counter = 0;
      batcher = client.batch.objectsBatcher();
    }
  }

  const res = await batcher.do();
  return res;
};

// function to vectorize our documents
async function vectorize(className, data) {
  let newDocuments;

  try {
    // transform the id into <className>_id to avoid conflicts since weaviate reserves the id field
    data.forEach((document) => {
      document[`${className}_id`] = document.id;
      delete document.id;
    });

    const classObj = {
      class: className,
      vectorizer: 'text2vec-openai',
      moduleConfig: {
        'text2vec-openai': {
          model: 'ada',
          modelVersion: '002',
          type: 'text',
        },
      },
    };

    try {
      const schema = await client.schema.classCreator().withClass(classObj).do();
      if (schema) {
        console.log(`✅ Schema created ${schema}`);
      }
    } catch (err) {
      console.error(`❌ schema already exists`);
    }

    console.log(`⏲️ Adding ${data.length} documents to ${className} class`);
    newDocuments = await addDocuments(className, data);

    // Look at those vectors 👀
    console.log(newDocuments);
  } catch (err) {
    console.error(err.message);
  }
  return newDocuments;
}

// near_text search
const nearText = async (className, fields, text) => {
  fields = fields.join(' ');
  try {
    const res = await client.graphql
      .get()
      .withClassName(className)
      .withFields(fields)
      .withNearText({ concepts: [`${text}`] })
      .withLimit(2)
      .do();

    console.log(JSON.stringify(res, null, 2));
    return res;
  } catch (err) {
    console.error(err);
    return err;
  }
};

// function to capitalize the first letter of tables
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// function to delete a class from Weaviate
const deleteClass = async (className) => {
  try {
    const schema = await client.schema.classDeleter().withClassName(className).do();
    console.log(`✅ Schema deleted ${className}`);
  } catch (err) {
    console.error(`❌ schema does not exist`);
  }
};

export { vectorize, deleteClass, nearText, capitalize };
