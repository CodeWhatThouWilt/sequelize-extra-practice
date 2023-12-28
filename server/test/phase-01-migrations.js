const {
    setupBefore,
    setupChai,
    removeTestDB,
    runSQLQuery,
    setupBeforeNoSeeds,
} = require("./utils/test-utils");
const chai = setupChai();
const expect = chai.expect;

describe("User Specs", async () => {
    let DB_TEST_FILE, models, server;

    before(
        async () =>
            ({ server, models, DB_TEST_FILE } = await setupBeforeNoSeeds(
                __filename
            ))
    );

    after(async () => await removeTestDB(DB_TEST_FILE));

    describe("User models has the correct constraints", async () => {
        let testUserObj;

        beforeEach(() => {
            testUserObj = {
                username: "testuser",
                email: "testuser@test.io",
                hashedPassword: "testpassword",
            };
        });

        afterEach(() => {
            testUserObj = {
                username: "testuser",
                email: "testuser@test.io",
                hashedPassword: "testpassword",
            };
        });

        describe("username column constraints", () => {
            it("The username has a max character limit of 24 characters", async () => {
                testUserObj.username = "aaaaaaaaaaaaaaaaaaaaaaaaa";
                await expect(models.User.build(testUserObj).validate()).to.be
                    .rejected;
            });

            it("The username cannot be an empty string / less than one character in length", async () => {
                testUserObj.username = "";
                await expect(models.User.build(testUserObj).validate()).to.be
                    .rejected;
            });

            it("The username cannot be null", async () => {
                testUserObj.username = null;
                await expect(models.User.build(testUserObj).validate()).to.be
                    .rejected;
            });

            it("The username cannot be a non-string value", async () => {
                testUserObj.username = [];
                await expect(models.User.build(testUserObj).validate()).to.be
                    .rejected;
            });

            it("The usernames must be unique", async () => {
                testUserObj.username = "testing";
                testUserObj.email = "legit@email.com";
                await expect(models.User.create(testUserObj)).to.be.fulfilled;

                testUserObj.email = "unique@test.io";
                await expect(models.User.create(testUserObj)).to.be.rejected;

                const users = await runSQLQuery(
                    "SELECT * FROM 'Users';",
                    DB_TEST_FILE
                );

                expect(users).to.have.lengthOf(1);
            });
        });

        describe("email column constraints", () => {
            it("The email has a max character limit of 255 characters", async () => {
                testUserObj.username = "";

                for (let i = 0; i < 256; i++) {
                    testUserObj.username += "a";
                }

                testUserObj.email += "@test.io";

                await expect(models.User.build(testUserObj).validate()).to.be
                    .rejected;
            });

            it("The email cannot be less than 6 characters in length", async () => {
                testUserObj.email = "a@a.i";

                await expect(models.User.build(testUserObj).validate()).to.be
                    .rejected;
            });

            it("The email cannot be an empty string / less than one character in length", async () => {
                testUserObj.email = "";
                await expect(models.User.build(testUserObj).validate()).to.be
                    .rejected;
            });

            it("The email cannot be null", async () => {
                testUserObj.email = null;
                await expect(models.User.build(testUserObj).validate()).to.be
                    .rejected;
            });

            it("The email must be an email string", async () => {
                testUserObj.email = "notanemail";
                await expect(models.User.build(testUserObj).validate()).to.be
                    .rejected;
            });

            it("The email must be unique", async () => {
                testUserObj.username = "testing2";
                testUserObj.email = "legit2@email.com";
                await expect(models.User.create(testUserObj)).to.be.fulfilled;

                testUserObj.username = "legitusername";
                await expect(models.User.create(testUserObj)).to.be.rejected;

                const users = await runSQLQuery(
                    "SELECT * FROM 'Users';",
                    DB_TEST_FILE
                );

                expect(users).to.have.lengthOf(2);
            });
        });

        describe("hashedPassword column constraints", () => {
            it("The hashedPassword cannot be null", async () => {
                testUserObj.hashedPassword = null;
                await expect(models.User.build(testUserObj).validate()).to.be
                    .rejected;
            });

            it("The hashedPassword cannot be an empty string / less than one character in length", async () => {
                testUserObj.hashedPassword = "";
                await expect(models.User.build(testUserObj).validate()).to.be
                    .rejected;
            });

            it("The email has a max character limit of 30 characters", async () => {
                testUserObj.hashedPassword = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

                await expect(models.User.build(testUserObj).validate()).to.be
                    .rejected;
            });

            it("The hashedPassword cannot be less than 8 characters in length", async () => {
                testUserObj.hashedPassword = "aaaaaaa";

                await expect(models.User.build(testUserObj).validate()).to.be
                    .rejected;
            });
        });

        describe("A user can be created with proper data input", () => {
            it("User created with proper data input", async () => {
                await expect(models.User.create(testUserObj)).to.be.fulfilled;

                const users = await runSQLQuery(
                    "SELECT * FROM 'Users';",
                    DB_TEST_FILE
                );

                expect(users).to.have.lengthOf(3);
            });
        });
    });
});
