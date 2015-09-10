var twilio = Npm.require('twilio');

var lookups = new Mongo.Collection('twilio.lookups');

Twilio = function (options) {
  var self = this;

  options = _.extend({
    // default
  }, options);

  check(options, {
    from: String,
    sid: String,
    token: String
  });

  self.client = new twilio(options.sid, options.token);
  self.from = options.from;
  self.auth = options.sid + ':' + options.token;
};

/*
 * Send an sms to a phone number with a message.
 * @param options
 * {String} options.to
 * {String} options.body
 * {String} [options.from] Specify a different number to send the sms from.
 * @param {Function} [callback]
 */
Twilio.prototype.sendSMS = function (options, callback) {
  var self = this;

  options = _.extend({
    from: self.from
  }, options);

  check(options, {
    to: String,
    from: String,
    body: String,
    statusCallback: Match.Optional(String)
  });

  return Meteor.wrapAsync(self.client.sendMessage).call(self.client, options, callback);
};

/*
 * Send an mms to a phone number with a message and media.
 * @param options
 * {String} options.to
 * {String} options.body
 * {String} options.mediaUrl
 * {String} [options.from] Specify a different number to send the sms from.
 * {String} [options.statusCallback] Specify a callback URL for Twilio to hit for status updates
 * @param {Function} [callback]
 */
Twilio.prototype.sendMMS = function (options, callback) {
  var self = this;

  options = _.extend({
    from: self.from
  }, options);

  check(options, {
    to: String,
    from: String,
    body: String,
    mediaUrl: Match.Optional(String),
    statusCallback: Match.Optional(String)
  });

  return Meteor.wrapAsync(self.client.messages.post).call(self.client, options, callback);
};

/*
 * Call a phone number.
 * @param options
 * {String} options.to
 * {String} [options.from] Specify a different number to call from.
 * {String} [options.statusCallback] Specify a callback URL for Twilio to hit for status updates
 * @param {Function} [callback]
 */
Twilio.prototype.makeCall = function (options, callback) {
  var self = this;

  options = _.extend({
    from: self.from
  }, options);

  check(options, {
    to: String,
    from: String,
    statusCallback: Match.Optional(String)
  });

  return Meteor.wrapAsync(self.client.makeCall).call(self.client, options, callback);
};

/*
 * Asynchronously look up information about a phone number.
 * @param {String} phoneNumber
 * @param options
 * {String} [options.Type] Get more information about the number. Ex. Type: 'carrier'
 * {String} [options.country_code]
 * {String} [options.statusCallback] Specify a callback URL for Twilio to hit for status updates
 * @param {Function} [callback]
 */
Twilio.prototype.lookupAsync = function (phoneNumber, options, callback) {
  var self = this;

  check(phoneNumber, String);

  if (_.isFunction(options)) {
    callback = options;
    options = {};
  }

  var info = lookups.findOne({
    phoneNumber: phoneNumber
  });

  if (info) {
    callback(null, info);
  } else {

    HTTP.get('https://lookups.twilio.com/v1/PhoneNumbers/' + phoneNumber, {
      auth: self.auth,
      params: options
    }, function (error, response) {
      if (error) {
        callback(error);
      } else {
        lookups.insert(response.data);
        callback(null, response.data);
      }
    });

  }
};

/*
 * Synchronously look up information about a phone number.
 * @param {String} phoneNumber
 * @param options
 * {String} [options.Type] Get more information about the number. Ex. Type: 'carrier'
 * {String} [options.country_code]
 * @param {Function} [callback]
 */
Twilio.prototype.lookup = function (phoneNumber, options, callback) {
  var self = this;

  return Meteor.wrapAsync(self.lookupAsync).call(self, phoneNumber, options, callback);
};
