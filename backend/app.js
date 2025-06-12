const path = require("path");
const express = require("express")
const app = express();
const cors = require("cors");
const corsOptions = {
     origin: process.env.FRONTEND_URL || "http://localhost:5173",
     credentials: true
};

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const chatRoute = require("./routes/chatRT");
const taskRoute = require("./routes/taskRT");
const userRoute = require("./routes/userRT");
const boardRoute = require("./routes/boardRT");
const columnRoute = require("./routes/columnRT");
const archiveRoute = require("./routes/archiveRT");
const participantRoute = require("./routes/participantsRT");

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public", "dist")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("*", (req, res) => {
     res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
});

console.log("1");
app.use("/api/user", userRoute);
console.log("2");
app.use("/api/task", taskRoute);
console.log("3");
app.use("/api/chat", chatRoute);
console.log("4");
app.use("/api/board", boardRoute);
console.log("5");
app.use("/api/column", columnRoute);
console.log("6");
app.use("/api/archive", archiveRoute);
console.log("7");
app.use("/api/participant", participantRoute);
console.log("8");

const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, () => {
     console.log(`${PORT} is Listening!`);
})