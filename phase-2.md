# Posts

In phase 2 you'll be creating the Posts model/migration and adding the proper validations/constraints

## Creating a Model / Migration

The migration for the Posts table should have a name of `Post` with the following attributes:

-   `usedId` integer
-   `content` string

## Constraints and Validations

Here's a list of constraints / validations that need to be implemented on each column/attribute:

### userId

-   `userId` cannot be null

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
npm test test/phase-02-migrations.js
```

## Creating Seeders

Create a seeder file with the name `posts` and then create 3 seeds with the following data:

| userId |    content     |
| :----: | :------------: |
|   1    |  Hello World   |
|   2    | My first post! |
|   3    |   Cool app!    |

You can test your seeders by running:

```
npm test test/phase-02-seeders.js
```
