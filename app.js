const dotenv = require("dotenv");
const { application } = require("express");
const express = require("express");
const cookiParser = require("cookie-parser");

const app = express();
dotenv.config({ path: "./config.env" });
const port = process.env.PORT;
require("./db/conn");
app.use(express.json());
app.use(cookiParser());
//const User = require("./model/userSchema");
app.use(require("./router/auth"));


//middleware
// const middleware = (req, res, next) => {
//   console.log("hello my midleware");
//  next();
// };
// app.get("/", (req, res) => {
//   res.send("<h1>hello world</h1>");
// });

// app.get("/about", middleware, (req, res) => {
//   console.log("hello about page");
//   res.send("<h1>hello about page</h1>");
// });
// app.get("/contact", (req, res) => {
//   //res.cookie("jwtoken","test")
//   res.send("<h1>hello contact world</h1>");
// });
app.get("/signin", (req, res) => {
  res.send("<h1>hello singin world</h1>");
});
app.get("/signup", (req, res) => {
  res.send("<h1>hello singup world</h1>");
});

app.listen(port, () => {
  console.log(`server is running at port no.${port}`);
});
