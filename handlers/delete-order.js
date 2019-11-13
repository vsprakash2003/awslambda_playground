const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

/* delete the order based on order id */
function deleteOrder(orderId) {
  return docClient
    .delete({
      TableName: "pizza-orders",
      Key: {
        orderId
      }
    })
    .promise()
    .then(res => {
      console.log("Order is deleted!", res);
      return res;
    })
    .catch(deleteError => {
      console.log(`Oops, order is not deleted :(`, deleteError);
      throw deleteError;
    });
}

module.exports = deleteOrder;
