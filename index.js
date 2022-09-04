const express = require("express");
const app = express();
const helloRouter = require("./api/routeHandler");
const port = 9090;

app.use("/api", helloRouter); //Request will hit this first and then match with one of carts router

app.listen(port, () => {
  console.log(`Server is booming on port 5000
  Visit http://localhost:9090`);
});
