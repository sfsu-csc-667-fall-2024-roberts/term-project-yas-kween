import dotenv from "dotenv";
import express from "express";
import httpErrors from "http-errors";
import morgan from "morgan";
import * as path from "path";

import rootRoutes from "./routes/root";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));

app.use(express.static(path.join(process.cwd(), "src", "public")));

app.use("/", rootRoutes);

app.use((_request, _response, next) => {
  next(httpErrors(404));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
