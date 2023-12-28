const {
    setupBefore,
    setupChai,
    removeTestDB,
    seedDBFile,
    undoAllSeeds,
    runSQL,
    runSQLQuery,
    getAllSeederFiles,
    findSpecificSeederFile,
    setupBeforeNoSeeds,
} = require("./utils/test-utils");
const chai = setupChai();
const expect = chai.expect;

describe("Comment seeders", () => {
    let DB_TEST_FILE, models, server, seedFile;

    before(async () => {
        ({ server, models, DB_TEST_FILE } = await setupBeforeNoSeeds(
            __filename
        ));
        seedFile = findSpecificSeederFile("comments.js");
    });

    after(async () => await removeTestDB(DB_TEST_FILE));

    it("commits comments seeder file successfully", async () => {
        await expect(
            seedDBFile(seedFile, DB_TEST_FILE)
        ).to.not.eventually.be.rejectedWith(Error);
    });

    it("Has at least 3 entries in the Comments table after committing comments seeder file", async () => {
        const comments = await runSQLQuery(
            "SELECT * FROM 'Comments'",
            DB_TEST_FILE
        );

        expect(comments).to.have.lengthOf(3);

        const expectedComments = [
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

        expectedComments.forEach((expectedComment) => {
            const comment = comments.find(
                (c) => c.userId === expectedComment.userId
            );
            expect(comment).to.not.be.undefined;
            expect(comment.postId).to.equal(expectedComment.postId);
            expect(comment.content).to.equal(expectedComment.content);
        });
    });

    it("has a down function that deletes ONLY the three comments created in the up function", async () => {
        await runSQL(
            `INSERT INTO 'Comments' (userId, postId, content) 
            VALUES 
                (1, 2, 'testing comments')`,
            DB_TEST_FILE
        );

        await expect(
            undoAllSeeds(DB_TEST_FILE)
        ).to.not.eventually.be.rejectedWith(Error);

        const comments = await runSQLQuery(
            "SELECT * FROM 'Comments' WHERE content IN ('Welcome!', 'For real though', 'Uh. Hi?')",
            DB_TEST_FILE
        );

        expect(comments).to.have.lengthOf(0);

        const allComments = await runSQLQuery(
            "SELECT * FROM 'Comments'",
            DB_TEST_FILE
        );

        expect(allComments).to.have.lengthOf(1);
    });
});
