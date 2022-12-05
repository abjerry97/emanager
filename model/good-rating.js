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
const goodRatingSchemaObject = {
  status: defaultString, //0:deleted,1:active
  goodId: defaultString,
  value: defaultRating,
  totalRating: defaultString, 
  totalNumberOfRating: defaultRating,
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
const GoodRatingSchema = new mongoose.Schema(goodRatingSchemaObject);

GoodRatingSchema.statics.getSchemaObject = () =>
  goodRatingSchemaObject;
const GoodRating = mongoose.model(
  "GoodRating",
  GoodRatingSchema
);

module.exports = GoodRating;
