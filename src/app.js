import express from "express";

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("Server running on port localhost:" + port);
});
