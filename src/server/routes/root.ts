import express from "express";

const router = express.Router();

router.get("/", (_request, response) => {
  response.send(
    `<html><head><link rel="stylesheet" href="/css/root.css" /></head><body><h1>Hello, World!</h1></body></html>`
  );
});

export default router;
