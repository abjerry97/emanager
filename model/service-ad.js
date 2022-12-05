const mongoose = require("mongoose");
const PropertyRating = require("./food-rating");
const AdImage = require("./ad-image");
const AdDescription = require("./ad-description");
const AdDetails = require("./ad-details");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const serviceAdSchemaObject = {
  status: defaultString, //0:deleted,1:published,2:unpublished
  serviceId: defaultString,
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
const ServiceAdSchema = new mongoose.Schema(serviceAdSchemaObject);

ServiceAdSchema.statics.getSchemaObject = () => serviceAdSchemaObject;
const ServiceAd = mongoose.model("ServiceAd", ServiceAdSchema);

module.exports = ServiceAd;
