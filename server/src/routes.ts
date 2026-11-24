import express from "express";
import { addFilesToChroma } from "./controllers/fileController.js";
import { getPdfById } from "./controllers/pdfController.js";
import {upload} from "./multer.js"

const router = express.Router();

router.post("/add-file",upload.single("file"),addFilesToChroma);
router.get("/pdf/:pdfId", getPdfById);

export default router;