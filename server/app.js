require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

// Users Router
const usersRouter = require("./routes/users.js");
app.use("/users", usersRouter);

// Posts Router
const postsRouter = require("./routes/posts.js");
app.use("/posts", postsRouter);

// Comments Router
const commentsRouter = require("./routes/comments.js");
app.use("/comments", commentsRouter);

// Root route. You can ping this to test if application is running correctly on the port in the .env
app.get("/", (req, res) => {
    res.json({
        message: "API server is running",
    });
});
// Set port and listen for incoming requests - DO NOT MODIFY
if (require.main === module) {
    const port = process.env.PORT;
    app.listen(port, () => console.log("Server is listening on port", port));
} else {
    module.exports = app;
}
