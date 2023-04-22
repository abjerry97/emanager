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
const defaultNumber = {
  type: Number,
  default: 0,
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const defaultArray = {
  type: Array,
  default: [],
};
const defaultBoolean = {
  type: Boolean,
  default: false,
};
const propertyAdCheckoutSchemaObject = {
  status: defaultString, //0:deleted,1:published,2:unpublished
  event: defaultString,
  phone: defaultString,
  months: defaultString,
  amount: defaultString,
  propertyAdId: defaultString,
  walletId: defaultString,
  userId: defaultString,
  referrer: defaultString,
  paystackResponse: defaultArray,
  createdBy: defaultString, // user ID of the user who created this entry
  createdOn: defaultDate,
};
const PropertyAdCheckoutSchema = new mongoose.Schema(
  propertyAdCheckoutSchemaObject
);

PropertyAdCheckoutSchema.statics.getSchemaObject = () =>
  propertyAdCheckoutSchemaObject;
const PropertyAdCheckout = mongoose.model(
  "PropertyAdCheckout",
  PropertyAdCheckoutSchema
);

module.exports = PropertyAdCheckout;
