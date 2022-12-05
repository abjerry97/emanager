const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const adImageSchemaObject = {
  status: defaultString, //0:deleted,1:active
  ownerId: defaultString,
  ownerType: defaultString,
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
const AdImageSchema = new mongoose.Schema(adImageSchemaObject);

AdImageSchema.statics.getSchemaObject = () =>
  adImageSchemaObject;
const AdImage = mongoose.model(
  "AdImage",
  AdImageSchema
);

module.exports = AdImage;
