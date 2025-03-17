const removeObjectProp = (obj, fields) => {
  fields.forEach((field) => {
    if (obj[field]) delete obj[field];
  });
};

module.exports = removeObjectProp;
