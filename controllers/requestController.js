const RequestProduct = require("../models/request");
const { sendEmail } = require("../utils/emailSender");

const submitProductRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      productName,
      productType,
      description,
      urgency,
      preferredBrands,
      priceRange,
      additionalInfo,
    } = req.body;

    if (!name || !email || !productName) {
      return res
        .status(400)
        .json({ message: "Name, email, and product name are required." });
    }

    const newRequest = new RequestProduct({
      name,
      email,
      productName,
      productType,
      description,
      urgency,
      preferredBrands,
      priceRange,
      additionalInfo,
    });

    await newRequest.save();

    await sendEmail(
      email,
      "Product Request Received",
      `
  <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; background-color: #f9f9f9; padding: 25px; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 25px;">
      <h2 style="color: #2c3e50;">🎯 Product Request Received</h2>
    </div>

    <p style="font-size: 16px; color: #333; text-align:center;">Hi <strong>${name}</strong>,</p>

    <p style="font-size: 15px; color: #444;text-align: center;">
      We’re excited to let you know that your product request has been received successfully on <strong>QualityPicks</strong>! ✅
      Our expert team will now analyze your request and get back to you with handpicked suggestions soon.
    </p>

    <h3 style="color: #007bff; font-size: 17px;">📌 Submitted Details</h3>
    <table style="width: 100%; border-collapse: collapse; background-color: #fff; border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
      <tbody>
        <tr>
          <td style="padding: 10px; font-weight: bold;">🧾 Product Name:</td>
          <td style="padding: 10px;">${productName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">🔍 Description:</td>
          <td style="padding: 10px;">${description}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">🚨 Urgency:</td>
          <td style="padding: 10px;">${urgency}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">🏷️ Preferred Brands:</td>
          <td style="padding: 10px;">${preferredBrands}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">💰 Price Range:</td>
          <td style="padding: 10px;">${priceRange}</td>
        </tr>
      </tbody>
    </table>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://yourwebsite.com" style="padding: 12px 20px; background-color: #007bff; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">
        Explore Similar Products 🔍
      </a>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #555; text-align: center;">
      Thanks for trusting us!<br/>— The QualityPicks Team 💙
    </p>
  </div>
`
    );

    res
      .status(201)
      .json({ message: "Product request submitted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while submitting the request." });
  }
};

const replyToProductAdded = async (req, res) => {
  const { email, name, product } = req.body;

  // const { replyMessage } = req.body;
  // const contactId = req.params.id;

  try {
    const htmlContent = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9f9f9; padding: 30px; max-width: 650px; margin: auto; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
    <div style="text-align: center;">
      <h2 style="color: #2c3e50;">✅ Great News, ${name.toUpperCase()}!</h2>
      <p style="font-size: 16px; color: #333;">Your requested product <strong style="color: #007bff;">"${product.toUpperCase()}"</strong> has been successfully added to QualityPics.</p>
    </div>

    <div style="margin: 30px 0; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #eee;">
      <h3 style="margin-bottom: 10px; color: #444;">🛍️ What Happens Next?</h3>
      <ul style="padding-left: 20px; color: #555; font-size: 15px;">
        <li>You can now view your product on our website</li>
        <li>We’ll notify you with top recommendations and affiliate links</li>
        <li>Our research team keeps evaluating better options for you</li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 25px;">
      <a href="https://yourwebsite.com/products" style="background: #007bff; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px;">
        🔍 View Your Product
      </a>
    </div>

    <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
      Thanks for trusting us, ${name.toUpperCase()}!<br />
      — The <strong>QualityPics</strong> Team 💙
    </p>
  </div>
`;

    await sendEmail(
      email,
      `🎉 Your Requested Product is Now Live on QualityPics!`,
      htmlContent
    );

    const updated = await RequestProduct.findByIdAndUpdate(
      req.params.id,
      {
        replied: true,
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

const getAllProductRequests = async (req, res) => {
  try {
    const requests = await RequestProduct.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while retrieving product requests." });
  }
};

const deleteProductRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await RequestProduct.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Product request deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while deleting product request." });
  }
};

module.exports = {
  submitProductRequest,
  getAllProductRequests,
  deleteProductRequest,
  replyToProductAdded,
};
