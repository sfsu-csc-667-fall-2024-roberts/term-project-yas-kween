import express from "express";

const router = express.Router();

router.get("/register", (_request, response) => {
  response.render("auth/register", { title: "Auth: Register" });
});

router.get("/login", (_request, response) => {
  response.render("auth/login", { title: "Auth: Logout" });
});

router.get("/logout", (_request, response) => {
  response.send("Logout");
});

export default router;
