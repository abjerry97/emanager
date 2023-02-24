const mongoose = require("mongoose"); 
const EmergencyPhoneNumber = require("./emergency-phone-number");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const emergencyDetailsSchemaObject = {
  status: defaultString, //0:inactive,1:active 
  name: defaultString, //user:0,admin:1
  phonenumber:{ _id: defaultString, ...EmergencyPhoneNumber.getSchemaObject() }, 
  excoRole: defaultString, //user:0,admin:1
  estateId: defaultString, //user:0,admin:1
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
  createdOn: defaultDate,
};
const EmergencyDetailsSchema = new mongoose.Schema(emergencyDetailsSchemaObject);

EmergencyDetailsSchema.statics.getSchemaObject = () => emergencyDetailsSchemaObject;
const EmergencyDetails = mongoose.model("EmergencyDetails", EmergencyDetailsSchema);

module.exports = EmergencyDetails;
