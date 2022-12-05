const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const propertyImageSchemaObject = {
  status: defaultString, //0:deleted,1:active
  propertyId: defaultString,
  url: defaultString,
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // admin ID of the admin who created this entry
  createdOn: defaultDate,
};
const PropertyImageSchema = new mongoose.Schema(propertyImageSchemaObject);

PropertyImageSchema.statics.getSchemaObject = () =>
  propertyImageSchemaObject;
const PropertyImage = mongoose.model(
  "PropertyImage",
  PropertyImageSchema
);

module.exports = PropertyImage;
