const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const businessDetailsSchemaObject = {
  status: defaultString, //0:deleted,1:active
  businessId: defaultString,
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
const BusinessDetailsSchema = new mongoose.Schema(businessDetailsSchemaObject);

BusinessDetailsSchema.statics.getSchemaObject = () =>
  businessDetailsSchemaObject;
const BusinessDetails = mongoose.model(
  "BusinessDetails",
  BusinessDetailsSchema
);

module.exports = BusinessDetails;
