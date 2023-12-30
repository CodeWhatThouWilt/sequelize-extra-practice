# Phase 4 - Users Router

In your server directory you'll see a routes directory. For the next phases you'll be working in the files within that directory. Outlined below are all the routes that need to be created along with the expected requests and responses.

You can test this phase by running:

```
npm test test/phase-04-server.js
```

## Get All Users

Gets a list of all users ordered by username. Only the id, username, email should be included in the response.

-   Request

    -   Method: `GET`

    -   URL: `/users`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body: `None`

-   Successful Response

    -   Status Code: `200`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body:

        ```json
        {
            "users": [
                {
                    "id": 1,
                    "email": "demo@test.io",
                    "username": "demo"
                },
                {
                    "id": 2,
                    "email": "test@test.io",
                    "username": "tester"
                }
            ]
        }
        ```

## Get the Details of a User by ID

Gets the id, username, email, and bio of a user based on their id

-   Request

    -   Method: `GET`

    -   URL: `/users/:userId`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body: `None`

-   Successful Response

    -   Status Code: `200`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body:

        ```json
        {
            "details": {
                "id": 3,
                "username": "dev",
                "email": "dev@test.io",
                "bio": "Ayyyye dev time"
            }
        }
        ```

-   Error response: User with the specified ID doesn't exist

    -   Status Code: `400`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body:

        ```json
        {
            "message": "User not found"
        }
        ```

    ```
    TIP: When handling errors set two properties, message and status, on the error object then pass it into the next function. Doing this will pass it to the error handling middleware in the app.js file which will handle the formatting.
    ```
