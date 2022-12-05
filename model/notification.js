const mongoose = require("mongoose");
const Message = require("./message");
const MessageBody = require("./message-body"); 
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const notificationSchemaObject = {
  status: defaultString, //0:deleted,1:active 
  message: { _id: defaultString, ...Message.getSchemaObject() },
  ownerId: defaultString,
  ownerType: defaultString, //0:user,1: admin,2: everyone 
  ownerRole: defaultString,
  OwnerName: defaultString,
  estateId: defaultString,
  kind: defaultString, //0:notice,1: suggestion,2: forum
  isDefault: defaultString, //0:notice,1: suggestion,2: forum
  createdOn: defaultDate,
  expiredOn: defaultDate,
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
};
const NotificationSchema = new mongoose.Schema(notificationSchemaObject);

NotificationSchema.statics.getSchemaObject = () => notificationSchemaObject;
const Notification = mongoose.model("NotificationSchema", NotificationSchema);

module.exports = Notification;
