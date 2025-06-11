import Order from "../models/Order.js";
import User from "../models/User.js";
import Consumable from "../models/Consumable.js";
import ExcelJS from "exceljs";

export default async function ExportController(req, res) {
  const { type } = req.query;

  let data = [];

  switch (type) {
    case "orders":
      data = await Order.query()
        .withGraphFetched("user")
        .withGraphFetched("orderItems.consumable");
      break;
    case "users":
      data = await User.query();
      break;
    case "consumables":
      data = await Consumable.query();
      break;
    default:
      return res.status(400).json({ error: "Invalid export type" });
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(type.charAt(0).toUpperCase() + type.slice(1));
  const headers = Object.keys(data[0] || {});
  worksheet.columns = headers.map(header => ({ header, key: header, width: 20 }));
  data.forEach(item => {
    const row = {};
    headers.forEach(header => {
      row[header] = item[header];
    });
    worksheet.addRow(row);
  });
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename=${type}.xlsx`);
  await workbook.xlsx.write(res);
  res.end();
  res.status(200).end();
}
