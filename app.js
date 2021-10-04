'use strict';

const express = require('express');
const AWS = require('aws-sdk');
const aws_config = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  endpoint: process.env.DYNAMODB_ENDPOINT
};

const dynamodb = new AWS.DynamoDB(aws_config)
const documentClient = new AWS.DynamoDB.DocumentClient(aws_config);
const tableName = 'tokenTable';
const tokenKey = 'tokenABC';

var params = {
  TableName : tableName,
  KeySchema: [
      { AttributeName: 'token', KeyType: 'HASH'}
  ],
  AttributeDefinitions: [
      { AttributeName: 'token', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
  }
};

dynamodb.createTable(params, (err, data) => {
  if (err) console.error(err);
  else console.log(data);
});

const PORT = 4040;
const HOST = '0.0.0.0';
const app = express();

app.get('/token', (req, res) => {
  var params = {
    TableName: tableName,
    Key: { 'token': tokenKey }
  };

  documentClient.get(params, (err, data) => {
    if (err) console.error(err);
    else res.send(`Are you ${data.Item ? data.Item.value : 'nobody'}?`);
  });
});

app.get('/token/:token', (req, res) => {
  const token = req.params.token;
  const params = {
    TableName: tableName,
    Item:{
        'token': tokenKey,
        'value': token
    }
  };

  documentClient.put(params, (err, data) => {
    if (err) console.error(err);
    else res.send(`Welcome ${token}`);
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
