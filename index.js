// index.js
// ==============================
// FreeCodeCamp Timestamp Microservice
// ==============================

const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use("/public", express.static(__dirname + "/public"));

// Root route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// ===== Timestamp API =====
app.get("/api/:date?", (req, res) => {
  const dateParam = req.params.date;
  let date;

  // No date param → current date
  if (!dateParam) {
    date = new Date();
  } else if (/^-?\d+$/.test(dateParam)) {
    // Numeric param → treat as Unix timestamp (milliseconds)
    date = new Date(parseInt(dateParam, 10));
  } else {
    // String param → parse as date
    date = new Date(dateParam);
  }

  // Invalid Date handling
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  // Valid date output
  return res.json({
    unix: date.getTime(),
    utc: date.toUTCString(),
  });
});

// ===== Start local server =====
const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Export for Vercel (serverless)
module.exports = app;
