const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

const client = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

app.use(cors());
app.use(bodyParser.json());

app.post("/send-otp", async (req, res) => {
  try {
    await client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
      .verifications.create({ to: req.body.phone, channel: "sms" });
    res.json({ success: true, message: "OTP sent!" });
  } catch (e) {
    res.json({ success: false, message: "Failed to send OTP." });
  }
});

app.post("/verify-otp", async (req, res) => {
  try {
    const verification = await client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
      .verificationChecks.create({ to: req.body.phone, code: req.body.otp });

    if (verification.status === "approved") {
      res.json({ success: true, message: "OTP Verified ✅" });
    } else {
      res.json({ success: false, message: "Wrong OTP ❌" });
    }
  } catch (e) {
    res.json({ success: false, message: "Verification failed." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
