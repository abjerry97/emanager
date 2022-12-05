const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const goodFavouriteSchemaObject = {
  status: defaultString, //0:deleted,1:active
  goodId: defaultString,
  userId: defaultString,
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
const GoodFavouriteSchema = new mongoose.Schema(goodFavouriteSchemaObject);

GoodFavouriteSchema.statics.getSchemaObject = () =>
  goodFavouriteSchemaObject;
const GoodFavourite = mongoose.model(
  "GoodFavourite",
  GoodFavouriteSchema
);

module.exports = GoodFavourite;
