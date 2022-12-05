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
const foodRatingSchemaObject = {
  status: defaultString, //0:deleted,1:active
  foodId: defaultString,
  value: defaultRating,
  totalRating: defaultRating,
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
const FoodRatingSchema = new mongoose.Schema(foodRatingSchemaObject);

FoodRatingSchema.statics.getSchemaObject = () =>
  foodRatingSchemaObject;
const FoodRating = mongoose.model(
  "FoodRating",
  FoodRatingSchema
);

module.exports = FoodRating;
