const mongoose = require("mongoose");
const Notification = require("./notification");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const userNotificationsSchemaObject = {
  status: defaultString, //0:deleted,1:active
  total: defaultString,
  unread: defaultString,
  notifications: [{ _id: defaultString, ...Notification.getSchemaObject() }],
  ownerId: defaultString,
  estateId: defaultString,
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
const UserNotificationsSchema = new mongoose.Schema(
  userNotificationsSchemaObject
);

UserNotificationsSchema.statics.getSchemaObject = () =>
  userNotificationsSchemaObject;
const UserNotifications = mongoose.model(
  "UserNotificationsSchema",
  UserNotificationsSchema
);

module.exports = UserNotifications;
