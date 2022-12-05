const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const adDescriptionSchemaObject = {
  status: defaultString, //0:deleted,1:active
  ownerId: defaultString,
  ownerType: defaultString,
  value:defaultString,
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
const AdDescriptionSchema = new mongoose.Schema(adDescriptionSchemaObject);

AdDescriptionSchema.statics.getSchemaObject = () =>
  adDescriptionSchemaObject;
const AdDescription = mongoose.model(
  "AdDescription",
  AdDescriptionSchema
);

module.exports = AdDescription;
