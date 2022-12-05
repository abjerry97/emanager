const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const propertyFavouriteSchemaObject = {
  status: defaultString, //0:deleted,1:active
  propertyId: defaultString,
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
const PropertyFavouriteSchema = new mongoose.Schema(propertyFavouriteSchemaObject);

PropertyFavouriteSchema.statics.getSchemaObject = () =>
  propertyFavouriteSchemaObject;
const PropertyFavourite = mongoose.model(
  "PropertyFavourite",
  PropertyFavouriteSchema
);

module.exports = PropertyFavourite;
