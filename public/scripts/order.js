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
        method: "UNKOWN",
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
    return orderId;
  } catch (error) {
    console.error("Error placing order:", error);
  }
}

export async function addToExistingOrder(cart) {
  const userId = cart[0].user_id;
  try {
    const response = await fetch(`/api/orders/${userId}/status/NOT_PAID`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      await addOrderToDb(cart);
      return;
    }

    const orderData = await response.json();

    const orderId = orderData[0].id;

    const existingItemsResponse = await fetch(
      `/api/order-items/order/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let existingItems = [];
    if (existingItemsResponse.ok) {
      existingItems = await existingItemsResponse.json();
    }

    for (const item of cart) {
      const existingItem = existingItems.find(
        (existing) => existing.consumable_id === item.consumable_id
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity;
        const newPrice = existingItem.price + item.price;

        await fetch(`/api/order-items/${existingItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: newQuantity,
            price: newPrice,
          }),
        });
      } else {
        await fetch("/api/order-items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            consumable_id: item.consumable_id,
            quantity: item.quantity,
            price: item.price,
          }),
        });
      }
    }

    return orderId;
  } catch (err) {
    console.error("Error adding to existing order:", err);
    throw err;
  }
}
