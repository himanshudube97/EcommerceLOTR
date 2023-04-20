const app = require("./app");

const dotenv = require("dotenv");

const connectDatabase = require("./config/database");

//Handling Uncaught Exception  (ye sabse upar rhega code main, wrna kaam nahi karega.);
 process.on("uncaughtException", (err)=>{
  console.log(`Error: ${err.message}`)
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
 })

//Config
dotenv.config({ path: "config/config.env" });


//connecting to database
connectDatabase();

let server = app.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});




//Unhandled promise rejection-  jaise mongodb ke link main mongo likha tha to error aagya tha.
// connectDatabase main we have user .then() and .catch(), we have to remove .catch() because with .catch() its not unhandled promise rejection.
// UPR ka matlab hai kahi promise reject ho rha hai but we are not able to catch that, humne .catch() use nahi kiya hai.

process.on("unhandledRejection", (err)=>{
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(()=>{
    process.exit(1);
  })
})


// console.log(youtube);  // this is an uncaught error, we need to fix this error too.
