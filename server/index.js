const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const uploadRouter = require("./routes/fileUpload");
const onBoardingRouter = require("./routes/onboarding");
const imageRouter = require("./routes/image");
const adminRouter = require("./routes/admin");
const partnerRouter = require("./routes/partner");

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (change for production)
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: ["http://localhost:3000", "https://amena.ae"], // Change this to your frontend URL
    credentials: true, // ✅ Allows cookies to be sent
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use("/public", express.static("public"));

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Disallow: /`);
});

app.use("/api", uploadRouter);
app.use("/api/partner", onBoardingRouter);
app.use("/api", imageRouter);
app.use("/api/admin", adminRouter);
app.use("/api/v1/partner", partnerRouter);

mongoose.connect(
  "mongodb+srv://rehankhan:B7uzwg8DlkIUJ9xb@cluster0.yimbm.mongodb.net/blinx?retryWrites=true&w=majority"
);

// Store connected clients
let shopSockets = {};
let adminSocket = null;

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("registerShop", (shopId) => {
    shopSockets[shopId] = socket;
    console.log(`Shop registered: ${shopId}`);
  });

  socket.on("registerAdmin", () => {
    adminSocket = socket;
    console.log("Admin registered");
  });

  socket.on("newOrder", (order) => {
    console.log("New Order Received:", order);

    // Send order to shop
    if (shopSockets[order.shopId]) {
      shopSockets[order.shopId].emit("orderReceived", order);
    }

    // Send order to admin
    if (adminSocket) {
      adminSocket.emit("orderReceived", order);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    Object.keys(shopSockets).forEach((shopId) => {
      if (shopSockets[shopId] === socket) {
        delete shopSockets[shopId];
      }
    });
    if (adminSocket === socket) adminSocket = null;
  });
});

server.listen(4000, function () {
  console.log("Connection established at 4000");
});
