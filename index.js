const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const database = require("./utils/database");
const consumeMessages_compression_result_queue = require("./utils/compression_result_consumer");
const cors = require("cors");
const port = process.env.PORT || 80;

app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const fileRoutes = require("./routes/fileRoutes");
app.use("/api/file", fileRoutes);

const downloadRoutes = require("./routes/downloadRoutes");
app.use("/", downloadRoutes);

database.on("error", console.error.bind(console, "connection error: "));
database.once("open", function () {
  console.log("Database Connected successfully");
});

app.listen(port, function () {
  console.log("App is running at port " + port);
});

consumeMessages_compression_result_queue();
