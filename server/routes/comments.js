const router = require("express").Router();

const { Comment } = require("../db/models");

// Your code here
router.get("/", async (req, res, next) => {
    const comments = await Comment.findAll({
        attributes: ["id", "content", "createdAt", "postId"],
        order: [["createdAt", "ASC"]],
    });

    return res.json({ comments });
});

router.post("/", async (req, res, next) => {
    const { userId, content, postId } = req.body;
    console.log(userId, content);
    const newComment = await Comment.create({
        userId,
        content,
        postId,
    });

    return res.json({ data: newComment });
});

router.put("/:commentId", async (req, res, next) => {
    const { content } = req.body;

    const editedComment = await Comment.findByPk(req.params.commentId);

    if (!editedComment) {
        const err = new Error("Comment not found");
        err.status = 400;
        return next(err);
    }

    editedComment.content = content;

    await editedComment.save();

    return res.json({ data: editedComment });
});

router.delete("/:commentId", async (req, res, next) => {
    const { commentId } = req.params;

    const doomedComment = await Comment.findByPk(commentId);

    if (!doomedComment) {
        const err = new Error("Comment not found");
        err.status = 400;
        return next(err);
    }

    await doomedComment.destroy();

    return res.json({
        message: "Successfully deleted comment",
    });
});

// Export class - DO NOT MODIFY
module.exports = router;
