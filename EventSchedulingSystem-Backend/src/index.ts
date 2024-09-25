import express from "express";

const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(
    `<h2 style="text-align: center; padding-top: 2rem; color: #37cdbe;">EventSchedulingSystem</h2>`
  );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
