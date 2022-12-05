const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const propertyEstateLinkingSchemaObject = {
  status: defaultString, //0:deleted,1:active
  propertyId: defaultString,
  estateId: defaultString,
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
const PropertyEstateLinkingSchema = new mongoose.Schema(propertyEstateLinkingSchemaObject);

PropertyEstateLinkingSchema.statics.getSchemaObject = () =>
  propertyEstateLinkingSchemaObject;
const PropertyEstateLinking = mongoose.model(
  "PropertyEstateLinking",
  PropertyEstateLinkingSchema
);

module.exports = PropertyEstateLinking;
