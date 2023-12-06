const { Send } = require('../../core/mod');
const { FatalError } = require('../../../../commons/errors/fatal-error');

module.exports = {
  GET: function () {
    return Send.new(
      { name: 'Romeo', age: 19 },
      { headers: { 'X-custom': 'true' } },
    );
  },
  POST: function (req) {
    throw new FatalError('Fatal Error');
  },
};
