const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const shippingAddressSchemaObject = {
  status: defaultString, //0:inactive,1:active
  value: defaultString,
  ownerId: defaultString,
  ownerType: defaultString, //user:0,admin:1
  estateId: defaultString,
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
  dueOn: defaultDate,
  createdOn: defaultDate,
};
const ShippingAddressSchema = new mongoose.Schema(shippingAddressSchemaObject);

ShippingAddressSchema.statics.getSchemaObject = () =>
  shippingAddressSchemaObject;
const ShippingAddress = mongoose.model(
  "ShippingAddress",
  ShippingAddressSchema
);

module.exports = ShippingAddress;
