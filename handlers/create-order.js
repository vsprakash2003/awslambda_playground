const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const rp = require("minimal-request-promise");

/* check if the order has relevant details supplied, if not throw error */
function createOrder(request) {
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
        deliveryAddress: request.address,
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
            address: request.address,
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
