import express from "express";
import cors from "cors";
import { config } from "dotenv";
import router from "./routes/firestore-routes";

config();

const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT;

const app = express();

const corsOptions = {
	origin: FRONTEND_URL,
	methods: ["GET", "POST", "PUT"],
	credentials: true,
};

// app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
	console.log(`🚀 Server running at port: ${PORT}`);
});
