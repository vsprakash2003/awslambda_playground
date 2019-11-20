const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

/* update the delivery status. This is the webhook API supplied in create-order */
module.exports = function updateDeliveryStatus(request) {
  if (!request.deliveryId || !request.status)
    throw new Error("Status and delivery id are required");

  return docClient
    .update({
      TableName: "pizza-orders",
      Key: {
        orderId: request.deliveryId
      },
      AttributeUpdates: {
        deliveryStatus: {
          Action: "PUT",
          Value: request.status
        }
      }
    })
    .promise()
    .then(() => ({}));
};
