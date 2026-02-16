const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = "8546975830:AAGH1W9FhNU5hhXugN8Duxfs0fZufKE5rAc";
const CHAT_ID = "7956673713";

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});



