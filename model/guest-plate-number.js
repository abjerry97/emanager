const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};

const guestPlateNumberSchemaObject = {
  status: defaultString, //0:deleted,1:active
  value: defaultString,
  type:defaultString,
  guestId: defaultString,
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

const GuestPlateNumberSchema = new mongoose.Schema(guestPlateNumberSchemaObject);

GuestPlateNumberSchema.statics.getSchemaObject = () => guestPlateNumberSchemaObject;
const GuestPlateNumber = mongoose.model("GuestPlateNumber", GuestPlateNumberSchema);

module.exports = GuestPlateNumber;
