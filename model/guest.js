const mongoose = require("mongoose"); 
const GuestPlateNumber = require("./guest-plate-number");
const GuestCompanyName = require("./guest-company-name"); 
const HouseAddressName = require("./house-address");
const GatePass = require("./gate-pass");
const GuestEmail = require("./guest-email");
const GuestPhoneNumber = require("./guest-phone-number");
const GuestName = require("./guest-name");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const guestSchemaObject = {
  status: defaultString, //0:deleted,1:active
  name: { _id: defaultString, ...GuestName.getSchemaObject() },
  estateId: defaultString,
  houseAddress: [{ _id: defaultString, ...HouseAddressName.getSchemaObject() }],
  numberOfGuests: defaultString,
  plateNumber: { _id: defaultString, ...GuestPlateNumber.getSchemaObject() },
  phoneNumber: { _id: defaultString, ...GuestPhoneNumber.getSchemaObject() },
  email: { _id: defaultString, ...GuestEmail.getSchemaObject() },
  companyName: { _id: defaultString, ...GuestCompanyName.getSchemaObject() },
  pass: { _id: defaultString, ...GatePass.getSchemaObject() },
  type: defaultString, //0:Taxi, 1:Dispatch Rider, 2: Guest, 3: Event
  createdOn: defaultDate,
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
};
const GuestSchema = new mongoose.Schema(guestSchemaObject);

GuestSchema.statics.getSchemaObject = () => guestSchemaObject;
const Guest = mongoose.model("Guest", GuestSchema);

module.exports = Guest;
