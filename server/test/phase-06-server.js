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

describe("Phase 6 - Comments Routes", () => {
    let DB_TEST_FILE, models, server;
    before(async () => {
        ({ server, models, DB_TEST_FILE } = await setupBeforeNoSeeds(
            __filename
        ));
        const posts = findSpecificSeederFile("comments.js");
        await seedDBFile(posts, DB_TEST_FILE);
    });
    after(async () => await removeTestDB(DB_TEST_FILE));

    describe("GET /comments", async () => {
        let commentResponse;

        it("successfully makes a request to GET /comments", async () => {
            commentResponse = await chai.request(server).get("/comments");

            expect(commentResponse).to.not.be.null;
            expect(commentResponse).to.have.status(200);
        });

        it("returns JSON response of comments with id, content and createdAt attributes", async () => {
            expect(commentResponse).to.be.json;
            expect(commentResponse.body).to.be.a("object");
            expect(commentResponse.body).to.have.own.property("comments");
            expect(commentResponse.body.comments).to.be.a("array");
            expect(commentResponse.body.comments.length).to.eq(3);

            commentResponse.body.comments.forEach((comment) => {
                expect(comment).to.be.an("object");
                expect(comment).to.have.own.property("id");
                expect(comment).to.have.own.property("content");
                expect(comment).to.have.own.property("postId");
                expect(comment).to.have.own.property("createdAt");
                expect(comment).to.not.have.own.property("userId");
                expect(comment).to.not.have.own.property("updatedAt");
            });
        });

        it("returns comments in the correct order (createdAt ascending)", async () => {
            const posts = commentResponse.body.comments;

            expect(posts[0].content).to.equal("Welcome!");
            expect(posts[1].content).to.equal("For real though");
            expect(posts[2].content).to.equal("Uh. Hi?");
        });
    });

    describe("POST /comments", () => {
        describe("Valid Requests", () => {
            let newCommentResponse;
            let newPostBody;

            it("successfully makes a post request to /comments", async () => {
                const reqBody = {
                    userId: 1,
                    content: "This is a new comment!",
                    postId: 1,
                };

                newCommentResponse = await chai
                    .request(server)
                    .post("/comments")
                    .send(reqBody);

                expect(newCommentResponse).to.not.be.null;
                expect(newCommentResponse.status).to.be.within(200, 201);
                expect(newCommentResponse).to.be.json;
            });

            it("returns JSON response with new comment attributes", async () => {
                newCommentBody = newCommentResponse.body;

                expect(newCommentBody).to.be.an("object");
                expect(newCommentBody).to.have.own.property("data");
                expect(newCommentBody.data).to.be.an("object");
            });

            it("returns the correct new comment data", async () => {
                expect(newCommentBody.data).to.have.own.property("id");
                expect(newCommentBody.data.id).to.equal(4);
                expect(newCommentBody.data).to.have.own.property("userId");
                expect(newCommentBody.data.userId).to.equal(1);
                expect(newCommentBody.data).to.have.own.property("content");
                expect(newCommentBody.data.content).to.equal(
                    "This is a new comment!"
                );
                expect(newCommentBody.data).to.have.own.property("postId");
                expect(newCommentBody.data.postId).to.equal(1);
                expect(newCommentBody.data).to.have.own.property("createdAt");
                expect(newCommentBody.data).to.have.own.property("updatedAt");
            });

            it("new comment was added to the database", async () => {
                const sqlResponse = await runSQLQuery(
                    "SELECT * FROM Comments WHERE content = 'This is a new comment!';",
                    DB_TEST_FILE
                );
                expect(sqlResponse).to.be.an("array");
                expect(sqlResponse).to.have.length(1);
                expect(sqlResponse[0].id).to.equal(4);
            });
        });
    });

    describe("PUT /comments/:commentId", () => {
        describe("Valid Requests", () => {
            let editCommentResponse;
            let editPostBody;

            it("successfully makes a put request to /comments/:commentId", async () => {
                const reqBody = {
                    content: "This is an edited comment!",
                };

                editCommentResponse = await chai
                    .request(server)
                    .put("/comments/1")
                    .send(reqBody);

                expect(editCommentResponse).to.not.be.null;
                expect(editCommentResponse.status).to.equal(200);
                expect(editCommentResponse).to.be.json;
            });

            it("returns JSON response with new comment attributes", async () => {
                editCommentBody = editCommentResponse.body;

                expect(editCommentBody).to.be.an("object");
                expect(editCommentBody).to.have.own.property("data");
                expect(editCommentBody.data).to.be.an("object");
            });

            it("returns the correct edited comment data", async () => {
                expect(editCommentBody.data).to.have.own.property("id");
                expect(editCommentBody.data.id).to.equal(1);
                expect(editCommentBody.data).to.have.own.property("userId");
                expect(editCommentBody.data.userId).to.equal(1);
                expect(editCommentBody.data).to.have.own.property("content");
                expect(editCommentBody.data.content).to.equal(
                    "This is an edited comment!"
                );
                expect(editCommentBody.data).to.have.own.property("postId");
                expect(editCommentBody.data.postId).to.equal(2);
                expect(editCommentBody.data).to.have.own.property("createdAt");
                expect(editCommentBody.data).to.have.own.property("updatedAt");
            });

            it("comment was edited in the database", async () => {
                const sqlResponse = await runSQLQuery(
                    "SELECT * FROM Comments WHERE content = 'This is an edited comment!';",
                    DB_TEST_FILE
                );
                expect(sqlResponse).to.be.an("array");
                expect(sqlResponse).to.have.length(1);
                expect(sqlResponse[0].id).to.equal(1);
            });
        });

        describe("Invalid Requests", () => {
            it("returns error message for invalid id (comment doesn't exist)", async () => {
                const invalidCommentIdResponse = await chai
                    .request(server)
                    .put("/comments/5000");

                expect(invalidCommentIdResponse).to.not.be.null;
                expect(invalidCommentIdResponse).to.have.status(400);
                expect(invalidCommentIdResponse.body).to.have.own.property(
                    "message"
                );
                expect(invalidCommentIdResponse.body.message).to.equal(
                    "Comment not found"
                );
            });
        });
    });

    describe("DELETE /comments/:commentId", () => {
        describe("Valid Requests", () => {
            let doomedCommentResponse;
            let doomedPostBody;

            it("successfully makes a delete request to /comments/:commentId", async () => {
                doomedCommentResponse = await chai
                    .request(server)
                    .delete("/comments/1");

                expect(doomedCommentResponse).to.not.be.null;
                expect(doomedCommentResponse.status).to.equal(200);
                expect(doomedCommentResponse).to.be.json;
            });

            it("returns JSON response with deleted message", async () => {
                doomedCommentBody = doomedCommentResponse.body;

                expect(doomedCommentBody).to.be.an("object");
                expect(doomedCommentBody).to.have.own.property("message");
                expect(doomedCommentBody.message).to.be.an("string");
            });

            it("returns the correct delete message", async () => {
                expect(doomedCommentBody.message).to.have.equal(
                    "Successfully deleted comment"
                );
            });

            it("comment was edited in the database", async () => {
                const sqlResponse = await runSQLQuery(
                    "SELECT * FROM Comments WHERE content = 'This is an edited comment!';",
                    DB_TEST_FILE
                );
                expect(sqlResponse).to.be.an("array");
                expect(sqlResponse).to.have.length(0);
            });
        });

        describe("Invalid Requests", () => {
            it("returns error message for invalid id (comment doesn't exist)", async () => {
                const invalidCommentIdResponse = await chai
                    .request(server)
                    .delete("/comments/5000");

                expect(invalidCommentIdResponse).to.not.be.null;
                expect(invalidCommentIdResponse).to.have.status(400);
                expect(invalidCommentIdResponse.body).to.have.own.property(
                    "message"
                );
                expect(invalidCommentIdResponse.body.message).to.equal(
                    "Comment not found"
                );
            });
        });
    });
});
