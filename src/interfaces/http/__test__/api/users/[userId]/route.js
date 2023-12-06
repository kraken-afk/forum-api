const { Send } = require('../../../../core/mod');
const {
  NotFoundError,
} = require('../../../../../../commons/errors/not-found-error');

module.exports = {
  GET: function (req) {
    if (req.params?.userId !== 'xxx') throw new NotFoundError('User not found');

    return Send.new({ name: 'Romeo', age: 19 });
  },

  POST: function (req) {
    throw new Error("Operation couldn't resolve");
  },
};
