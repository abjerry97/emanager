const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};

const propertyAdPriceSchemaObject = {
  status: defaultString, //0:deleted,1:published,2:unpublished
  value: defaultString,
  type:  defaultString, //0:per sale,1:per lease,2: per rent
  propertyAdId:  defaultString, 
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString, //0:delete,1:added a new category,2:removed a category,3:published,4:unpublished,5:added new option group,6:removed an option group,7:updated an option group
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // admin ID of the admin who created this entry
  createdOn: defaultDate,
};
const PropertyAdPriceSchema = new mongoose.Schema(propertyAdPriceSchemaObject);

PropertyAdPriceSchema.statics.getSchemaObject = () => propertyAdPriceSchemaObject;
const PropertyAdPrice = mongoose.model("PropertyAdPrice", PropertyAdPriceSchema);

module.exports = PropertyAdPrice;
