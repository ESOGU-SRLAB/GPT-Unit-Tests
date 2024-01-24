const express = require("express");
const cors = require("cors"); // Require the cors package
const routes = require("./routes/api/api");

const app = express();

app.use(cors()); // Enable CORS for all requests
app.use(express.json());

app.use("/", routes);

app.listen(process.env['PORT'], () => {
    console.log('Server is listening');
});
