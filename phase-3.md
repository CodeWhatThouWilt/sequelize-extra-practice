# Posts

In phase 3 you'll be creating the comments model/migration and adding the proper validations/constraints

## Creating a Model / Migration

The migration for the comments table should have a name of `Comment` with the following attributes:

-   `usedId` integer
-   `postId` integer
-   `content` string

## Constraints and Validations

Here's a list of constraints / validations that need to be implemented on each column/attribute:

### userId

-   `userId` cannot be null

### postId

-   `postId` cannot be null

### content

-   `content` cannot be null
-   `content` has a max character limit of 255 characters
-   `content` cannot be an empty string

### createdAt

-   `createdAt` must have a default value of `CURRENT_TIMESTAMP`

### updatedAt

-   `createdAt` must have a default value of `CURRENT_TIMESTAMP`

You can test your migrations / validations / constraints by running:

```
npm test test/phase-03-migrations.js
```

## Creating Seeders

Create a seeder file with the name `comments` and then create 3 seeds with the following data:

| userId | postId |      content      |
| :----: | :----: | :---------------: |
|   1    |   2    |    "Welcome!"     |
|   2    |   3    | "For real though" |
|   3    |   1    |     "Uh. Hi?"     |

You can test your seeders by running:

```
npm test test/phase-02-seeders.js
```
