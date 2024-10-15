import express from "express";

const router = express.Router();

router.get("/", (_request, response) => {
  response.send("Hello World (from root.js)");
});

router.get("/blarg", (_request, response) => {
  response.send("Hello World (from root.js) with blarg");
});

export default router;
