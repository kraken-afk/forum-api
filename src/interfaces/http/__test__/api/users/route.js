const { ClientError } = require('../../../../../commons/errors/client-error');
const { Send } = require('../../../core/mod');

module.exports = {
  POST: function (req) {
    const payload = JSON.parse(req.payload);

    if (!('name' in payload)) throw new ClientError('Name must be specified');

    return Send.new({ name: payload.name, id: 'xxx' }, { status: 201 });
  },
};
