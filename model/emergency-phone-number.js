const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const defaultBoolean = {
  type: Boolean,
  default: false,
};
const emergencyPhoneNumberSchemaObject = {
  status: defaultString, //0:deleted,1:is verified,2:not verified
  countryCode: defaultString,
  value: defaultString, 
  isVerified: defaultBoolean,
  emergencyDetailsId: defaultString,  
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
const EmergencyPhoneNumberSchema = new mongoose.Schema(emergencyPhoneNumberSchemaObject);

EmergencyPhoneNumberSchema.statics.getSchemaObject = () => emergencyPhoneNumberSchemaObject;
const EmergencyPhoneNumber = mongoose.model("EmergencyPhoneNumber", EmergencyPhoneNumberSchema);

module.exports = EmergencyPhoneNumber;
