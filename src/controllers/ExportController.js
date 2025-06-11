import Order from "../models/Order.js";
import User from "../models/User.js";
import Consumable from "../models/Consumable.js";
import ExcelJS from "exceljs";

export default async function ExportController(req, res) {
  const { type } = req.query;

  let data = [];

  switch (type) {
    case "orders":
      const orders = await Order.query()
        .withGraphFetched("user")
        .withGraphFetched("orderItems.consumable");

        data = [];
      orders.forEach((item) => {
        item.orderItems.forEach((oi) => {
          data.push({
            id: item.id,
            gebruiker: item.user
              ? `${item.user.firstname} ${item.user.lastname}`
              : "Onbekend",
            status: item.status,
            methode: item.method,
            besteld: item.order_on,
            product: oi.consumable.name,
            aantal: oi.quantity,
            prijs: oi.price,
          });
        });
      });
      break;
    case "users":
      data = await User.query().select(
        "id",
        "firstname",
        "lastname",
        "email",
        "role_id",
        "receive_notifications"
      );
      break;
    case "consumables":
      data = await Consumable.query().withGraphFetched("category");
      data = data.map((item) => {
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          stock: item.stock,
          category: item.category ? item.category.name : "Geen categorie",
        };
      });
      break;
    default:
      return res.status(400).json({ error: "Invalid export type" });
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(
    type.charAt(0).toUpperCase() + type.slice(1)
  );
  const headers = Object.keys(data[0] || {});
  worksheet.columns = headers.map((header) => ({
    header,
    key: header,
    width: 20,
  }));
  data.forEach((item) => {
    const row = {};
    headers.forEach((header) => {
      row[header] = item[header];
    });
    worksheet.addRow(row);
  });
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename=${type}.xlsx`);
  await workbook.xlsx.write(res);
  res.end();
  res.status(200).end();
}
