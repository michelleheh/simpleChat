## What is This?
This is simple server side Telnet chat app. The server is deployed on AWS EC2.

### Getting Started

* Install dependencies
```
npm install
```
* Run the server
```
node server/server.js
```
* Log in as a user
```
telnet 54.164.129.130 9399
```
* routes
  * `/rooms` to get all the active rooms
  * `/join chat` to join the room called chat
  * `/leave` to leave the room
  * `/quit` to close socket connetion
