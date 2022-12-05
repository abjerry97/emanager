const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const foodEstateLinkingSchemaObject = {
  status: defaultString, //0:deleted,1:active
  foodId: defaultString,
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
const FoodEstateLinkingSchema = new mongoose.Schema(foodEstateLinkingSchemaObject);

FoodEstateLinkingSchema.statics.getSchemaObject = () =>
  foodEstateLinkingSchemaObject;
const FoodEstateLinking = mongoose.model(
  "FoodEstateLinking",
  FoodEstateLinkingSchema
);

module.exports = FoodEstateLinking;
