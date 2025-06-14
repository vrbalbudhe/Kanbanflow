require("dotenv").config();
const path = require("path");
const express = require("express")
const app = express();
const cors = require("cors");
const corsOptions = {
     origin: process.env.FRONTEND_URL || "https://kanbanflow-x5ct.onrender.com",
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/user", userRoute);
app.use("/api/task", taskRoute);
app.use("/api/chat", chatRoute);
app.use("/api/board", boardRoute);
app.use("/api/column", columnRoute);
app.use("/api/archive", archiveRoute);
app.use("/api/participant", participantRoute);


const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, () => {
     console.log(`${PORT} is Listening!`);
})