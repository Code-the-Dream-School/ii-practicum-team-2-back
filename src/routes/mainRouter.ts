import express from "express";
import * as mainController from "@/controllers/mainController";

const router = express.Router();

router.get("/", mainController.get);

router.post("/", mainController.post);

export default router;
