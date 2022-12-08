const { Novu } = require("@novu/node");
const novu = new Novu("2b2b16662812303733804185a284b971");
const sendEmailNovuNotification = async (recipient, payload, triggerId) => {
    return sendNovuNotification("email", recipient, payload, triggerId);
  };
  const sendPhoneNovuNotification = async (recipient, payload, triggerId) => {
    return sendNovuNotification("email", recipient, payload, triggerId);
  };
  const sendNovuNotification = async (type, recipient, payload, triggerId) => {
    const toObj = {
      subscriberId: recipient,
    };
    toObj[`${type}`] = recipient;
    try {
      let response = await novu.trigger(triggerId, {
        to: toObj,
        payload: {
          data: payload,
        },
      });
      return response;
    } catch (err) {
      return err;
    }
  };

  module.exports = {
    sendEmailNovuNotification,
    sendPhoneNovuNotification
  }