import express from "express";

const router = express.Router();

router.get("/", (_request, response) => {
  response.render("root", { title: "Jrob's super site" });
});

export default router;
