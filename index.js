const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid'); // Import UUID for generating unique IDs
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Temporary database
let posts = [
    { id: uuidv4(), username: "Aditya", content: "I love Coding" },
    { id: uuidv4(), username: "Shardha", content: "I love Cooking" },
];

app.get("/posts", (req, res) => {
    res.render("index", { posts });
});

app.get("/posts/new", (req, res) => {
    res.render("new");
});

app.post("/posts", (req, res) => {
    const { username, content } = req.body;
    const id = uuidv4(); // Generate a unique ID for the new post
    posts.push({ id, username, content });
    res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find(p => p.id === id);
    if (post) {
        res.render("edit", { post });
    } else {
        res.status(404).send("Post not found");
    }
});

app.patch("/posts/:id", (req, res) => { // Change the route to match the form action
    const { id } = req.params;
    const { content } = req.body;
    let post = posts.find(p => p.id === id);
    if (post) {
        post.content = content;
        res.redirect(`/posts/${id}`);
    } else {
        res.status(404).send("Post not found");
    }
});

app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    posts = posts.filter(p => p.id !== id);
    res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === id);
    if (post) {
        res.render("show", { post });
    } else {
        res.status(404).send("Post not found");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
