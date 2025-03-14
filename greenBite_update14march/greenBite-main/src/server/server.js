import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'greenbite.dfwm@gmail.com',
    pass: 'nydn rjhp khrq wbod'
  }
});

app.post('/api/send-approval-email', async (req, res) => {
  const { email, ngoName } = req.body;
  
  try {
    await transporter.sendMail({
      from: 'greenbite.dfwm@gmail.com',
      to: email,
      subject: 'Your NGO Approval - Welcome to GreenBite',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
          <img src="https://your-logo-url.com" alt="GreenBite Logo" style="max-width: 150px; margin-bottom: 20px;"/>
          
          <p style="color: #333;">Dear ${ngoName || 'NGO Representative'},</p>
          <p style="color: #333;">We are delighted to inform you that your NGO has been successfully approved by the GreenBite admin team.</p>
          <p style="color: #333;">You can now log in to your account and begin managing donations. We are excited to have you join our mission to reduce food waste and make a positive impact in the community.</p>
          <p style="color: #333;">Together, we can create lasting change and build a more sustainable future for all.</p>
          <p style="color: #333;">Should you have any questions or need assistance, please don't hesitate to reach out.</p>
          <p style="color: #333;">Thank you for being part of this important cause!</p>
          <p style="color: #333; margin-top: 30px;">Best regards,<br>The GreenBite Team</p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});