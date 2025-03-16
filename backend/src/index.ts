import express from "express";

export const app = express();
app.disable("x-powered-by");
const port = process.env.PORT || 3000;

app.get("/api", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
