# Phase 6 - Comments Router

You can test this phase by running:

```
npm test test/phase-06-server.js
```

## Get All Comments

Gets a list of all comments ordered by createdAt. Only the id, content, postId and createdAt should be in the response

-   Request

    -   Method: `GET`

    -   URL: `/comments`

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
            "comments": [
                {
                    "id": 1,
                    "content": "Welcome!",
                    "createdAt": "pretendDateTimeHere",
                    "postId": 1
                },
                {
                    "id": 2,
                    "content": "For real though",
                    "createdAt": "pretendDateTimeHere",
                    "postId": 2
                }
            ]
        }
        ```

## Create A Comment

Creates a new comment

-   Request

    -   Method: `POST`

    -   URL: `/comments`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body:

        ```json
        {
            "userId": 1,
            "postId": 3,
            "content": "This is a new comment!"
        }
        ```

        ```
        IMPORTANT NOTE: Typically we do not want to have a user id in the request body like this. It can be very unsecure and allow users to create a post for another user by just sending a request with whatever id they want. Soon we'll be learning user authentication which we can then use to get the current users id.
        ```

-   Successful Response

    -   Status Code: `200` or `201`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body:

        ```json
        {
            "data": {
                "id": 5,
                "userId": 1,
                "postId": 3,
                "content": "This is a new comment!",
                "createdAt": "pretendDateTimeHere",
                "updatedAt": "pretendDateTimeHere"
            }
        }
        ```

## Edit A Comment

Edits a comment that already exists

-   Request

    -   Method: `PUT`

    -   URL: `/comments`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body:

        ```json
        {
            "content": "This is an edited comment!"
        }
        ```

        ```
        IMPORTANT NOTE: Typically we want to use user authorization to see if a user has permissions to edit whatever it is they're tying to edit. We'll be covering this over the coming weeks. For now you don't need to worry about that implementation.
        ```

-   Successful Response

    -   Status Code: `200` or `201`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body:

        ```json
        {
            "data": {
                "id": 5,
                "userId": 1,
                "postId": 2,
                "content": "This is a new comment!",
                "createdAt": "pretendDateTimeHere",
                "updatedAt": "pretendDateTimeHere"
            }
        }
        ```

-   Error response: Comment with the specified ID doesn't exist

    -   Status Code: `400`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body:

        ```json
        {
            "message": "Comment not found"
        }
        ```

## Delete A Comment

Deletes a comment based on it's id

-   Request

    -   Method: `DELETE`

    -   URL: `/comments/:commentId`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body: `none`

-   Successful Response

    -   Status Code: `200`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body:

        ```json
        {
            "message": "Successfully deleted comment"
        }
        ```

-   Error response: Comment with the specified ID doesn't exist

    -   Status Code: `400`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body:

        ```json
        {
            "message": "Comment not found"
        }
        ```
