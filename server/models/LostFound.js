const mongoose = require("mongoose");

const lostFoundSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Lost", "Found"],
      required: true,
    },

    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Electronics",
        "ID Card",
        "Books",
        "Keys",
        "Wallet",
        "Clothing",
        "Accessories",
        "Other",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    itemDate: {
      type: Date,
      required: true,
    },

    contactInfo: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
  type: String,
  default: "",
},

imagePublicId: {
  type: String,
  default: "",
},

    status: {
      type: String,
      enum: ["Open", "Resolved"],
      default: "Open",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "LostFound",
  lostFoundSchema
);