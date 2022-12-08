const { isValidMongoObject, isValidMongoObjectId } = require("../../helpers/validators");
const EmanagerUserWalletSession = require("../../model/emanager-user-wallet-session");
const CreateQpayCustomerObject = async function (user, estateId, password) {
    const formatedUser = {
      name: (user.name && user.name.value) || "",
      email:
        !!user && !!user.emails && Array.isArray(user.emails)
          ? user.emails.find((email) =>
              stringIsEqual(!!email.isPrimary && email.isPrimary, 1)
            )
          : "",
      phoneNumber:
        !!user && !!user.phoneNumbers && Array.isArray(user.phoneNumbers)
          ? user.phoneNumbers.find((phoneNumber) =>
              stringIsEqual(!!phoneNumber.isPrimary && phoneNumber.isPrimary, 1)
            )
          : "",
      houseAddress:
        !!user && !!user.houseAddress && Array.isArray(user.houseAddress)
          ? user.houseAddress.find((houseAddress) =>
              stringIsEqual(estateId, houseAddress.estateId)
            )?.value
          : "",
      _id: user._id,
    };
  
    // const userPassword = await Password.findOne({
    //   status:"1",
    //   ownerId: user._id
    // })
  
    // if (!isValidMongoObject(userPassword)) {
    //   return res.json({
    //     success: false,
    //     message: "Sorry!!...Invalid Password",
    //   });
    // }
  
    return {
      firstname: formatedUser.name.split(" ", 2)[0] || "",
      lastname: formatedUser.name.split(" ", 2)[1] || "",
      email: formatedUser.email.value,
      phone:
        `${formatedUser.phoneNumber.countryCode}` +
        `${formatedUser.phoneNumber.value}`,
      pin: password,
      location: `Latitude: 3.4555587,Longitude: 6.7534736`,
    };
  };
  
  
  
   
  
  const checkWalletUserSession = async (user) => {
    const userWalletSession = await EmanagerUserWalletSession.findOne({
      status: 1,
      userId: user._id,
    });
    if (!isValidMongoObject(userWalletSession)) {
      return { message: "Wallet Session not found" };
    }
    return userWalletSession;
  };
  const checkEstateWalletSession = async (estate) => {
    const userWalletSession = await EmanagerUserWalletSession.findOne({
      status: 1,
      userId: estate._id,
    });
    if (!isValidMongoObject(userWalletSession)) {
      return { message: "Wallet Session not found" };
    }
    return userWalletSession;
  };

  
  module.exports = {
    CreateQpayCustomerObject,
    checkEstateWalletSession,
    checkWalletUserSession

  }