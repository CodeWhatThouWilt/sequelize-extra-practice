# Users

In phase 1 you'll be creating the Users model/migration and adding the proper validations/constraints

## Creating a Model / Migration

The migration for the Users table should have a name of `User` with the following attributes:

-   `username` string
-   `email` string
-   `hashedPassword` string
-   `bio` string

## Constraints and Validations

Here's a list of constraints / validations that need to be implemented on each column/attribute:

### username

-   `username` has a max character limit of 24 characters
-   `username` cannot be less than 1 character in length
-   `username` cannot be an empty string
-   `username` cannot be null
-   `username` must be unique
-   `username` must only consist of alphanumeric characters

### email

-   `email` has a max character limit of 255 characters
-   `email` cannot be less than 6 characters in length
-   `email` cannot be an empty string
-   `email` cannot be null
-   `email` must be an email string
-   `email` must be unique

### hashedPassword

-   `hashedPassword` cannot be null
-   `hashedPassword` cannot be an empty string
-   `hashedPassword` has a character limit of 30 characters
-   `hashedPassword` cannot be less than 8 characters

```
IMPORTANT: For this practice the passwords will not be hashed. You'll be learning password hashing soon. NEVER store plain text passwords like you'll be doing in this practice. It's a security risk.
```

### createdAt

-   `createdAt` must have a default value of `CURRENT_TIMESTAMP`

### updatedAt

-   `createdAt` must have a default value of `CURRENT_TIMESTAMP`

You can test your migrations / validations / constraints by running:

```
npm test test/phase-01-migrations.js
```

## Creating Seeders

Create a seeder file with the name `demo-users` and then create 3 seeds with the following data:

| username |    email     | hashedPassword |
| :------: | :----------: | :------------: |
|   demo   | demo@test.io |    password    |
|  tester  | test@test.io |  password123   |
|   dev    | dev@test.io  | securePassword |

You can test your seeders by running:

```
npm test test/phase-01-seeders.js
```
