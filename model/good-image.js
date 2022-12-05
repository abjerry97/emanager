const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const goodImageSchemaObject = {
  status: defaultString, //0:deleted,1:active
  goodId: defaultString,
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
const GoodImageSchema = new mongoose.Schema(goodImageSchemaObject);

GoodImageSchema.statics.getSchemaObject = () =>
  goodImageSchemaObject;
const GoodImage = mongoose.model(
  "GoodImage",
  GoodImageSchema
);

module.exports = GoodImage;
