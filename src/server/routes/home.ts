import express from "express";

const router = express.Router();

router.get("/", (_request, response) => {
  response.render("home", { title: "Home Page" });
});

export default router;
