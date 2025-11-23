const validUrl = require("valid-url");

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

module.exports = {
  validateUrl: (url) => validUrl.isWebUri(url),

  validateCode: (code) => CODE_REGEX.test(code),

  CODE_REGEX
};
