const Admin = require("../model/admin");
const Business = require("../model/business");
const BusinessEstateLinking = require("../model/business-estate-linking");
const Email = require("../model/email");
const EmailVerify = require("../model/email-verify");
const Food = require("../model/food");
const FoodEstateLinking = require("../model/food-estate-linking");
const Good = require("../model/good");
const GoodEstateLinking = require("../model/good-estate-linking");
const HouseAddressName = require("../model/house-address");
const Name = require("../model/name");
const Notification = require("../model/notification");
const Password = require("../model/password");
const PhoneNumber = require("../model/phone-number");
const Property = require("../model/property");
const PropertyEstateLinking = require("../model/property-estate-linking");
const RegisteredEstate = require("../model/registered-estate");
const Security = require("../model/security");
const User = require("../model/user");
const UserEstate = require("../model/user-estate");
const UserFamily = require("../model/user-family");
const UserMode = require("../model/user-mode");
const UserNotificationLinking = require("../model/user-notification-linking");
const UserNotifications = require("../model/user-notifications");
const { registeredEstateScheama, userScheama, adminScheama } = require("./projections");
const {
  isValidMongoObject,
  isValidArrayOfMongoObject,
} = require("./validators");

const queryData = (model, method, query, projection, pageSize, page, sort) => {
  try {
    return model[method](query, projection)
      .limit(pageSize)
      .skip(pageSize * page)
      .sort(sort);
  } catch (error) {
    console.log(error);
  }
};

const findUsers = async (query, pageSize, page, sort, cb) => {
  const data = await queryData(
    User,
    "find",
    query,
    userScheama,
    pageSize,
    page,
    sort
  );
  if (!isValidArrayOfMongoObject(data)) {
    return null;
  }
  return data;
};
const findUser = async (query, pageSize, page, sort) => {
  const data = await queryData(
    User,
    "findOne",
    query,
    userScheama,
    pageSize,
    page,
    sort
  );
  if (!isValidMongoObject(data)) {
    return null;
  }
  return data;
};
const findAdmin = async (query, pageSize, page, sort) => {
  const data = await queryData(
    Admin,
    "findOne",
    query,
    adminScheama,
    pageSize,
    page,
    sort
  );
  if (!isValidMongoObject(data)) {
    return null;
  }
  return data;
};
const findSecurity = async (query, pageSize, page, sort) => {
  const data = await queryData(
    Security,
    "findOne",
    query,
    {},
    pageSize,
    page,
    sort
  );
  if (!isValidMongoObject(data)) {
    return null;
  }
  return data;
};

const findAdmins = async (query, pageSize, page, sort, cb) => {
  const data = await queryData(
    Admin,
    "find",
    query,
    adminScheama,
    pageSize,
    page,
    sort
  );
  if (!isValidArrayOfMongoObject(data)) {
    return null;
  }
  return data;
};

const createAdmin = async (data) => {
  let newAdmin;
  try {
    newAdmin = await new Admin(data);
  } catch (error) {
    console.log(error);
  }
  if (!isValidMongoObject(newAdmin)) {
    return null;
  }
  return newAdmin;
};
const createUser = async (data) => {
  let newUser;
  try {
    newUser = await new User(data);
  } catch (error) {
    console.log(error);
  }
  if (!isValidMongoObject(newUser)) {
    return null;
  }
  return newUser;
};
const createEstate = async (data) => {
  let newEstate;
  try {
    newEstate = await new RegisteredEstate(data);
  } catch (error) {
    console.log(error);
  }
  if (!isValidMongoObject(newEstate)) {
    return null;
  }
  return newEstate;
};
const findEstates = async (query, pageSize, page, sort) => {
  const data = await queryData(
    RegisteredEstate,
    "find",
    query,
    registeredEstateScheama,
    pageSize,
    page,
    sort
  );
  if (!isValidArrayOfMongoObject(data) || data.length < 1) {
    return null;
  }
  return data;
};

const findEstate = async (query, pageSize, page, sort) => {
  const data = await queryData(
    RegisteredEstate,
    "findOne",
    query,
    registeredEstateScheama,
    pageSize,
    page,
    sort
  );
  if (!isValidMongoObject(data)) {
    return null;
  }
  return data;
};

const createName = async (data) => {
  let newName;
  try {
    newName = await new Name(data);
  } catch (error) {
    console.log(error);
  }
  if (!isValidMongoObject(newName)) {
    return null;
  }
  return newName;
};

const findName = async (query, pageSize, page, sort) => {
  const data = await queryData(
    Name,
    "findOne",
    query,
    {},
    pageSize,
    page,
    sort
  );
  if (!isValidMongoObject(data)) {
    return null;
  }
  return data;
};
const findEmail = async (query, pageSize, page, sort) => {
  const data = await queryData(
    Email,
    "findOne",
    query,
    {},
    pageSize,
    page,
    sort
  );
  if (!isValidMongoObject(data)) {
    return null;
  }
  return data;
};

const findEmails = async (query, pageSize, page, sort) => {
  const data = await queryData(
    Email,
    "find",
    query,
    {},
    pageSize,
    page,
    sort
  );
  if (!isValidArrayOfMongoObject(data) || data.length < 1) {
    return null;
  }
  return data;
};


const createEmail = async (data) => {
  let newEmail;
  try {
    newEmail = await new Email(data);
  } catch (error) {
    console.log(error);
  }
  if (!isValidMongoObject(newEmail)) {
    return null;
  }
  return newEmail;
};

const findPassword = async (query, pageSize, page, sort) => {
  const data = await queryData(
    Password,
    "findOne",
    query,
    {},
    pageSize,
    page,
    sort
  );
  if (!isValidMongoObject(data)) {
    return null;
  }
  return data;
};
const findPhoneNumber = async (query, pageSize, page, sort) => {
  const data = await queryData(
    PhoneNumber,
    "findOne",
    query,
    {},
    pageSize,
    page,
    sort
  );
  if (!isValidMongoObject(data)) {
    return null;
  }
  return data;
};

const createPhoneNumber = async (data) => {
  let newPhoneNumber;
  try {
    newPhoneNumber = await new PhoneNumber(data);
  } catch (error) {
    console.log(error);
  }
  if (!isValidMongoObject(newPhoneNumber)) {
    return null;
  }
  return newPhoneNumber;
};
const createPassword = async (data) => {
  let newPassword;
  try {
    newPassword = await new Password(data);
  } catch (error) {
    console.log(error);
  }
  if (!isValidMongoObject(newPassword)) {
    return null;
  }
  return newPassword;
};
const createHouseAddress = async (data) => {
  let newHouseAddress;
  try {
    newHouseAddress = await new HouseAddressName(data);
  } catch (error) {
    console.log(error);
  }
  if (!isValidMongoObject(newHouseAddress)) {
    return null;
  }
  return newHouseAddress;
};

const findHouseAddress = async (query, pageSize, page, sort, cb) => {
  const data = await queryData(
    HouseAddressName,
    "findOne",
    query,
    {},
    pageSize,
    page,
    sort
  );
  if (!isValidMongoObject(data)) {
    return null;
  }
  return data;
};
const createUserEstate = async (data) => {
  let newUserEstate;
  try {
    newUserEstate = await new UserEstate(data);
  } catch (error) {
    console.log(error);
  }
  if (!isValidMongoObject(newUserEstate)) {
    return null;
  }
  return newUserEstate;
};
const createUserMode = async (data) => {
  let newUserUserMode;
  try {
    newUserUserMode = await new UserMode(data);
  } catch (error) {
    console.log(error);
  }
  if (!isValidMongoObject(newUserUserMode)) {
    return null;
  }
  return newUserUserMode;
}; 
const createUserFamily = async (data) => {
  let newUserFamily;
  try {
    newUserFamily = await new UserFamily(data);
  } catch (error) {
    console.log(error);
  }
  if (!isValidMongoObject(newUserFamily)) {
    return null;
  }
  return newUserFamily;
}; 

const createUserNotifications = async (data) => {
  let newUserNotifications;
  try {
    newUserNotifications = await new UserNotifications(data);
  } catch (error) {
    console.log(error);
  }
  if (!isValidMongoObject(newUserNotifications)) {
    return null;
  }
  return newUserNotifications;
}; 

const findUserNotification = async (query, pageSize, page, sort, cb) => {
  const data = await queryData(
    UserNotifications,
    "findOne",
    query,
    {},
    pageSize,
    page,
    sort
  );
  if (!isValidMongoObject(data)) {
    return null;
  }
  return data;
};

const createEmailVerify = async (data) => {
  let newlyCreatedEmailVerify;
  try {
    newlyCreatedEmailVerify = await new EmailVerify(data);
  } catch (error) {
    console.log(error);
  }
  if (!isValidMongoObject(newlyCreatedEmailVerify)) {
    return null;
  }
  return newlyCreatedEmailVerify;
}; 


const findNotifications = async (query, pageSize, page, sort, cb) => {
  const data = await queryData(
    Notification,
    "find",
    query,
    {},
    pageSize,
    page,
    sort
  );
  if (!isValidArrayOfMongoObject(data)) {
    return null;
  }
  return data;
};
const findNotification = async (query, pageSize, page, sort, cb) => {
  const data = await queryData(
    Notification,
    "findOne",
    query,
    {},
    pageSize,
    page,
    sort
  );
  if (!isValidMongoObject(data)) {
    return null;
  }
  return data;
};
const findUserEstate = async (query, pageSize, page, sort, cb) => {
  const data = await queryData(
    UserEstate,
    "findOne",
    query,
    {},
    pageSize,
    page,
    sort
  );
  if (!isValidMongoObject(data)) {
    return null;
  }
  return data;
}
const findUserFamily = async (query, pageSize, page, sort, cb) => {
  const data = await queryData(
    UserFamily,
    "findOne",
    query,
    {},
    pageSize,
    page,
    sort
  );
  if (!isValidMongoObject(data)) {
    return null;
  }
  return data;
};
const updateNotification = async (query, pageSize, page, sort, cb) => {
  const data = await queryData(
    Notification,
    "updateOne",
    query,
    {},
    pageSize,
    page,
    sort
  ); 
  return data;
};
const findUserNotificationLinkings = async (query, pageSize, page, sort, cb) => {
  const data = await queryData(
    UserNotificationLinking,
    "find",
    query,
    {},
    pageSize,
    page,
    sort
  );
  if (!isValidArrayOfMongoObject(data)) {
    return null;
  }
  return data;
};

const userNotificationLinkingCount = async (query, pageSize, page, sort, cb) => {
  const data = await UserNotificationLinking.countDocuments(query)
  if (isNaN(data)) {
    return null;
  }
  return data;
};

const estateFoodCount = async (query, pageSize, page, sort, cb) => {
  const data = await FoodEstateLinking.countDocuments(query)
  if (isNaN(data)) {
    return null;
  }
  return data;
};

const foodCount = async (query, pageSize, page, sort, cb) => {
  const data = await Food.countDocuments(query)
  if (isNaN(data)) {
    return null;
  }
  return data;
};

const estateGoodCount = async (query, pageSize, page, sort, cb) => {
  const data = await GoodEstateLinking.countDocuments(query)
  if (isNaN(data)) {
    return null;
  }
  return data;
};

const goodCount = async (query, pageSize, page, sort, cb) => {
  const data = await Good.countDocuments(query)
  if (isNaN(data)) {
    return null;
  }
  return data;
};
const estateBusinessCount = async (query, pageSize, page, sort, cb) => {
  const data = await BusinessEstateLinking.countDocuments(query)
  if (isNaN(data)) {
    return null;
  }
  return data;
};

const businessCount = async (query, pageSize, page, sort, cb) => {
  const data = await Business.countDocuments(query)
  if (isNaN(data)) {
    return null;
  }
  return data;
};

const estatePropertyCount = async (query, pageSize, page, sort, cb) => {
  const data = await PropertyEstateLinking.countDocuments(query)
  if (isNaN(data)) {
    return null;
  }
  return data;
};

const propertyCount = async (query, pageSize, page, sort, cb) => {
  const data = await Property.countDocuments(query)
  if (isNaN(data)) {
    return null;
  }
  return data;
};


const scheamaTools = {
  findUsers,
  findUser,
  findAdmin,
  findAdmins,
  createAdmin,
  createUser,
  findSecurity,
  createEstate,
  findEstates,
  findEstate,
  createName,
  findName,
  findEmail,
  findEmails,
  createEmail,
  findPassword,
  findPhoneNumber,
  createPhoneNumber,
  createPassword,
  createHouseAddress,
  createUserEstate,
  findUserEstate,
  createUserMode,
  createUserFamily,
  findUserFamily,
  createUserNotifications,
  findUserNotification,
  createEmailVerify,
  findNotifications,
  findNotification,
  userNotificationLinkingCount,
  findUserNotificationLinkings,
  updateNotification,
  estateFoodCount,
  foodCount,
  estateGoodCount,
  goodCount,
  estateBusinessCount,
  businessCount,
  estatePropertyCount,
  propertyCount,
  findHouseAddress
};
module.exports = scheamaTools;
