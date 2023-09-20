const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.todoHandler = async (event) => {
  // Determine the HTTP method used in the request
  const httpMethod = event.httpMethod;

  // Parse request data, e.g., the to-do item to add or other parameters
  const data = JSON.parse(event.body);

  // Define DynamoDB parameters
  const params = {
    TableName: 'ToDoListItems',
  };

  try {
    if (httpMethod === 'POST') {
      // Logic for adding a to-do item
      if (!data.TaskID) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'TaskID is required for adding a to-do item' }),
        };
      }
      
      // Set other attributes for the to-do item based on your data model
      params.Item = {
        TaskID: data.TaskID,
        // Add other attributes here
      };

      await dynamoDB.put(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'To-Do item added successfully' }),
      };
    } else if (httpMethod === 'GET') {
      // Logic for fetching all to-do items
      const result = await dynamoDB.scan(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify(result.Items),
      };
    } else if (httpMethod === 'DELETE') {
      // Logic for deleting a to-do item by TaskID
      if (!data.TaskID) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'TaskID is required for deleting a to-do item' }),
        };
      }

      params.Key = {
        TaskID: data.TaskID,
      };

      await dynamoDB.delete(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'To-Do item deleted successfully' }),
      };
    } else {
      return {
        statusCode: 405, // Method Not Allowed
        body: JSON.stringify({ message: 'Unsupported HTTP method' }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing request' }),
    };
  }
};
