const Joi = require("joi");

const validateObjectId = (id) => {
  const schema = Joi.object({ id: Joi.objectId().required() });
  const { error } = schema.validate({ id });

  return error ? error.details[0].message : null;
};

module.exports = validateObjectId;
