const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const businessEstateLinkingSchemaObject = {
  status: defaultString, //0:deleted,1:active
  businessId: defaultString,
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
const BusinessEstateLinkingSchema = new mongoose.Schema(businessEstateLinkingSchemaObject);

BusinessEstateLinkingSchema.statics.getSchemaObject = () =>
  businessEstateLinkingSchemaObject;
const BusinessEstateLinking = mongoose.model(
  "BusinessEstateLinking",
  BusinessEstateLinkingSchema
);

module.exports = BusinessEstateLinking;
