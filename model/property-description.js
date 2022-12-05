const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const propertyDescriptionSchemaObject = {
  status: defaultString, //0:deleted,1:active
  propertyId: defaultString,
  value: defaultString,
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
const PropertyDescriptionSchema = new mongoose.Schema(propertyDescriptionSchemaObject);

PropertyDescriptionSchema.statics.getSchemaObject = () =>
  propertyDescriptionSchemaObject;
const PropertyDescription = mongoose.model(
  "PropertyDescription",
  PropertyDescriptionSchema
);

module.exports = PropertyDescription;
