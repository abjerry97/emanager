const { isValid } = require("valid-objectid");
const { isHashedString } = require("../../helpers/tools");
const {
  stringIsEqual,
  isValidMongoObject,
  isValidArrayOfMongoObject,
  isValidMongoObjectId,
  isValidPhonenumber,
  isEmail,
  isValidFullName,
  isValidPassword,
} = require("../../helpers/validators");
const AdminNotificationLinking = require("../../model/admin-notification-linking");
const Business = require("../../model/business");
const Candidate = require("../../model/candidate");
const Email = require("../../model/email");
const HouseAddressName = require("../../model/house-address");
const Message = require("../../model/message");
const MessageBody = require("../../model/message-body");
const MessageSubject = require("../../model/message-subject");
const Name = require("../../model/name");
const NotificationScheama = require("../../model/notification");
const Password = require("../../model/password");
const PhoneNumber = require("../../model/phone-number");
const User = require("../../model/user");
const UserEstate = require("../../model/user-estate"); 

const Authentication = require("../Authentication/auth");

class Suggestion extends Authentication {
  constructor(req, res, next) {
    super();
    this.req = req;
    this.res = res;
    this.next = next;
  }
 
  async __userCreateSuggestion() {
    const createdOn = new Date();
    // validate request
    const user = this.res.user || {};
    const { _id: userId = "" } = user;
    if (!isValidMongoObject(user)) {
      return this.res.json({
        success: false,
        message: "sorry, user not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(userId)) {
      return this.res.json({
        success: false,
        message: "oops!...Invalid user Id",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "oops!...Invalid estate id",
      });
    }

    const noticeSubject = this.req.body.subject || "";
    const noticeMessage = this.req.body.message || "";
    if (noticeSubject.length < 3) {
      return this.res.json({
        success: false,
        message: "oops!...invalid subject",
      });
    }
    if (noticeMessage.length < 3) {
      return this.res.json({
        success: false,
        message: "oops!...invalid message",
      });
    }

    const newMessageSubject = await new MessageSubject({
      status: 1, //0:deleted,1:active
      value: noticeSubject,
      createdOn,
      createdBy: userId,
    });
    if (!isValidMongoObject(newMessageSubject)) {
      return this.res.json({
        success: false,
        message: "oops!...error creating message subject",
      });
    }

    const newMessageBody = await new MessageBody({
      status: 1, //0:deleted,1:active
      subjectId: newMessageSubject._id,
      value: noticeMessage,
      createdOn,
      createdBy: userId,
    });
    if (!isValidMongoObject(newMessageBody)) {
      return this.res.json({
        success: false,
        message: "oops!...error creating message body",
      });
    }

    const newMessage = await new Message({
      status: 1, //0:deleted,1:active
      createdOn,
      createdBy: userId,
    });
    if (!isValidMongoObject(newMessage)) {
      return this.res.json({
        success: false,
        message: "oops!...error creating Message",
      });
    }

    const newNotification = await new NotificationScheama({
      status: 1, //0:deleted,1:active
      createdOn,
      ownerId: estateId,
      ownerType: 0,
      isDefault: 0,
      ownerRole: 0,
      OwnerName: user.name.value,
      estateId,
      kind: 1, //0:notice,1: suggestion,2: forum
      createdBy: userId,
    });
    if (!isValidMongoObject(newNotification)) {
      return this.res.json({
        success: false,
        message: "oops!...error creating Notification",
      });
    }

    newMessageSubject.messageId = newMessage._id;
    newMessageBody.messageId = newMessage._id;

    newMessage.subject = newMessageSubject;
    newMessage.value = newMessageBody;
    newMessage.contextId = newNotification._id;
    newNotification.message = newMessage;
    await newMessageSubject.save();
    await newMessageBody.save();
    await newMessage.save();
    await newNotification.save();

    const allEstateAdmins= await UserEstate.find({
      status: 1,
      estateId,
      ownerType:1
    });

    if (!isValidArrayOfMongoObject(allEstateAdmins)) {
      return this.res.json({
        success: false,
        message: "oops!...Estate Admins not found",
      });
    }
    (allEstateAdmins|| []).map(async (user, index) => {
      try {
        const newAdminNotificationLinking = await new AdminNotificationLinking({
          status: 1,
          ownerId: user.ownerId,
          contextId: newNotification._id,
          isRead: false,
          kind: 1, //0:notice,1: suggestion,2: forum
          createdOn,
          createdBy: userId,
        });

        await newAdminNotificationLinking.save();
      } catch (error) {
        console.log(error);
      }
    });

    return this.res.json({
      success: true,
      message: "Suggestion created  Succesfully",
    });
  }
 
}
module.exports = Suggestion;
