
'use strict';

const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { PutCommand, GetCommand, UpdateCommand, QueryCommand, DynamoDBDocumentClient, DeleteCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');
const ddbClient = new DynamoDBClient();

const marshallOptions = {
	convertEmptyValues: false,
	removeUndefinedValues: true,
	convertClassInstanceToMap: false,
};

const unmarshallOptions = {
	wrapNumbers: false,
};

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
	marshallOptions,
	unmarshallOptions,
});

const TableName = 'studentData'

const createData = async(props) => {
  try{
    const params = {
      TableName,
      Item: {
        entryYear: props.entryYear,
        id: props.studentId,
        name: props.name,
        class: props.class,
        address: props.address,
        phoneNumber: props.phoneNumber
      },
			ConditionExpression: 'attribute_not_exists(id)'
    };
    return await ddbDocClient.send(new PutCommand(params))
  }catch(err){
    return Promise.reject(err);
  }
}

const getData = async(entryYear, id) => {
  try{
    const params = {
      TableName,
      Key: {
        entryYear,
        id
      }
    };
    const { Item } = await ddbDocClient.send(new GetCommand(params));
    return Item;
  }catch(err){
    return Promise.reject(err)
  }
}

const queryData = async(entryYear) => {
  try{
    const params = {
      TableName,
      KeyConditionExpression: 'entryYear = :entryYear',
      ExpressionAttributeValues: {
        ':entryYear': entryYear
      }
    };
    const { Items } = await ddbDocClient.send(new QueryCommand(params));
    return Items;
  }catch(err){
    return Promise.reject(err);
  }
}

const scanData = async(limit, lastEvaluatedKey) => {
  try{
    const params = {
      TableName
    };
    if(limit){
      params.Limit = limit;
    }
    if(lastEvaluatedKey){
      params.ExclusiveStartKey = lastEvaluatedKey;
    }
    const { Items } = await ddbDocClient.send(new ScanCommand(params));
    return Items;
  }catch(err){
    return Promise.reject(err);
  }
}

const deleteData = async(entryYear, id) => {
  try{
    const params = {
      TableName,
      Key: {
        entryYear,
        id
      }
    };
    return await ddbDocClient.send(new DeleteCommand(params));
  }catch(err){
    return Promise.reject(err);
  }
}

const updateData = async(props) => {
  try{
    const params = {
      TableName,
      Key: {
        entryYear: props.entryYear,
        id: props.id
      },
      UpdateExpression: 'set name = :name, class = :class, address = :address, phoneNumber = :phoneNumber',
      ExpressionAttributeValues: {
        ':name': props.name,
        ':class': props.class,
        ':address': props.address,
        ':phoneNumber': props.phoneNumber
      },
      ReturnValues: 'UPDATED_NEW'
    }

    return await ddbDocClient.send(new UpdateCommand(params));
  }catch(err){
    return Promise.reject(err);
  }
}

module.exports = {
  createData,
  getData,
  queryData,
  scanData,
  deleteData
}
