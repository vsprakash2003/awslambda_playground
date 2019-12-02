"use strict";

const Api = require("claudia-api-builder");
const api = new Api();

const getOrder = require("./handlers/get-order");
const createOrder = require("./handlers/create-order");
const updateOrder = require("./handlers/update-order");
const deleteOrder = require("./handlers/delete-order");
const updateDeliveryStatus = require("./handlers/update-handler-status");

/* register authorizer for Cognito user pool authorization */
api.registerAuthorizer("userAuthentication", {
  providerARNs: [process.env.userPoolArn]
});

/* handle generic route */
api.get("/", () => "Welcome to Pizza API");

/* handle pizza route. user can or need not supply pizza id */
api.get("/pizzas", () => getOrder());

api.get("/pizzas/{id}", request => getOrder(request.pathParams.id), {
  error: 404
});

/* handle order creation request */
api.post("/orders", request => createOrder(request), {
  success: 201,
  error: 400,
  cognitoAuthorizer: "userAuthentication"
});

/* handle order update request */
api.put(
  "/orders/{id}",
  request => updateOrder(request.pathParams.id, request.body),
  {
    error: 400,
    cognitoAuthorizer: "userAuthentication"
  }
);

/* handle delete order request */
api.delete("/orders/{id}", request => deleteOrder(request.pathParams.id), {
  error: 400,
  cognitoAuthorizer: "userAuthentication"
});

/* handle webhook API to update delivery status */
api.delete("/delivery", request => updateDeliveryStatus(request.body), {
  success: 200,
  error: 400,
  cognitoAuthorizer: "userAuthentication"
});

module.exports = api;
