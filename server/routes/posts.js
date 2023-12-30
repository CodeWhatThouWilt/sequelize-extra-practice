const router = require("express").Router();

const { Post } = require("../db/models");

router.get("/", async (req, res) => {
    const posts = await Post.findAll({
        attributes: ["id", "content", "createdAt"],
        order: [["createdAt", "ASC"]],
    });

    return res.json({ posts });
});

router.post("/", async (req, res) => {
    const { userId, content } = req.body;

    const newPost = await Post.create({
        userId,
        content,
    });

    return res.json({
        data: newPost,
    });
});

// Export class - DO NOT MODIFY
module.exports = router;
