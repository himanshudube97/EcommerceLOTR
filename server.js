const app = require("./app");

const dotenv = require("dotenv");

const connectDatabase = require("./config/database");
//Config
dotenv.config({ path: "config/config.env" });

//connecting to database
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});
