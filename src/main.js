import express from "express";
import config from "./config/index.js";
import { application } from "./app.js";

const app = express();
const PORT = config.PORT || 3000;

await application(app);

app.listen(PORT, () => console.log("Server running on port", PORT));
