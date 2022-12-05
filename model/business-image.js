const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const businessImageSchemaObject = {
  status: defaultString, //0:deleted,1:active
  businessId: defaultString,
  url: defaultString,
  default: defaultString,
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
const BusinessImageSchema = new mongoose.Schema(businessImageSchemaObject);

BusinessImageSchema.statics.getSchemaObject = () =>
  businessImageSchemaObject;
const BusinessImage = mongoose.model(
  "BusinessImage",
  BusinessImageSchema
);

module.exports = BusinessImage;
