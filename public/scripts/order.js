export async function addOrderToDb(cart) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: cart[0].user_id,
        status: "NOT_PAID",
        order_on: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to place order");
    }

    const orderData = await response.json();
    const orderId = orderData.id;

    cart.forEach(async (item) => {
      await fetch("/api/order-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          consumable_id: item.consumable_id,
          quantity: item.quantity,
          price: item.price,
        }),
      });
    });
  } catch (error) {
    console.error("Error placing order:", error);
  }

  return orderId
}
