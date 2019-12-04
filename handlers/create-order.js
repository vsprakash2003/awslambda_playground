const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));
const docClient = new AWS.DynamoDB.DocumentClient();
const rp = require("minimal-request-promise");

/* check if the order has relevant details supplied, if not throw error */
function createOrder(request) {
  console.log("Save an order", request.body);
  const userData = request.context.authorizer.claims;
  console.log("User data", userData);

  let userAddress = request.body && request.body.address;
  if (!userAddress) {
    userAddress = JSON.parse(userData.address).formatted;
  }

  if (!request.deliveryId || !request.status)
    throw new Error("Status and delivery ID are required");

  if (!request || !request.pizzaId || !request.address)
    throw new Error(
      "To order pizza please provide pizza type and address where pizza should be delivered"
    );

  return rp
    .post("https://some-like-it-hot.effortless-serverless.com/delivery", {
      headers: {
        Authorization: "aunt-marias-pizzeria-1234567890",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pickupTime: "15.34pm",
        pickupAddress: "Aunt Maria Pizzeria",
        deliveryAddress: userAddress,
        webhookUrl:
          "https://vi8yeybnz0.execute-api.us-east-2.amazonaws.com/latest/delivery"
      })
    })
    .then(rawResponse => JSON.parse(rawResponse.body))
    .then(response =>
      docClient
        .put({
          TableName: "pizza-orders",
          Item: {
            orderId: response.deliveryId,
            pizza: request.pizza,
            address: userAddress,
            orderStatus: "pending"
          }
        })
        .promise()
    )
    .then(res => {
      console.log("Order is saved!", res);
      return res;
    })
    .catch(saveErr => {
      console.log(`Oops, order is not saved :(`, saveErr);
      throw saveErr;
    });
}

module.exports = createOrder;
