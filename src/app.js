import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views",path.resolve("src", "views"));

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
