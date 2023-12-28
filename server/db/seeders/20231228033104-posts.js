"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Post } = require("../models");
const { Op } = require("sequelize");

const posts = [
    {
        userId: 1,
        content: "Hello World",
    },
    {
        userId: 2,
        content: "My first post!",
    },
    {
        userId: 3,
        content: "Cool app!",
    },
];

module.exports = {
    async up(queryInterface, Sequelize) {
        await Post.bulkCreate(posts);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Posts", {
            content: {
                [Op.in]: posts.map((post) => post.content),
            },
        });
    },
};
