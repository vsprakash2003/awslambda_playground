const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");

/* check if the order has relevant details supplied, if not throw error */
function createOrder(request) {
  if (!request || !request.pizzaId || !request.address)
    throw new Error(
      "You must provide either an order id or an address associated with the order"
    );
  return docClient
    .put({
      TableName: "pizza-orders",
      Item: {
        orderId: uuid(),
        pizza: request.pizza,
        address: request.address,
        orderStatus: "pending"
      }
    })
    .promise()
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
