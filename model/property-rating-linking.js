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

const foodRatingLinkingSchemaObject = {
  status: defaultString, //0:deleted,1:active
  foodId: defaultString,
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
const FoodRatingLinkingSchema = new mongoose.Schema(foodRatingLinkingSchemaObject);

FoodRatingLinkingSchema.statics.getSchemaObject = () =>
  foodRatingLinkingSchemaObject;
const FoodRatingLinking = mongoose.model(
  "FoodRatingLinking",
  FoodRatingLinkingSchema
);

module.exports = FoodRatingLinking;
