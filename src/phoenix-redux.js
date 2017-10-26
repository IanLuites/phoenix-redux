Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Phoenix Channel middleware for Redux.
 *
 * @param {*} socket The phoenix socket.
 */
function reduxPhoenix(socket) {
  let channels = {};

  return _store => next => action => {
    if (action.channel) {
      let channel = channels[action.channel];

      if (channel === undefined) {
        channel = socket.channel(action.channel, {});
        channel.join();
        channels[action.channel] = channel;
      }

      channel
        .push(action.message || action.type, action)
        .receive('ok', resp => {
          return next(resp);
        });
    } else {
      return next(action);
    }
  };
}

exports.reduxPhoenix = reduxPhoenix;
