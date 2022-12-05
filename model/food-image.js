const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const foodImageSchemaObject = {
  status: defaultString, //0:deleted,1:active
  foodId: defaultString,
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
const FoodImageSchema = new mongoose.Schema(foodImageSchemaObject);

FoodImageSchema.statics.getSchemaObject = () =>
  foodImageSchemaObject;
const FoodImage = mongoose.model(
  "FoodImage",
  FoodImageSchema
);

module.exports = FoodImage;
