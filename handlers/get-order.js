const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

/* get the order */
function getOrder(orderId) {
  if (typeof orderId === "undefined")
    return docClient
      .scan({
        TableName: "pizza-orders"
      })
      .promise();

  return docClient
    .get({
      TableName: "pizza-orders",
      Key: {
        orderId
      }
    })
    .promise()
    .then(result => result.Item);
}

module.exports = getOrder;
