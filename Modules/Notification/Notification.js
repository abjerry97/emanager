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
const UserNotificationLinking = require("../../model/user-notification-linking");
const UserNotifications = require("../../model/user-notifications");

const Authentication = require("../Authentication/auth");

class Notification extends Authentication {
  constructor(req, res, next) {
    super();
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async __adminCreateForum() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;
    if (!isValidMongoObject(admin)) {
      return this.res.json({
        success: false,
        message: "sorry, admin not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(adminId)) {
      return this.res.json({
        success: false,
        message: "oops!...Invalid admin Id",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "oops!...Invalid estate id",
      });
    }

    const noticeSubject = this.req.body.subject || "Estate Forum";
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
      createdBy: adminId,
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
      createdBy: adminId,
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
      createdBy: adminId,
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
      ownerType: 1,
      isDefault: 0,
      ownerRole: admin.role,
      OwnerName: admin.name.value,
      estateId,
      kind: 0, //0:notice,1: suggestion,2: forum
      createdBy: adminId,
    });
    if (!isValidMongoObject(newNotification)) {
      return this.res.json({
        success: false,
        message: "oops!...error creating Forum",
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

    const allEstateUsers = await UserEstate.find({
      status: 1,
      estateId,
      ownerType:0
    });

    if (!isValidArrayOfMongoObject(allEstateUsers)) {
      return this.res.json({
        success: false,
        message: "oops!...Estate Users not found",
      });
    }
    (allEstateUsers || []).map(async (user, index) => {
      try {
        const newUserNotificationLinking = await new UserNotificationLinking({
          status: 1,
          ownerId: user.ownerId,
          contextId: newNotification._id,
          isRead: false,
          kind: 0, //0:notice,1: suggestion,2: forum
          createdOn,
          createdBy: adminId,
        });

        await newUserNotificationLinking.save();
      } catch (error) {
        console.log(error);
      }
    });

    return this.res.json({
      success: true,
      message: "Forum created  Succesfully",
    });
  }

  async __adminCreateDefaultNotice() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;
    if (!isValidMongoObject(admin)) {
      return this.res.json({
        success: false,
        message: "sorry, admin not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(adminId)) {
      return this.res.json({
        success: false,
        message: "oops!...Invalid admin Id",
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
      createdBy: adminId,
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
      createdBy: adminId,
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
      createdBy: adminId,
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
      ownerType: 1,
      isDefault: 1,
      ownerRole: admin.role,
      OwnerName: admin.name.value,
      estateId,
      kind: 0, //0:notice,1: suggestion,2: forum
      createdBy: adminId,
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

    const allEstateUsers = await UserEstate.find({
      status: 1,
      estateId,
      ownerType:0
    });

    if (!isValidArrayOfMongoObject(allEstateUsers)) {
      return this.res.json({
        success: false,
        message: "oops!...Estate Users not found",
      });
    }
    (allEstateUsers || []).map(async (user, index) => {
      try {
        const newUserNotificationLinking = await new UserNotificationLinking({
          status: 1,
          ownerId: user.ownerId,
          contextId: newNotification._id,
          isRead: false,
          kind: 0, //0:notice,1: suggestion,2: forum
          createdOn,
          createdBy: adminId,
        });

        await newUserNotificationLinking.save();
      } catch (error) {
        console.log(error);
      }
    });

    return this.res.json({
      success: true,
      message: "Notification created  Succesfully",
    });
  }

  // user

  async __userReadNotice() {
    const createdOn = new Date();
    // validate request
    const user = this.res.user || {};
    const { _id: userId = "" } = user;
    const { noticeId = "" } = this.req.params;
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
    if (!isValidMongoObjectId(noticeId)) {
      return this.res.json({
        success: false,
        message: "oops!...Invalid notice Id",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "oops!...Invalid estate id",
      });
    }

    const existingUserNoticeLinking = await UserNotificationLinking.findOne({
      status: 1,
      ownerId: userId,
      estateId,
      contextId:noticeId
    });

    if (!isValidMongoObject(existingUserNoticeLinking)) {
      return this.res.json({
        success: false,
        message: "oops!...Notice not found ",
      });
    }

    try {
      const updateExistingUserNoticeLinking =
        await UserNotificationLinking.updateOne(
          {
            status: 1,
            ownerId: userId,
            estateId,
            contextId:noticeId
          },
          { $set: { isRead: true } }
        );
 
    } catch (error) {
      console.log(error);
    }

    const currentUserNotificationLinkingCount =
      await UserNotificationLinking.countDocuments({
        status: "1",
        ownerId: userId,
        isRead: false,
        estateId,
      });

    if (isNaN(currentUserNotificationLinkingCount)) {
      return this.res.json({
        success: false,
        message: "Sorry!!...Notification count process error",
      });
    }

    this.res.notificationCount = currentUserNotificationLinkingCount;

    return this.res.json({
      success: true,
      message: "Notification read  Succesfully",
    });
  }


  async __userGetNotication() {
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
 
 
const userNotifications = await UserNotifications.findOne({
  status:1,
  estateId,
  ownerId:userId
})
if (!isValidMongoObject(userNotifications)) {
  return this.res.json({
    success: false,
    message: "oops!...Notification not found",
  });
}


    return this.res.json({
      success: true,
      message: "Notification gotten  Succesfully",
      notification: userNotifications,
    });
  }
  async __userGetNoticationLinking() {
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
 
 
const userNotificationLinking= await UserNotificationLinking.find({
  status:1,
  estateId,
  ownerId:userId
})
if (!isValidArrayOfMongoObject(userNotificationLinking)) {
  return this.res.json({
    success: false,
    message: "oops!...Notification linking not found",
  });
}


    return this.res.json({
      success: true,
      message: "Notification linking  Succesfully",
      notificationLinking: userNotificationLinking,
    });
  }

  // admin

  async __adminCreateUserDirectMessage() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;

    let { subjectId: selectedSubjectId } =
      (this.req.params && this.req.params) || null;
    if (!isValidMongoObject(admin)) {
      return this.res.json({
        success: false,
        message: "sorry, admin not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(selectedSubjectId)) {
      return this.res.json({
        success: false,
        message: "oops!...Invalid subject Id",
      });
    }
    if (!isValidMongoObjectId(adminId)) {
      return this.res.json({
        success: false,
        message: "oops!...Invalid admin Id",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "oops!...Invalid estate id",
      });
    }

    const foundUserEstate = await UserEstate({
      status: 1,
      estateId,
      ownerId: selectedSubjectId,
    });

    if (!isValidMongoObject(foundUserEstate)) {
      return this.res.json({
        success: false,
        message: "sorry, User does not belong under this estate",
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

    const newMessageHeader = await new MessageHeader({
      status: 1, //0:deleted,1:active
      createdOn,
      createdBy: adminId,
    });
    if (!isValidMongoObject(newMessageHeader)) {
      return this.res.json({
        success: false,
        message: "oops!...error creating message header",
      });
    }

    const newMessageSubject = await new MessageSubject({
      status: 1, //0:deleted,1:active
      headerId: newMessageHeader._id,
      value: noticeSubject,
      createdOn,
      createdBy: adminId,
    });
    if (!isValidMongoObject(newMessageSubject)) {
      return this.res.json({
        success: false,
        message: "oops!...error creating message subject",
      });
    }

    const newMessageBody = await new MessageBody({
      status: 1, //0:deleted,1:active
      headerId: newMessageHeader._id,
      subjectId: newMessageSubject._id,
      value: noticeMessage,
      createdOn,
      createdBy: adminId,
    });
    if (!isValidMongoObject(newMessageBody)) {
      return this.res.json({
        success: false,
        message: "oops!...error creating message body",
      });
    }

    const newNotification = await new NotificationScheama({
      status: 1, //0:deleted,1:active
      createdOn,
      ownerId: selectedSubjectId,
      ownerType: 0,
      ownerRole: admin.role,
      OwnerName: admin.name.value,
      estateId,
      kind: 1, //0:notice,1: suggestion,2: forum
      createdBy: adminId,
    });
    if (!isValidMongoObject(newNotification)) {
      return this.res.json({
        success: false,
        message: "oops!...error creating Message",
      });
    }

    newMessageSubject.contextId = newNotification._id;
    newMessageHeader.contextId = newNotification._id;
    newMessageBody.contextId = newNotification._id;

    newNotification.header = newMessageHeader;
    newNotification.subject = newMessageSubject;
    newNotification.message = newMessageBody;

    await newMessageHeader.save();
    await newMessageSubject.save();
    await newMessageBody.save();
    await newNotification.save();

    return this.res.json({
      success: true,
      message: "Message sent  Succesfully",
    });
  }
  async __createForum() {
    const createdOn = new Date();
    // validate request
    const admin = this.res.admin || {};
    const { _id: adminId = "" } = admin;

    let { subjectId: selectedSubjectId } =
      (this.req.params && this.req.params) || null;
    if (!isValidMongoObject(admin)) {
      return this.res.json({
        success: false,
        message: "sorry, admin not found!!!",
      });
    }
    const { _id: estateId } = this.res.estate || "";

    if (!isValidMongoObjectId(selectedSubjectId)) {
      return this.res.json({
        success: false,
        message: "oops!...Invalid subject Id",
      });
    }
    if (!isValidMongoObjectId(adminId)) {
      return this.res.json({
        success: false,
        message: "oops!...Invalid admin Id",
      });
    }
    if (!isValidMongoObjectId(estateId)) {
      return this.res.json({
        success: false,
        message: "oops!...Invalid estate id",
      });
    }

    const foundUserEstate = await UserEstate({
      status: 1,
      estateId,
      ownerId: selectedSubjectId,
    });

    if (!isValidMongoObject(foundUserEstate)) {
      return this.res.json({
        success: false,
        message: "sorry, User does not belong under this estate",
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

    const newMessageHeader = await new MessageHeader({
      status: 1, //0:deleted,1:active
      createdOn,
      createdBy: adminId,
    });
    if (!isValidMongoObject(newMessageHeader)) {
      return this.res.json({
        success: false,
        message: "oops!...error creating message header",
      });
    }

    const newMessageSubject = await new MessageSubject({
      status: 1, //0:deleted,1:active
      headerId: newMessageHeader._id,
      value: noticeSubject,
      createdOn,
      createdBy: adminId,
    });
    if (!isValidMongoObject(newMessageSubject)) {
      return this.res.json({
        success: false,
        message: "oops!...error creating message subject",
      });
    }

    const newMessageBody = await new MessageBody({
      status: 1, //0:deleted,1:active
      headerId: newMessageHeader._id,
      subjectId: newMessageSubject._id,
      value: noticeMessage,
      createdOn,
      createdBy: adminId,
    });
    if (!isValidMongoObject(newMessageBody)) {
      return this.res.json({
        success: false,
        message: "oops!...error creating message body",
      });
    }

    const newNotification = await new NotificationScheama({
      status: 1, //0:deleted,1:active
      createdOn,
      ownerId: selectedSubjectId,
      ownerType: 0,
      ownerRole: admin.role,
      OwnerName: admin.name.value,
      estateId,
      kind: 1, //0:notice,1: suggestion,2: forum
      createdBy: adminId,
    });
    if (!isValidMongoObject(newNotification)) {
      return this.res.json({
        success: false,
        message: "oops!...error creating Message",
      });
    }

    newMessageSubject.contextId = newNotification._id;
    newMessageHeader.contextId = newNotification._id;
    newMessageBody.contextId = newNotification._id;

    newNotification.header = newMessageHeader;
    newNotification.subject = newMessageSubject;
    newNotification.message = newMessageBody;

    await newMessageHeader.save();
    await newMessageSubject.save();
    await newMessageBody.save();
    await newNotification.save();

    return this.res.json({
      success: true,
      message: "Message sent  Succesfully",
    });
  }
}
module.exports = Notification;
