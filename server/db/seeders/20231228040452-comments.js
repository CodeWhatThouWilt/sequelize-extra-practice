"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Comment } = require("../models");
const { Op } = require("sequelize");

const comments = [
    {
        userId: 1,
        postId: 2,
        content: "Welcome!",
    },
    {
        userId: 2,
        postId: 3,
        content: "For real though",
    },
    {
        userId: 3,
        postId: 1,
        content: "Uh. Hi?",
    },
];

module.exports = {
    async up(queryInterface, Sequelize) {
        await Comment.bulkCreate(comments);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Comments", {
            content: {
                [Op.in]: comments.map((comment) => comment.content),
            },
        });
    },
};
