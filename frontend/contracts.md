# FRONTEND CONTRACTS

## 1. SOCKET CONNECTION

Connect to backend:

```js
const socket = io("http://localhost:5000");
```

---

## 2. JOIN ROOM

Emit:

```js
socket.emit("join_room", {
  roomId,
  userId
});
```

Listen:

```js
socket.on("user_joined", ({ userId }) => {});
socket.on("user_left", ({ userId }) => {});
```

---

## 3. CODE SYNC

Send changes:

```js
socket.emit("code_change", {
  roomId,
  userId,
  code
});
```

Receive updates:

```js
socket.on("code_update", ({ userId, code }) => {
  // update editor
});
```

---

## 4. CHAT

Send message:

```js
socket.emit("chat_message", {
  roomId,
  userId,
  message
});
```

Receive:

```js
socket.on("chat_update", ({ userId, message }) => {
  // update chat UI
});
```

---

## 5. EXECUTE CODE

API Call:

```js
await fetch("http://localhost:5000/execute", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    roomId,
    userId,
    code,
    language
  })
});
```

Handle response:

```js
{
  output,
  error,
  status // "success" | "error" | "timeout"
}
```

---

## 6. TEACHING MODE

Set host:

```js
socket.emit("set_host", {
  roomId,
  userId
});
```

Listen:

```js
socket.on("host_changed", ({ hostId }) => {
  // enable/disable editor
});
```

Rule:

* If current user !== host → disable editing
* Chat still allowed
