# Phase 4 - Posts Router

You can test this phase by running:

```
npm test test/phase-05-server.js
```

## Get All Posts

Gets a list of all posts ordered by createdAt. Only the id, content and createdAt should be in the response

-   Request

    -   Method: `GET`

    -   URL: `/posts`

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
            "posts": [
                {
                    "id": 1,
                    "content": "Hello World",
                    "createdAt": "pretendDateTimeHere"
                },
                {
                    "id": 2,
                    "content": "My first post!",
                    "createdAt": "pretendDateTimeHere"
                }
            ]
        }
        ```

## Create A Post

Creates a new post

-   Request

    -   Method: `POST`

    -   URL: `/posts`

    -   Headers:

        -   Content-Type: `application/json`

    -   Body:

        ```json
        {
            "userId": 1,
            "content": "This is a new post!"
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
                "content": "This is a new post!",
                "createdAt": "pretendDateTimeHere",
                "updatedAt": "pretendDateTimeHere"
            }
        }
        ```
