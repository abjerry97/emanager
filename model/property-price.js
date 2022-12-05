const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};

const propertyPriceSchemaObject = {
  status: defaultString, //0:deleted,1:published,2:unpublished
  value: defaultString,
  type:  defaultString, //0:per sale,1:per lease,2: per rent
  propertyId:  defaultString, 
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
const PropertyPriceSchema = new mongoose.Schema(propertyPriceSchemaObject);

PropertyPriceSchema.statics.getSchemaObject = () => propertyPriceSchemaObject;
const PropertyPrice = mongoose.model("PropertyPrice", PropertyPriceSchema);

module.exports = PropertyPrice;
