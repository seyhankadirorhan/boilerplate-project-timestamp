// index.js
const express = require("express");
const path = require("path");

const app = express();

// Statik dosyalar (boilerplate'te var)
app.use("/public", express.static(path.join(__dirname, "public")));

// Ana sayfa (boilerplate views/index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// ---- Timestamp API ----
app.get("/api/:date?", (req, res) => {
  const { date: dateParam } = req.params;

  let date;
  if (!dateParam) {
    // Parametre yok -> şu anki zaman
    date = new Date();
  } else if (/^-?\d+$/.test(dateParam)) {
    // Tamamen sayısal -> Unix ms olarak yorumla
    // (FCC testleri milisaniye bekler)
    date = new Date(parseInt(dateParam, 10));
  } else {
    // ISO vb. string tarih
    date = new Date(dateParam);
  }

  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString(),
  });
});

// ---- Lokal geliştirme için dinle ----
const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Local: http://localhost:${port}`);
  });
}

// ---- Vercel (serverless) export ----
module.exports = app;
