const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const adDetailsSchemaObject = {
  status: defaultString, //0:deleted,1:active
  ownerId: defaultString,
  ownerType: defaultString,
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
const AdDetailsSchema = new mongoose.Schema(adDetailsSchemaObject);

AdDetailsSchema.statics.getSchemaObject = () =>
  adDetailsSchemaObject;
const AdDetails = mongoose.model(
  "AdDetails",
  AdDetailsSchema
);

module.exports = AdDetails;
