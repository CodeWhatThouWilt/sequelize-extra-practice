const router = require("express").Router();

const { User } = require("../db/models");

router.get("/", async (req, res, next) => {
    const users = await User.findAll();

    return res.json(users);
});

router.get("/:userId", async (req, res, next) => {
    const { userId } = req.params;
});

// Export class - DO NOT MODIFY
module.exports = router;
