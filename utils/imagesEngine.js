import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `${__dirname}/../images/`);
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split("/")[1];
            cb(null, `${Date.now()}.${extension}`);
        },
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true);
        } else {
            cb(new Error("Invalid image format."));
        }
    },
};

const upload = multer(multerConfig).single("image");

export function imageUpload(req, res, next) {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.status(500).json("Error: Couldn't upload the file.");
        }
        return next();
    });
}
