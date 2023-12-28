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

describe("Demo Users", () => {
    let DB_TEST_FILE, models, server, seedFile;

    before(async () => {
        ({ server, models, DB_TEST_FILE } = await setupBeforeNoSeeds(
            __filename
        ));
        seedFile = findSpecificSeederFile("demo-users.js");
    });

    after(async () => await removeTestDB(DB_TEST_FILE));

    it("commits demo users seeder file successfully", async () => {
        await expect(
            seedDBFile(seedFile, DB_TEST_FILE)
        ).to.not.eventually.be.rejectedWith(Error);
    });

    it("has at least 3 entries in the Users table after committing demo users seeder file", async () => {
        const users = await runSQLQuery("SELECT * FROM 'Users'", DB_TEST_FILE);

        expect(users).to.have.lengthOf.at.least(3);

        const expectedUsers = [
            {
                username: "demo",
                email: "demo@test.io",
                hashedPassword: "password",
            },
            {
                username: "tester",
                email: "test@test.io",
                hashedPassword: "password123",
            },
            {
                username: "dev",
                email: "dev@test.io",
                hashedPassword: "securePassword",
            },
        ];

        expectedUsers.forEach((expectedUser) => {
            const user = users.find(
                (u) => u.username === expectedUser.username
            );
            expect(user).to.not.be.undefined;
            expect(user.email).to.equal(expectedUser.email);
            expect(user.hashedPassword).to.equal(expectedUser.hashedPassword);
        });
    });

    it("has a down function that deletes ONLY the three users created in the up function", async () => {
        await runSQL(
            `INSERT INTO 'Users' (username, email, hashedPassword) 
            VALUES 
                ('newuser', 'newuser@test.io', 'password')`,
            DB_TEST_FILE
        );

        await expect(
            undoAllSeeds(DB_TEST_FILE)
        ).to.not.eventually.be.rejectedWith(Error);

        const users = await runSQLQuery(
            "SELECT * FROM 'Users' WHERE username IN ('demo', 'tester', 'dev')",
            DB_TEST_FILE
        );

        expect(users).to.have.lengthOf(0);

        const allUsers = await runSQLQuery(
            "SELECT * FROM 'Users'",
            DB_TEST_FILE
        );

        expect(allUsers).to.have.lengthOf(1);
    });
});
