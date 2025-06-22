const Contact = require("../models/contact");
const { sendEmailtoAdmin } = require("../utils/emailSender");
const { sendEmail } = require("../utils/emailSender");

// POST: Save contact message
exports.saveContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    const adminMessage = `<h3 style="color: #2c3e50;">📌 Message Summary</h3>
      <table style="width: 100%; border-collapse: collapse; background-color: #fff; border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
        <tbody>
          <tr>
            <td style="padding: 10px; font-weight: bold;">👤 Name:</td>
            <td style="padding: 10px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">📨 Email:</td>
            <td style="padding: 10px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">📝 Subject:</td>
            <td style="padding: 10px;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">💬 Message:</td>
            <td style="padding: 10px;">${message}</td>
          </tr>
        </tbody>
      </table> `;
    await sendEmailtoAdmin(
      process.env.EMAIL_USER,
      `From QualityPics Contact Page: ${subject}`,
      adminMessage
    );
    res.status(201).json({ message: "Contact message saved successfully." });
  } catch (error) {
    console.error("Save Contact Error:", error);
    res.status(500).json({ message: "Failed to save contact message." });
  }
};

// GET: Retrieve all contact messages
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // Latest first
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Get Contact Error:", error);
    res.status(500).json({ message: "Failed to fetch contact messages." });
  }
};

// DELETE: Delete by ID
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully." });
  } catch (error) {
    console.error("Delete Contact Error:", error);
    res.status(500).json({ message: "Failed to delete contact." });
  }
};

//reply to messages through gmail
exports.replyToContact = async (req, res) => {
  const { email, name, subject, reply } = req.body;

  try {
    const htmlContent = `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #007bff; font-size: 26px;">📬 Reply from <span style="color:#333;">QualityPics</span></h2>
      <p style="font-size: 16px; color: #777;">We're here to help you with your query</p>
    </div>

    <div style="font-size: 16px; color: #333; line-height: 1.6;">
      <p>Hi <strong>${name}</strong>,</p>

      <div style="padding: 15px; background-color: #f0f8ff; border-left: 4px solid #007bff; border-radius: 6px; margin: 20px 0;">
        ${reply}
      </div>

      <p>If you have more questions or need further assistance, feel free to reply back. We're always happy to help!</p>
    </div>

    <div style="text-align: center; margin-top: 40px;">
      <a href="https://yourwebsite.com" style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        🌐 Visit Our Website
      </a>
    </div>

    <p style="margin-top: 30px; font-size: 14px; color: #999; text-align: center;">
      Thanks for contacting us!<br/>— The <strong>QualityPics</strong> Team 💙
    </p>
  </div>`;
    await sendEmail(email, `Reply for: ${subject}`, htmlContent);

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        replied: true,
        replyMessage: reply,
        repliedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Reply sent successfully." });
  } catch (err) {
    console.error("Reply error:", err);
    res.status(500).json({ message: "Failed to send reply email." });
  }
};
