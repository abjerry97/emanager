const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};

const registeredEstateSchemaObject = {
  status: defaultString, //0:deleted,1:active
  name: defaultString,
  location:defaultString, 
  createdBy: defaultString, // user ID of the user who created this entry
  createdOn: defaultDate,
};

const RegisteredEstateSchema = new mongoose.Schema(registeredEstateSchemaObject);

RegisteredEstateSchema.statics.getSchemaObject = () => registeredEstateSchemaObject;
const RegisteredEstate = mongoose.model("RegisteredEstate", RegisteredEstateSchema);

module.exports = RegisteredEstate;
