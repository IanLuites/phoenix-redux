/**
 * Phoenix Channel middleware for Redux.
 *
 * @param {*} socket The phoenix socket.
 */
const reduxPhoenix = socket => {
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
};

export default reduxPhoenix;

/**
 * Turns a redux action into a channel action.
 *
 * @param {string} channel The Phoenix channel name.
 * @param {object} action The redux action.
 * @return {object} The channel action.
 */
export function channelAction(channel, action) {
  return {...action, channel: channel};
};

