const mongoose = require("mongoose");
const Name = require("./name");
const Email = require("./email");
const PhoneNumber = require("./phone-number");
const HouseAddressName = require("./house-address");
const BusinessDays = require("./business-days");
const ServiceImage = require("./service-image");
const ServiceAd = require("./service-ad");
const ServiceDetails = require("./service-details");
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
const serviceSchemaObject = {
  status: defaultString, //0:deleted,1:active
  ownerId: defaultString,
  adType:defaultString,
  category:defaultString,
  isPublished:defaultBoolean,
  isApproved:defaultBoolean,
  isActive:defaultBoolean,
  image: [{ _id: defaultString, ...ServiceImage.getSchemaObject() }],
  details: { _id: defaultString, ...ServiceDetails.getSchemaObject() },
  name: { _id: defaultString, ...Name.getSchemaObject() },
  emails: [{ _id: defaultString, ...Email.getSchemaObject() }],
  ads: [{ _id: defaultString, ...ServiceAd.getSchemaObject() }],
  phoneNumbers: [{ _id: defaultString, ...PhoneNumber.getSchemaObject() }],
  serviceAddress: [
    { _id: defaultString, ...HouseAddressName.getSchemaObject() },
  ],
  operatingDays: [{ _id: defaultString, ...BusinessDays.getSchemaObject() }],
  isAvailiable: defaultString, //0:deleted,1:active
  createdOn: defaultDate,
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // admin ID of the admin who created this entry
};
const ServiceSchema = new mongoose.Schema(serviceSchemaObject);

ServiceSchema.statics.getSchemaObject = () => serviceSchemaObject;
const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
