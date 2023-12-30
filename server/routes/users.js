const router = require("express").Router();

// your code here
const { User } = require("../db/models");

router.get("/", async (req, res, next) => {
    const users = await User.findAll({
        attributes: ["id", "username", "email"],
        order: [["username", "ASC"]],
    });

    return res.json({ users });
});

router.get("/:userId", async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
        attributes: ["id", "username", "email", "bio"],
    });

    if (!user) {
        const err = new Error("User not found");
        err.status = 400;
        return next(err);
    }

    return res.json({
        details: user,
    });
});

// Export class - DO NOT MODIFY
module.exports = router;
