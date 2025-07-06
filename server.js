require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Gmail transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/send-email', async (req, res) => {
  const { name, email } = req.body;

  const mailOptions = {
    from: `"EcoNest" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "🎉 Welcome to EcoNest – Here’s Your 20% OFF Code!",
    html: `
      <h2>Welcome to EcoNest 🌿</h2>
      <p>Hi ${name || 'Subscriber'},</p>
      <p>Thanks for subscribing!</p>
      <p>Here is your 20% discount code:</p>
      <h3 style="color:green;">ECONEST20</h3>
      <p>Use this at checkout on your first order.</p>
      <p>– The EcoNest Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", email);
    res.status(200).json({ success: true, message: 'Email sent!' });
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
