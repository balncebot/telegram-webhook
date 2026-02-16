const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = "ТВОЙ_ТОКЕН_СЮДА";
const CHAT_ID = "ТВОЙ_CHAT_ID";

app.post("/webhook", async (req, res) => {
  const data = JSON.stringify(req.body, null, 2);

  await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: "📞 Новое событие:\n\n" + data
  });

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(3000, () => {
  console.log("Server started");
});
