const {
    setupBefore,
    setupChai,
    removeTestDB,
    runSQLQuery,
    setupBeforeNoSeeds,
} = require("./utils/test-utils");
const chai = setupChai();
const expect = chai.expect;

describe("Comments Specs", async () => {
    let DB_TEST_FILE, models, server;

    before(
        async () =>
            ({ server, models, DB_TEST_FILE } = await setupBeforeNoSeeds(
                __filename
            ))
    );

    after(async () => await removeTestDB(DB_TEST_FILE));

    describe("Comment model has the correct constraints", async () => {
        let testCommentObj;

        beforeEach(() => {
            testCommentObj = {
                userId: 1,
                postId: 2,
                content: "Testing comments",
            };
        });

        afterEach(() => {
            testCommentObj = {
                userId: 1,
                postId: 2,
                content: "Testing comments",
            };
        });

        describe("userId column constraints", () => {
            it("The userId cannot be null", async () => {
                testCommentObj.userId = null;
                await expect(models.Comment.build(testCommentObj).validate()).to
                    .be.rejected;
            });
        });

        describe("postId column constraints", () => {
            it("The postId cannot be null", async () => {
                testCommentObj.postId = null;
                await expect(models.Comment.build(testCommentObj).validate()).to
                    .be.rejected;
            });
        });

        describe("content column constraints", () => {
            it("The content cannot be null", async () => {
                testCommentObj.content = null;
                await expect(models.Comment.build(testCommentObj).validate()).to
                    .be.rejected;
            });

            it("The content has a max character limit of 255 characters", async () => {
                testCommentObj.content = "";

                for (let i = 0; i < 256; i++) {
                    testCommentObj.content += "a";
                }

                await expect(models.Comment.build(testCommentObj).validate()).to
                    .be.rejected;
            });

            it("The content cannot be an empty string / less than one character in length", async () => {
                testCommentObj.content = "";
                await expect(models.Comment.build(testCommentObj).validate()).to
                    .be.rejected;
            });
        });

        describe("A comment can be created with proper data input", () => {
            it("Comment created with proper data input", async () => {
                await expect(models.Comment.create(testCommentObj)).to.be
                    .fulfilled;

                const comments = await runSQLQuery(
                    "SELECT * FROM 'Comments';",
                    DB_TEST_FILE
                );

                expect(comments).to.have.lengthOf(1);
            });
        });
    });
});
