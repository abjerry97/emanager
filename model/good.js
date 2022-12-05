const mongoose = require("mongoose"); 
const GoodDescription = require("./good-description");
const GoodPrice = require("./good-price");
const GoodImage = require("./good-image");
const GoodRating = require("./good-rating");
const GoodAd = require("./good-ad");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const defaultAdType = {
  type: String,
  default: "goods",
};
const goodSchemaObject = {
  status: defaultString, //0:deleted,1:published,2:unpublished
  name:defaultString,
  adType:defaultAdType,
  ownerName:defaultString,
  ownerPhone:defaultString,
  ownerEmail:defaultString,
  price: { _id: defaultString, ...GoodPrice.getSchemaObject() },
  ads:{ _id: defaultString, ...GoodAd.getSchemaObject() },
  image: { _id: defaultString, ...GoodImage.getSchemaObject() },
  rating: { _id: defaultString, ...GoodRating.getSchemaObject() },
  description: {
    _id: defaultString,
    ...GoodDescription.getSchemaObject(),
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
const GoodSchema = new mongoose.Schema(goodSchemaObject);

GoodSchema.statics.getSchemaObject = () => goodSchemaObject;
const Good = mongoose.model("Good", GoodSchema);

module.exports = Good;
