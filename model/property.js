const mongoose = require("mongoose");
const PropertyTitle = require("./property-title");
const PropertyDescription = require("./property-description");
const PropertyPrice = require("./property-price");
const PropertyImage = require("./property-image");
const PropertyRating = require("./property-rating");
const PropertyAd = require("./property-ad");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const defaultBoolean = {
  type: Boolean,
  default: false,
};
const propertySchemaObject = {
  status: defaultString, //0:deleted,1:published,2:unpublished
  title: defaultString,
  category: defaultString,
  isAvaliable: defaultString,
  isPublished:defaultBoolean,
  isApproved:defaultBoolean,
  isActive:defaultBoolean,
  adType:defaultString,
  type:defaultString, 
  ownerPhone:defaultString,
  ownerName:defaultString,
  ownerEmail:defaultString,
  price: { _id: defaultString, ...PropertyPrice.getSchemaObject() },
  ads: [{ _id: defaultString, ...PropertyAd.getSchemaObject() }],
  image: [{ _id: defaultString, ...PropertyImage.getSchemaObject() }],
  description: {
    _id: defaultString,
    ...PropertyDescription.getSchemaObject(),
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
const PropertySchema = new mongoose.Schema(propertySchemaObject);

PropertySchema.statics.getSchemaObject = () => propertySchemaObject;
const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;
