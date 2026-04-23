# CodeColab
# Backend Setup

## 1. Install dependencies

```bash
npm install
```

## 2. Setup environment

Create `.env` file:

```
PORT=5000
JUDGE0_API_KEY=your_api_key_here
```

## 3. Run server

```bash
npm start
```

Server will run on:

```
http://localhost:5000
```

## 4. Test API

```bash
curl -X POST http://localhost:5000/execute \
-H "Content-Type: application/json" \
-d '{"code":"print(\"Hello\")","language":"python"}'
```
