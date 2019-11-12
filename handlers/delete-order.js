function deleteOrder(id) {
  if (!id) throw new Error("Order id is required for deleting the order");
  return { message: `Order ${id} was successfully created` };
}

module.exports = deleteOrder;
