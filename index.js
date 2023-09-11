const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const axios = require("axios");
const path = require("path");
const ejs = require("ejs");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

// Your Khalti API credentials
const khaltiPublicKey = process.env.KHALTI_PUBLIC_KEY;
const khaltiSecretKey = process.env.KHALTI_SECRET_KEY;

app.use(bodyParser.json());

// EJS setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static files (for client-side JavaScript)
app.use(express.static(path.join(__dirname, "public")));

// Render the payment page
app.get("/payment", (req, res) => {
  res.render("payment", { khaltiPublicKey });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Route to handle Khalti payment callbacks
app.post("/khalti-callback", async (req, res, next) => {
  try {
    const receivedSignature = req.headers["x-khalti-signature"];
    const callbackData = req.body;

    // Verify the authenticity of the callback using your Khalti secret key
    const generatedSignature = crypto
      .createHmac("sha256", khaltiSecretKey)
      .update(JSON.stringify(callbackData))
      .digest("hex");

    if (receivedSignature === generatedSignature) {
      // Callback is authentic; process the payment status
      const paymentStatus = callbackData.state;

      // You can now update your order status or perform other necessary actions
      if (paymentStatus === "Completed") {
        // Payment was successful
        // Update order status, send confirmation email, etc.
        console.log("Payment successful");
      } else {
        // Payment failed or was canceled
        // Handle accordingly
        console.log("Payment failed or canceled");
      }

      // Respond to Khalti with an acknowledgment
      res.status(200).send("OK");
    } else {
      // Callback is not authentic; reject the request
      console.error("Invalid Khalti callback signature");
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
