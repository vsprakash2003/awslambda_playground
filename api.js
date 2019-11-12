"use strict";

const Api = require("claudia-api-builder");
const api = new Api();

const getOrder = require("./handlers/get-order");
const createOrder = require("./handlers/create-order");
const updateOrder = require("./handlers/update-order");
const deleteOrder = require("./handlers/delete-order");

/* handle generic route */
api.get("/", () => "Welcome to Pizza API");

/* handle pizza route. user can or need not supply pizza id */
api.get("/pizzas", () => getOrder());

api.get("/pizzas/{id}", request => getOrder(request.pathParams.id), {
  error: 404
});

/* handle order creation request */
api.post("/orders", request => createOrder(request.body), {
  success: 201,
  error: 400
});

/* handle order update request */
api.put(
  "/orders/{id}",
  request => updateOrder(request.pathParams.id, request.body),
  {
    error: 400
  }
);

api.delete("/orders/{id}", request => deleteOrder(request.pathParams.id), {
  error: 400
});

module.exports = api;
