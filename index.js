const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const csv = require("csv-parser");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: "./data/",
  filename: function (req, file, cb) {
    const { type } = req.query;
    cb(null, type + "/" + file.originalname + "-" + Date.now() + ".csv");
  },
});
const upload = multer({ storage: storage });

require("dotenv").config();
const Card = require("./Models/orderModel");

// Importing the MongoDB connection function
const connectDb = require("./utils/db");

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send([]);
});

// Establish MongoDB connection and populate database
connectDb()
  .then(async () => {
    console.log("MongoDB connected successfully");
    // Populate MongoDB with sample data
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
app.get("/get_card_status", async (req, res) => {
  try {
    const { phone, cardId } = req.query;
    let query;
    if (phone) {
      // Match only the last 9 digits of the phone number
      const phoneRegex = new RegExp(phone.substring(phone.length - 9));
      query = { userMobile: { $regex: phoneRegex } };
    } else if (cardId) {
      query = { cardId };
    } else {
      return res
        .status(400)
        .json({ error: "Phone number or card ID is required" });
    }

    // Find card in the database
    const card = await Card.findOne(query);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json({ card });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const csvToJson = (csvFilePath, callback) => {
  const jsonArray = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => jsonArray.push(data))
    .on("end", () => {
      callback(null, jsonArray);
    })
    .on("error", (error) => {
      callback(error, null);
    });
};
async function addPickupData(jsonArray) {
  try {
    for (const item of jsonArray) {
      const card = new Card({
        cardId: item["Card ID"],
        userMobile: item["User Mobile"],
      });
      await card.save();
    }
    console.log("Pickup data added successfully.");
  } catch (error) {
    console.error("Error adding Pickup data:", error);
  }
}
async function addDeliveryData(jsonArray) {
  try {
    for (const item of jsonArray) {
      const cardData = await Card.findOne({ cardId: item["Card ID"] });
      if (cardData) {
        cardData.attempt === 2
          ? (cardData.Delivered = -1)
          : (cardData.attempt = cardData.attempt + 1);
        cardData.comment = item.Comment;

        await cardData.save();
      }
    }
    console.log("Delivery Exception Data  updated successfully.");
  } catch (error) {
    console.error("Error updating Delivery Exception Data:", error);
  }
}

async function addDeliveredData(jsonArray) {
  try {
    for (const item of jsonArray) {
      const cardData = await Card.findOne({ cardId: item["Card ID"] });
      if (cardData) {
        cardData.Delivered = 1;
        cardData.comment = item.Comment;

        await cardData.save();
      }
    }
    console.log("Delivered updated successfully.");
  } catch (error) {
    console.error("Error Delivered updating data:", error);
  }
}

async function addReturnedData(jsonArray) {
  try {
    for (const item of jsonArray) {
      const cardData = await Card.findOne({ cardId: item["Card ID"] });
      if (cardData) {
        cardData.Delivered = -1;

        await cardData.save();
      }
    }
    console.log("Returned updated successfully.");
  } catch (error) {
    console.error("Error in  updating Returned Data:", error);
  }
}

app.post("/add-file", upload.single("data"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  csvToJson(req.file.path, (error, jsonArray) => {
    if (error) {
      return res.status(500).send("Error converting CSV to JSON.");
    }
    if (req.query.type === "pickup") {
      addPickupData(jsonArray);
    } else if (req.query.type === "delivery") {
      addDeliveryData(jsonArray);
    } else if (req.query.type === "delivered") {
      addDeliveredData(jsonArray);
    } else if (req.query.type === "returned") {
      addReturnedData(jsonArray);
    }

    res.json({ msg: req.query.type + " data has been updated" });
  });
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
