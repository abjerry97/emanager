const mongoose = require("mongoose");
const PropertyPrice = require("./property-price");
const PropertyRating = require("./property-rating");
const AdImage = require("./ad-image");
const AdDescription = require("./ad-description");
const AdDetails = require("./ad-details");
const PropertyAdPrice = require("./property-ad-price");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const propertyAdSchemaObject = {
  status: defaultString, //0:deleted,1:published,2:unpublished
  propertyId:defaultString,
  title: defaultString,
  category: defaultString,
  type: defaultString, 
  group: defaultString, 
  ownerPhone: defaultString,
  ownerEmail: defaultString,
  ownerName:defaultString,
  location: defaultString,
  bedroom: defaultString,
  furnishedStatus: defaultString,
  bathroom: defaultString,
  parkingSpace: defaultString,
  details: {
    _id: defaultString,
    ...AdDetails.getSchemaObject(),
  }, 
  price: { _id: defaultString, ...PropertyAdPrice.getSchemaObject() },
  image: [{ _id: defaultString, ...AdImage.getSchemaObject() }],
  description: {
    _id: defaultString,
    ...AdDescription.getSchemaObject(),
  },
  rating: {
    _id: defaultString,
    ...PropertyRating.getSchemaObject(),
  },
  updates: [
    {
      by: defaultString, // admin ID of the user who made this update
      action: defaultString, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
  createdOn: defaultDate,
};
const PropertyAdSchema = new mongoose.Schema(propertyAdSchemaObject);

PropertyAdSchema.statics.getSchemaObject = () => propertyAdSchemaObject;
const PropertyAd = mongoose.model("PropertyAd", PropertyAdSchema);

module.exports = PropertyAd;
