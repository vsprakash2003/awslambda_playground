function updateOrder(id, updates) {
  if (!id || !updates)
    throw new Error(
      "Order id and updates object are required for updating the order"
    );
  return { message: `Order ${id} was successfully created` };
}

module.exports = updateOrder;
