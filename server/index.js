import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import generalRoutes from "./routes/general.js";
import userRoutes from "./routes/user.js";
import offerRoutes from "./routes/offers.js";
import candidatureRoutes from "./routes/candidatures.js";
import conversationRoutes from "./routes/conversations.js";
import messageRoutes from "./routes/messages.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/general", generalRoutes);
app.use("/user", userRoutes);
app.use("/offers", offerRoutes);
app.use("/candidatures", candidatureRoutes);
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);

app.use("/", (req, res) => {
  res.send("Welcome to Enfeina't API");
});

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

let connectedClients = [];
let http;
let io;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    //app.listen(PORT, () => console.info(`Server running on port: ${PORT}`));
    http = createServer(app);
    io = new Server(http, {
      cors: {
        origin: "*",
      },
    });
    http.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });

    io.on("connection", (socket) => {
      //console.log("Client connected to the WebSocket");

      socket.on("logged-user", (data) => {
        //console.log(data.userId);
        connectedClients = connectedClients.filter((client) => client.userId !== data.userId);
        const connectedClient = {
          socketId: socket.id,
          userId: data.userId,
        };
        connectedClients.push(connectedClient);
        io.to(socket.id).emit("message", { message: "Registered correctly!" });
      });

      socket.on("disconnected", () => {
        connectedClients = connectedClients.filter((client) => client.socketId !== socket.id);
      });
    });
  })
  .catch((error) => console.error(error));

mongoose.set("useFindAndModify", false);

const sendMessageToUser = (data) => {
  const targetUser = connectedClients.find((client) => client.userId === data.userId);
  if (targetUser) {
    io.to(targetUser.socketId).emit("new-message", { conversationId: data.conversationId });
  }
};

export { io, connectedClients, sendMessageToUser };
