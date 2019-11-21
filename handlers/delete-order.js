const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const rp = require("minimal-request-promise");

/* delete the order based on order id */
function deleteOrder(orderId) {
  return docClient
    .get({
      TableName: "pizza-orders",
      Key: {
        orderId
      }
    })
    .promise()
    .then(result => result.item)
    .then(item => {
      if (item.orderStatus !== "pending")
        throw new Error("Order status is not pending");

      return rp.delete(
        `https://some-like-it-hot.effortless-serverless.com/delivery/${orderId}`,
        {
          headers: {
            Authorization: "aunt-marias-pizzeria-1234567890",
            "Content-Type": "application/json"
          }
        }
      );
    })
    .then(() =>
      docClient.delete({
        TableName: "pizza-orders",
        Key: {
          orderId
        }
      })
    )
    .promise();
}

module.exports = deleteOrder;
