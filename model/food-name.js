const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const foodNameSchemaObject = {
  status: defaultString, //0:deleted,1:active
  foodId: defaultString,
  value: defaultString,
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
const FoodNameSchema = new mongoose.Schema(foodNameSchemaObject);

FoodNameSchema.statics.getSchemaObject = () => foodNameSchemaObject;
const FoodName = mongoose.model("FoodName", FoodNameSchema);

module.exports = FoodName;
