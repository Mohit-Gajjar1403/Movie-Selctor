const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/movies", require("./routes/movies"));
app.use("/reviews", require("./routes/reviews"));
app.use("/users", require("./routes/users"));
app.use("/watchlists", require("./routes/watchlists"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => console.log(err));
