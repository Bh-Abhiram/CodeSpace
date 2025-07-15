const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const taskController = require("../controllers/taskController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  }
});

router.post("/submit", upload.single("file"), taskController.submitSolution);
router.get("/submissions/:user", taskController.getSubmissions);

module.exports = router;
