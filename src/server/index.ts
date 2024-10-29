import connectLiveReload from "connect-livereload";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import httpErrors from "http-errors";
import livereload from "livereload";
import morgan from "morgan";
import * as path from "path";

dotenv.config();

import rootRoutes from "./routes/root";
import testRoutes from "./routes/test";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const staticPath = path.join(process.cwd(), "src", "public");
app.use(express.static(staticPath));

if (process.env.NODE_ENV === "development") {
  const reloadServer = livereload.createServer();

  reloadServer.watch(staticPath);
  app.use(connectLiveReload());
}

app.use(cookieParser());
app.set("views", path.join(process.cwd(), "src", "server", "views"));
app.set("view engine", "ejs");

app.use("/", rootRoutes);
app.use("/test", testRoutes);

app.use((_request, _response, next) => {
  next(httpErrors(404));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
