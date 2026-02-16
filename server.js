const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

function formatPhone(phone) {
  if (!phone) return "Неизвестно";
  if (phone.length === 11 && phone.startsWith("7")) {
    return `+7 ${phone.slice(1,4)} ${phone.slice(4,7)}-${phone.slice(7,9)}-${phone.slice(9)}`;
  }
  return phone;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("ru-RU");
}

app.post("/webhook", async (req, res) => {
  const data = req.body;
  let message = "📡 Новое событие\n";

  try {

    // Переадресация
    if (data.service === "sip_redirect") {
      message =
        `📞 Переадресация звонка\n\n` +
        `👤 Кто звонил: ${formatPhone(data.from)}\n` +
        `➡ Куда: ${formatPhone(data.to)}\n` +
        `🕒 Время: ${formatDate(data.date_time)}`;
    }

    // Завершённый звонок
    else if (data.service === "call_end") {
      const duration = data.duration || 0;

      if (duration > 0) {
        message =
          `📞 Звонок завершён\n\n` +
          `👤 Номер: ${formatPhone(data.from)}\n` +
          `⏱ Длительность: ${duration} сек\n` +
          `🕒 Время: ${formatDate(data.date_time)}`;
      } else {
        message =
          `❌ Пропущенный звонок\n\n` +
          `👤 Номер: ${formatPhone(data.from)}\n` +
          `🕒 Время: ${formatDate(data.date_time)}`;
      }
    }

    // SMS
    else if (data.service === "sms_received") {
      message =
        `💬 Новое SMS\n\n` +
        `👤 От: ${formatPhone(data.from)}\n` +
        `📨 Текст: ${data.message}\n` +
        `🕒 Время: ${formatDate(data.date_time)}`;
    }

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message
    });

    res.sendStatus(200);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});





