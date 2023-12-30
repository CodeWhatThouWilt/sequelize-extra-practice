"use strict";

/** @type {import('sequelize-cli').Migration} */

const { User } = require("../models");
const { Op } = require("sequelize");

const users = [
    {
        username: "demo",
        email: "demo@test.io",
        hashedPassword: "password",
        bio: "Just a demo account",
    },
    {
        username: "tester",
        email: "test@test.io",
        hashedPassword: "password123",
        bio: "Test account",
    },
    {
        username: "dev",
        email: "dev@test.io",
        hashedPassword: "securePassword",
        bio: "Ayyyye dev time",
    },
];

module.exports = {
    async up(queryInterface, Sequelize) {
        await User.bulkCreate(users);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Users", {
            username: {
                [Op.in]: users.map((user) => user.username),
            },
        });
    },
};
