const mongoose = require("mongoose");
const AdImage = require("./ad-image");
const AdDescription = require("./ad-description");
const AdDetails = require("./ad-details");
const FoodRating = require("./food-rating");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const foodAdSchemaObject = {
  status: defaultString, //0:deleted,1:published,2:unpublished
  foodId: defaultString,
  title: defaultString,
  category: defaultString,
  type: defaultString,
  ownerPhone: defaultString,
  ownerEmail: defaultString,
  details: {
    _id: defaultString,
    ...AdDetails.getSchemaObject(),
  },
  image: [{ _id: defaultString, ...AdImage.getSchemaObject() }],
  description: {
    _id: defaultString,
    ...AdDescription.getSchemaObject(),
  },
  rating: {
    _id: defaultString,
    ...FoodRating.getSchemaObject(),
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
const FoodAdSchema = new mongoose.Schema(foodAdSchemaObject);

FoodAdSchema.statics.getSchemaObject = () => foodAdSchemaObject;
const FoodAd = mongoose.model("FoodAd", FoodAdSchema);

module.exports = FoodAd;
