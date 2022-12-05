const mongoose = require("mongoose");
const MessageBody = require("./message-body"); 
const MessageSubject = require("./message-subject");
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
const userNotificationLinkingSchemaObject = {
  status: defaultString, //0:deleted,1:active 
  contextId: defaultString,
  ownerId: defaultString,
  isRead: defaultBoolean,
  kind: defaultString, //0:notice,1: suggestion,2: forum
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
const UserNotificationLinkingSchema = new mongoose.Schema(userNotificationLinkingSchemaObject);

UserNotificationLinkingSchema.statics.getSchemaObject = () => userNotificationLinkingSchemaObject;
const UserNotificationLinking = mongoose.model("UserNotificationLinkingSchema", UserNotificationLinkingSchema);

module.exports = UserNotificationLinking;
