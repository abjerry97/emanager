const mongoose = require("mongoose");
const FoodName = require("./food-name");
const FoodDescription = require("./food-description");
const FoodPrice = require("./food-price");
const FoodImage = require("./food-image");
const FoodRating = require("./food-rating");
const FoodAd = require("./food-ad");
const defaultString = {
  type: String,
  default: "",
};
const defaultAdType = {
  type: String,
  default: "food",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const foodSchemaObject = {
  status: defaultString, //0:deleted,1:published,2:unpublished
  name:defaultString,
  ownerName:defaultString,
  ownerPhone:defaultString,
  ownerEmail:defaultString,
  adType:defaultAdType,
  ads:{ _id: defaultString, ...FoodAd.getSchemaObject() },
  price: { _id: defaultString, ...FoodPrice.getSchemaObject() },
  image: [{ _id: defaultString, ...FoodImage.getSchemaObject() }],
  rating: { _id: defaultString, ...FoodRating.getSchemaObject() },
  description: {
    _id: defaultString,
    ...FoodDescription.getSchemaObject(), 
  },
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // admin ID of the admin who created this entry
  createdOn: defaultDate,
};
const FoodSchema = new mongoose.Schema(foodSchemaObject);

FoodSchema.statics.getSchemaObject = () => foodSchemaObject;
const Food = mongoose.model("Food", FoodSchema);

module.exports = Food;
