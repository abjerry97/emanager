const jwt = require("jsonwebtoken");
const { stringIsEqual } = require("../helpers/validators");
const generateTokenAdmin = (admin, estateId) => {
    return jwt.sign(
      {
        _id: admin._id,
        status: admin.status,
        name: admin.name.value,
        role: admin.role,
        userId: admin.userId,
        isTopmost: admin.isTopmost,
        estateId: admin.estateId,
        createdBy: admin.createdBy,
        estateId,
      },
      process.env.JWT_SECRET || "qapitapay1",
      {
        expiresIn: "1d",
      }
    );
  };
  const generateTokenSecurity = (security, estateId) => {
    return jwt.sign(
      {
        _id: security._id,
        status: security.status,
        name: security.name.value,
        estateId: security.estateId,
        createdBy: security.createdBy,
      },
      process.env.JWT_SECRET || "qapitapay1",
      {
        expiresIn: "1d",
      }
    );
  };

  const generateToken = (user, estateId) => {
    return jwt.sign(
      {
        _id: user._id,
        name: user.name.value,
        email: user.emails.filter((x) => {
          return stringIsEqual(x.isPrimary, 1) && stringIsEqual(x.status, 1);
        })[0],
        isAdmin: !!user.ownerType && stringIsEqual(user.ownerType, 1),
        estateId,
      },
      process.env.JWT_SECRET || "qapitapay1",
      {
        expiresIn: "1d",
      }
    );
  };

  const generateWalletToken = (walletSession) => {
    return jwt.sign(
      {
        status: walletSession.status,
        _id: walletSession._id,
        walletId: walletSession.walletId,
        userId: walletSession.userId,
      },
      process.env.JWT_SECRET || "qapitapay1",
      {
        expiresIn: "1d",
      }
    );
  };

  module.exports = {
    generateTokenAdmin,
    generateTokenSecurity,
    generateToken,
    generateWalletToken,
  }