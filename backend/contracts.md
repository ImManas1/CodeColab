# BACKEND CONTRACTS

## 1. HTTP API

### POST /execute

Request:

```json
{
  "roomId": "room123",
  "userId": "userA",
  "code": "print('Hello')",
  "language": "python"
}
```

Response (Success):

```json
{
  "output": "Hello",
  "error": null,
  "status": "success"
}
```

Response (Error):

```json
{
  "output": "",
  "error": "SyntaxError",
  "status": "error"
}
```

Response (Timeout):

```json
{
  "output": "",
  "error": "Execution timed out",
  "status": "timeout"
}
```

---

## 2. SOCKET EVENTS

### JOIN ROOM

Event: join_room
Payload:

```json
{
  "roomId": "room123",
  "userId": "userA"
}
```

Emit:

```json
user_joined → { "userId": "userA" }
```

---

### LEAVE ROOM (AUTO)

Event: disconnect

Emit:

```json
user_left → { "userId": "userA" }
```

---

### CODE SYNC

Event: code_change
Payload:

```json
{
  "roomId": "room123",
  "userId": "userA",
  "code": "updated code here"
}
```

Emit:

```json
code_update → {
  "userId": "userA",
  "code": "updated code here"
}
```

---

### CHAT

Event: chat_message
Payload:

```json
{
  "roomId": "room123",
  "userId": "userA",
  "message": "Hello"
}
```

Emit:

```json
chat_update → {
  "userId": "userA",
  "message": "Hello"
}
```

---

### TEACHING MODE (HOST CONTROL)

Event: set_host
Payload:

```json
{
  "roomId": "room123",
  "userId": "userA"
}
```

Emit:

```json
host_changed → { "hostId": "userA" }
```

Rule:

* Only host can send `code_change`
* Others are blocked from editing
