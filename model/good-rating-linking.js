const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};

const defaultRating = {
  type: Number,
  default: 0,
};
const goodRatingLinkingSchemaObject = {
  status: defaultString, //0:deleted,1:active
  goodId: defaultString,
  value: defaultRating,
  ownerId: defaultString,
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
const GoodRatingLinkingSchema = new mongoose.Schema(goodRatingLinkingSchemaObject);

GoodRatingLinkingSchema.statics.getSchemaObject = () =>
  goodRatingLinkingSchemaObject;
const GoodRatingLinking = mongoose.model(
  "GoodRatingLinking",
  GoodRatingLinkingSchema
);

module.exports = GoodRatingLinking;
