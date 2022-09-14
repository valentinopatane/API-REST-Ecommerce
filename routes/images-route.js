import { Router } from "express";
import { imageUpload } from "../utils/imagesEngine.js";

const router = Router();

router.post("/", imageUpload, (req, res) => {
    res.send(`localhost:8000/api/images/${req.file.filename}`);
});

export default router;
