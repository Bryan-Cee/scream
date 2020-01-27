const isEmail = email => {
  const regex = /\w+/;
  return email.match(regex);
};

const isEmpty = string => {
  return string.trim() === "";
};

module.exports = { isEmpty, isEmail };