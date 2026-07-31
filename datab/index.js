const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs/promises");
const fsSync = require("fs");
const mongoose = require("mongoose");
const multer = require("multer");
const User = require("./models/read");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const uploadDirectory = path.join(__dirname, "public", "uploads");
fsSync.mkdirSync(uploadDirectory, { recursive: true });

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/datab")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error.message));

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`,
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    callback(null, file.mimetype.startsWith("image/"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/users", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).render("index", {
        error: "Please select an image file (maximum 5 MB).",
      });
    }

    await User.create({
      name: req.body.name,
      email: req.body.email,
      image: `/uploads/${req.file.filename}`,
    });
    res.redirect("/read");
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    next(error);
  }
});

app.get("/read", async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render("read", { users });
  } catch (error) {
    next(error);
  }
});

app.post("/users/:id/delete", async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user?.image) {
      const filename = path.basename(user.image);
      await fs
        .unlink(path.join(__dirname, "public", "uploads", filename))
        .catch(() => {});
    }
    res.redirect("/read");
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send("Something went wrong. Please try again.");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
