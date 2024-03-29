'use strict';

const { updateData } = require("../lib/ddb");

module.exports.handler = async(event) => {
  try{
    const body = JSON.parse(event.body);
    const result = await updateData(body);
    return{
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Successfully create data',
          success: true,
          result
        },
        null,
        2
      ),
    }
  }catch(err){
    return{
      statusCode: 400,
      body: JSON.stringify(
        {
          message: err,
          success: false
        },
        null,
        2
      ),
    };
  }
}