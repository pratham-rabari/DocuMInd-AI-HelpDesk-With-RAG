import { open } from "node:fs/promises";
import type { Request, Response } from "express";
import { uploadDirectory } from "../multer.js";
import path from "node:path";

export const getPdfById = async (req: Request, res: Response) => {
    const pdfId = req.params.pdfId;

    // check the id is in correct format or not;
    if (typeof pdfId !== "string" || !/^[a-f\d]{32}$/i.test(pdfId)) {
        return res.status(400).json({ message: "Invalid PDF ID." });
    }

    // create fulll pdf path
    const filePath = path.join(uploadDirectory, pdfId);
    let isPdf = false;

    try {
        const fileHandle = await open(filePath, "r");
        try {
            const signature = Buffer.alloc(5);
            const { bytesRead } = await fileHandle.read(signature, 0, signature.length, 0);
            isPdf = bytesRead === signature.length && signature.toString("ascii") === "%PDF-";
        } finally {
            await fileHandle.close();
        }
    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error.code === "ENOENT" || error.code === "ENOTDIR")
        ) {
            return res.status(404).json({ message: "PDF not found." });
        }

        console.error("Failed to open PDF:", error);
        return res.status(500).json({ message: "Failed to open PDF." });
    }

    if (!isPdf) {
        return res.status(415).json({ message: "The requested file is not a PDF." });
    }

    return res.sendFile(
        filePath,
        {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${pdfId}.pdf"`,
                "X-Content-Type-Options": "nosniff",
            },
        },
        (error) => {
            if (!error) {
                return;
            }

            console.error("Failed to send PDF:", error);
            if (res.headersSent) {
                res.destroy(error);
                return;
            }

            res.status(500).json({ message: "Failed to send PDF." });
        },
    );
};
