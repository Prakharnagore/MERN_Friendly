const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const { readdirSync } = require("fs");
const { default: mongoose } = require("mongoose");
const PORT = process.env.PORT;

// middleware
app.use(cors());
app.use(express.json());

// good way of using routes ( save us from importing and then using again and again);
readdirSync("./routes").map((filename) =>
  app.use("/", require("./routes/" + filename))
);

// database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("database connect successfully"))
  .catch((err) => console.log("error connection", err));

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});

// const options = {
//   origin: "http://localhost:3000",
//   useSuccessStatus: 200,
// };
// or
// let allowed = ["http://localhost:4000", "some link"];
// function options(req, res) {
//   let temp;
//   let origin = req.header("Origin");
//   if (allowed.indexOf(origin) > -1) {
//     temp = {
//       origin: true,
//       optionSuccessStatus: 200,
//     };
//   } else {
//     temp = {
//       origin: "stupid",
//     };
//   }
//   res(null, temp);
// }
// app.use(cors(options));
