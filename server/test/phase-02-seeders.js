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

describe("Post seeders", () => {
    let DB_TEST_FILE, models, server, seedFile;

    before(async () => {
        ({ server, models, DB_TEST_FILE } = await setupBeforeNoSeeds(
            __filename
        ));
        seedFile = findSpecificSeederFile("posts.js");
    });

    after(async () => await removeTestDB(DB_TEST_FILE));

    it("commits posts seeder file successfully", async () => {
        await expect(
            seedDBFile(seedFile, DB_TEST_FILE)
        ).to.not.eventually.be.rejectedWith(Error);
    });

    it("Has at least 3 entries in the Posts table after committing Posts seeder file", async () => {
        const posts = await runSQLQuery("SELECT * FROM 'Posts'", DB_TEST_FILE);

        expect(posts).to.have.lengthOf(3);

        const expectedPosts = [
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

        expectedPosts.forEach((expectedPost) => {
            const post = posts.find((p) => p.userId === expectedPost.userId);
            expect(post).to.not.be.undefined;
            expect(post.content).to.equal(expectedPost.content);
        });
    });

    it("has a down function that deletes ONLY the three posts created in the up function", async () => {
        await runSQL(
            `INSERT INTO 'Posts' (userId, content) 
            VALUES 
                (1, 'testing posts')`,
            DB_TEST_FILE
        );

        await expect(
            undoAllSeeds(DB_TEST_FILE)
        ).to.not.eventually.be.rejectedWith(Error);

        const posts = await runSQLQuery(
            "SELECT * FROM 'Posts' WHERE content IN ('Hello World', 'My first post!', 'Cool app!')",
            DB_TEST_FILE
        );

        expect(posts).to.have.lengthOf(0);

        const allPosts = await runSQLQuery(
            "SELECT * FROM 'Posts'",
            DB_TEST_FILE
        );

        expect(allPosts).to.have.lengthOf(1);
    });
});
