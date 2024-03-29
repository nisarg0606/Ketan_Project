const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));
// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/ketan", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());

// Use user routes
app.use("/users", userRoutes);
// Use file routes
app.use("/files", fileRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}`));
