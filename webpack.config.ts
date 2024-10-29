import dotenv from "dotenv";
import path from "path";
import webpack from "webpack";

dotenv.config();

const config: webpack.Configuration = {
  entry: {
    main: path.join(process.cwd(), "src", "client", "main.ts"),
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  output: {
    path: path.join(process.cwd(), "src", "public", "js"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;
