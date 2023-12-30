const {
    setupBeforeNoSeeds,
    setupChai,
    removeTestDB,
    getAllSeederFiles,
    seedDBFile,
    runSQLQuery,
    findSpecificSeederFile,
} = require("./utils/test-utils");
const chai = setupChai();
const expect = chai.expect;

describe("Phase 5 - Posts Routes", () => {
    let DB_TEST_FILE, models, server;
    before(async () => {
        ({ server, models, DB_TEST_FILE } = await setupBeforeNoSeeds(
            __filename
        ));
        const posts = findSpecificSeederFile("posts.js");
        await seedDBFile(posts, DB_TEST_FILE);
    });
    after(async () => await removeTestDB(DB_TEST_FILE));

    describe("GET /posts", () => {
        let postResponse;

        it("successfully makes a request to GET /posts", async () => {
            postResponse = await chai.request(server).get("/posts");

            expect(postResponse).to.not.be.null;
            expect(postResponse).to.have.status(200);
        });

        it("returns JSON response of posts with id, content and createdAt attributes", async () => {
            expect(postResponse).to.be.json;
            expect(postResponse.body).to.be.a("object");
            expect(postResponse.body.posts).to.be.a("array");
            expect(postResponse.body.posts.length).to.eq(3);

            postResponse.body.posts.forEach((post) => {
                expect(post).to.be.an("object");
                expect(post).to.have.own.property("id");
                expect(post).to.have.own.property("content");
                expect(post).to.have.own.property("createdAt");
                expect(post).to.not.have.own.property("userId");
                expect(post).to.not.have.own.property("updatedAt");
            });
        });

        it("returns posts in the correct order (createdAt ascending)", async () => {
            const posts = postResponse.body.posts;

            expect(posts[0].content).to.equal("Hello World");
            expect(posts[1].content).to.equal("My first post!");
            expect(posts[2].content).to.equal("Cool app!");
        });
    });

    describe("POST /posts", () => {
        describe("Valid Requests", () => {
            let newPostResponse;
            let newPostBody;

            it("successfully makes a post request to /posts", async () => {
                const reqBody = {
                    userId: 1,
                    content: "This is a new post!",
                };

                newPostResponse = await chai
                    .request(server)
                    .post("/posts")
                    .send(reqBody);

                expect(newPostResponse).to.not.be.null;
                expect(newPostResponse.status).to.be.within(200, 201);
                expect(newPostResponse).to.be.json;
            });

            it("returns JSON response with new post attributes", async () => {
                newPostBody = newPostResponse.body;

                expect(newPostBody).to.be.an("object");
                expect(newPostBody).to.have.own.property("data");
                expect(newPostBody.data).to.be.an("object");
            });

            it("returns the correct new post data", async () => {
                expect(newPostBody.data).to.have.own.property("id");
                expect(newPostBody.data.id).to.equal(4);
                expect(newPostBody.data).to.have.own.property("userId");
                expect(newPostBody.data.userId).to.equal(1);
                expect(newPostBody.data).to.have.own.property("content");
                expect(newPostBody.data.content).to.equal(
                    "This is a new post!"
                );
                expect(newPostBody.data).to.have.own.property("createdAt");
                expect(newPostBody.data).to.have.own.property("updatedAt");
            });

            it("new post was added to the database", async () => {
                const sqlResponse = await runSQLQuery(
                    "SELECT * FROM Posts WHERE content = 'This is a new post!';",
                    DB_TEST_FILE
                );
                expect(sqlResponse).to.be.an("array");
                expect(sqlResponse).to.have.length(1);
                expect(sqlResponse[0].id).to.equal(4);
            });
        });
    });
});
