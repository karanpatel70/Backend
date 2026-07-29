const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs/promises");
const port = process.env.PORT || 3000;
const tasksDirectory = path.join(__dirname, "make files");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

function taskFileName(taskName) {
  return `${taskName
    .trim()
    .replace(/[^a-z0-9-_ ]/gi, "")
    .replace(/\s+/g, "-")
    .slice(0, 80)}.json`;
}

async function getTasks() {
  await fs.mkdir(tasksDirectory, { recursive: true });
  const files = await fs.readdir(tasksDirectory);
  const taskFiles = files.filter((file) => file.endsWith(".json"));

  return Promise.all(
    taskFiles.map(async (file) => {
      const contents = await fs.readFile(path.join(tasksDirectory, file), "utf8");
      return JSON.parse(contents);
    })
  );
}

app.get("/", async (req, res, next) => {
  try {
    res.render("index", { tasks: await getTasks() });
  } catch (error) {
    next(error);
  }
});

app.get("/tasks", async (req, res, next) => {
  try {
    res.json(await getTasks());
  } catch (error) {
    next(error);
  }
});

app.post("/tasks", async (req, res, next) => {
  const name = req.body.name?.trim();
  const task = req.body.task?.trim();

  if (!name || !task) {
    return res.status(400).send("Name and task are required.");
  }

  try {
    await fs.mkdir(tasksDirectory, { recursive: true });
    const taskData = { name, task, createdAt: new Date().toISOString() };
    const fileName = taskFileName(task);
    await fs.writeFile(
      path.join(tasksDirectory, fileName),
      JSON.stringify(taskData, null, 2),
      "utf8"
    );
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
