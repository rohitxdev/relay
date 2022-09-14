# Relay

A free video conferencing app made with React, Typescript, Express.js, Redis, and Agora SDK which uses webRTC protocol under the hood.

![MIT License](https://img.shields.io/github/license/rohitman47/relay?style=for-the-badge)

![Version](https://img.shields.io/github/package-json/v/rohitman47/relay?color=gre&style=for-the-badge)

![Github Release](https://img.shields.io/github/v/release/rohitman47/relay?style=for-the-badge)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`AGORA_APP_ID`

`AGORA_APP_CERTIFICATE`

`REDIS_URL`

`REDIS_USERNAME`

`REDIS_PASSWORD`

## API Reference

### Get room ID

```http
  GET /api/get-room-id
```

Generate room ID and add it to database.

### Verify room ID

```http
  GET /api/verify-room-id/${roomId}
```

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `roomId`  | `string` | **Required**. Room ID to be verified |

Check if the room ID is valid by querying the database.

### Get access token

```http
  GET /api/get-access-token?roomId=${roomId}&username=${username}
```

| Parameter  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `roomId`   | `string` | **Required**. Room ID            |
| `username` | `string` | **Required**. Username of client |

Get access token for the given room ID and also add username to database.

### Get username

```http
  GET /api/get-username/${uid}
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `uid`     | `string` | **Required**. UID of the user |

Get username of the remote user with the given UID.

### Delete username

```http
  DELETE /api/delete-username/${username}
```

| Parameter  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `username` | `string` | **Required**. Username of client |

Delete username of the client from database when leaving room.

## Authors

- [@rohitman47](https://www.github.com/rohitman47)

## Tech Stack

**Client:** React, Redux, SCSS, Typescript, Vite.

**Server:** Node, Express, Typescript, Redis.

## Features

- Video conferencing with upto 20 people in a room
- Switch cameras on supported devices
- Screen sharing with audio on supported devices
- Floating client video in 2 user call
- Fullscreen mode
- Progressive Web App (PWA)

## Screenshots

![App Screenshot 1](https://i.postimg.cc/0y2yFrKX/Screenshot-2022-09-14-at-21-34-41-Free-Video-Conferencing-for-Everyone.png)

![App Screenshot 2](https://i.postimg.cc/K8q82FnG/Screenshot-2022-09-14-214546.png)

![App Screenshot 3](https://i.postimg.cc/XYGwGVnJ/Screenshot-2022-09-14-at-21-53-16-Free-Video-Conferencing-for-Everyone.png)

## Run Locally

Clone the project

```bash
  git clone https://github.com/rohitman47/relay.git
```

Go to the project directory

```bash
  cd relay
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Demo

<https://relay.rohitman47.xyz>

## License

[MIT](https://choosealicense.com/licenses/mit/)
