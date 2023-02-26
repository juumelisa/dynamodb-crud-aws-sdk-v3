
'use strict';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
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

module.exports = {
  createData
}
