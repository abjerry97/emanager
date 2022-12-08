exports.successResponse = function (res, msg) {
  const data = {
    success: true,
    message: msg,
  };
  return res.status(200).json(data);
};

exports.successResponseWithData = function (res, msg, key, data) {
  const resData = {
    success: true,
    message: msg,
  };
  resData[key] = data;
  return res.status(200).json(resData);
};
exports.successResponseAccepted = function (res, msg, key, data) {
  const resData = {
    success: true,
    message: msg,
  };
  resData[key] = data;
  return res.status(202).json(resData);
};

exports.ErrorResponse = function (res, msg) {
  const data = {
    success: false,
    message: msg,
  };
  return res.status(500).json(data);
};

exports.notFoundResponse = function (res, msg) {
  const data = {
    success: false,
    message: msg,
  };
  return res.status(404).json(data);
};
exports.forbiddenErrorResponse = function (res, msg) {
  const data = {
    success: false,
    message: msg,
  };
  return res.status(403).json(data);
};
exports.noMethodAllowedResponse = function (res, msg) {
  const data = {
    success: false,
    message: msg,
  };
  return res.status(405).json(data);
};

exports.validationErrorWithData = function (res, msg, key, data) {
  const resData = {
    success: false,
    message: msg,
  };

  resData[key] = data;
  return res.status(400).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
  const data = {
    success: false,
    message: msg,
  };
  return res.status(401).json(data);
};
