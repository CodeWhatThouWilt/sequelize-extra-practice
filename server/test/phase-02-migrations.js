const {
    setupBefore,
    setupChai,
    removeTestDB,
    runSQLQuery,
    setupBeforeNoSeeds,
} = require("./utils/test-utils");
const chai = setupChai();
const expect = chai.expect;

describe("Phase 2 Migrations - Post Specs", async () => {
    let DB_TEST_FILE, models, server;

    before(
        async () =>
            ({ server, models, DB_TEST_FILE } = await setupBeforeNoSeeds(
                __filename
            ))
    );

    after(async () => await removeTestDB(DB_TEST_FILE));

    describe("User models has the correct constraints", async () => {
        let testPostObj;

        beforeEach(() => {
            testPostObj = {
                userId: 1,
                content: "Testing posts",
            };
        });

        afterEach(() => {
            testPostObj = {
                userId: 1,
                content: "Testing posts",
            };
        });

        describe("userId column constraints", () => {
            it("The userId cannot be null", async () => {
                testPostObj.userId = null;
                await expect(models.Post.build(testPostObj).validate()).to.be
                    .rejected;
            });
        });

        describe("content column constraints", () => {
            it("The content cannot be null", async () => {
                testPostObj.content = null;
                await expect(models.Post.build(testPostObj).validate()).to.be
                    .rejected;
            });

            it("The content has a max character limit of 255 characters", async () => {
                testPostObj.content = "";

                for (let i = 0; i < 256; i++) {
                    testPostObj.content += "a";
                }

                await expect(models.Post.build(testPostObj).validate()).to.be
                    .rejected;
            });

            it("The content cannot be an empty string / less than one character in length", async () => {
                testPostObj.content = "";
                await expect(models.Post.build(testPostObj).validate()).to.be
                    .rejected;
            });
        });

        describe("A post can be created with proper data input", () => {
            it("Post created with proper data input", async () => {
                await expect(models.Post.create(testPostObj)).to.be.fulfilled;

                const posts = await runSQLQuery(
                    "SELECT * FROM 'Posts';",
                    DB_TEST_FILE
                );

                expect(posts).to.have.lengthOf(1);
            });
        });
    });
});
