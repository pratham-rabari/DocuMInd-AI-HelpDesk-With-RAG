import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

export const uploadDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "uploads",
);

export const upload = multer({
    dest: uploadDirectory,

    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },

    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error("Only PDF, DOCX, and TXT files are allowed"));
        }

        cb(null, true);
    },
});