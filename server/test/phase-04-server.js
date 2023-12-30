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

describe("Phase 4 - User Queries", () => {
    let DB_TEST_FILE, models, server;
    before(async () => {
        ({ server, models, DB_TEST_FILE } = await setupBeforeNoSeeds(
            __filename
        ));
        const users = findSpecificSeederFile("demo-users.js");
        await seedDBFile(users, DB_TEST_FILE);
    });
    after(async () => await removeTestDB(DB_TEST_FILE));

    describe("GET /users", () => {
        let userResponse;

        it("successfully makes a request to GET /users", async () => {
            userResponse = await chai.request(server).get("/users");

            expect(userResponse).to.not.be.null;
            expect(userResponse).to.have.status(200);
        });

        it("returns JSON response of users with id, email, and username attributes", async () => {
            expect(userResponse).to.be.json;
            expect(userResponse.body).to.be.a("object");
            expect(userResponse.body.users).to.be.a("array");
            expect(userResponse.body.users.length).to.eq(3);

            userResponse.body.users.forEach((user) => {
                expect(user).to.be.an("object");
                expect(user).to.have.own.property("id");
                expect(user).to.have.own.property("email");
                expect(user).to.have.own.property("username");
                expect(user).to.not.have.own.property("hashedPassword");
                expect(user).to.not.have.own.property("bio");
                expect(user).to.not.have.own.property("createdAt");
                expect(user).to.not.have.own.property("updatedAt");
            });
        });

        it("returns users in the correct order (username ascending)", async () => {
            const users = userResponse.body.users;

            expect(users[0].username).to.equal("demo");
            expect(users[1].username).to.equal("dev");
            expect(users[2].username).to.equal("tester");
        });
    });

    describe("GET /users/:userId", () => {
        let userIdResponse;

        it("successfully makes a request to GET /users/:userId", async () => {
            userIdResponse = await chai.request(server).get("/users/2");

            expect(userIdResponse).to.not.be.null;
            expect(userIdResponse).to.have.status(200);
        });

        it("returns JSON response of valid user with id, email, username and bio attributes", async () => {
            expect(userIdResponse).to.be.json;
            expect(userIdResponse.body).to.be.an("object");
            expect(userIdResponse.body.details).to.be.an("object");
            expect(userIdResponse.body.details).to.have.own.property("id");
            expect(userIdResponse.body.details.id).to.equal(2);
            expect(userIdResponse.body.details).to.have.own.property("email");
            expect(userIdResponse.body.details.email).to.equal("test@test.io");
            expect(userIdResponse.body.details).to.have.own.property(
                "username"
            );
            expect(userIdResponse.body.details.username).to.equal("tester");
            expect(userIdResponse.body.details).to.have.own.property("bio");
            expect(userIdResponse.body.details.bio).to.equal("Test account");
        });

        it("returns error message for invalid id (user doesn't exist)", async () => {
            const invaliduserIdResponse = await chai
                .request(server)
                .get("/users/5000");

            expect(invaliduserIdResponse).to.not.be.null;
            expect(invaliduserIdResponse).to.have.status(400);
            expect(invaliduserIdResponse.body).to.have.own.property("message");
            expect(invaliduserIdResponse.body.message).to.equal(
                "User not found"
            );
        });
    });
});
