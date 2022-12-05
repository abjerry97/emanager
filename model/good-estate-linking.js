const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const goodEstateLinkingSchemaObject = {
  status: defaultString, //0:deleted,1:active
  goodId: defaultString,
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
const GoodEstateLinkingSchema = new mongoose.Schema(goodEstateLinkingSchemaObject);

GoodEstateLinkingSchema.statics.getSchemaObject = () =>
  goodEstateLinkingSchemaObject;
const GoodEstateLinking = mongoose.model(
  "GoodEstateLinking",
  GoodEstateLinkingSchema
);

module.exports = GoodEstateLinking;
