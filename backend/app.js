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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(`${process.env.BACKEND_URL}/api/user`, userRoute);
app.use(`${process.env.BACKEND_URL}/api/task`, taskRoute);
app.use(`${process.env.BACKEND_URL}/api/chat`, chatRoute);
app.use(`${process.env.BACKEND_URL}/api/board`, boardRoute);
app.use(`${process.env.BACKEND_URL}/api/column`, columnRoute);
app.use(`${process.env.BACKEND_URL}/api/archive`, archiveRoute);
app.use(`${process.env.BACKEND_URL}/api/participant`, participantRoute);


const PORT = process.env.BACKEND_PORT;
app.listen(PORT, () => {
     console.log(`${PORT} is Listening!`);
})