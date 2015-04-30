var client;

function equals(a, b) {
  return !!(JSON.stringify(a) === JSON.stringify(b));
}

var testPhoneInfoNoCarrier = {
  country_code: 'BR',
  phone_number: '+551155256325',
  national_format: '(11) 5525-6325',
  carrier: null,
  url: 'https://lookups.twilio.com/v1/PhoneNumbers/+551155256325'
};

var testPhoneInfoCarrier = {
  country_code: 'BR',
  phone_number: '+551155256325',
  national_format: '(11) 5525-6325',
  carrier: {
    mobile_country_code: null,
    mobile_network_code: null,
    name: 'Vivo',
    type: 'landline',
    error_code: null
  },
  url: 'https://lookups.twilio.com/v1/PhoneNumbers/+551155256325?Type=carrier'
};

Tinytest.add('Dispatch - Twilio - Initialize', function (test) {
  test.isTrue(!!Meteor.settings.TWILIO.FROM, 'Meteor settings is missing "FROM"');
  test.isTrue(!!Meteor.settings.TWILIO.SID, 'Meteor settings is missing "SID"');
  test.isTrue(!!Meteor.settings.TWILIO.TOKEN, 'Meteor settings is missing "TOKEN"');

  // Initialize the twilio client
  client = new Twilio({
    from: Meteor.settings.TWILIO.FROM,
    sid: Meteor.settings.TWILIO.SID,
    token: Meteor.settings.TWILIO.TOKEN
  });

  test.isTrue(!!client.client, 'The client was not initialized');

  test.equal(typeof client.lookup, 'function', 'Lookup is missing from the api');
});


Tinytest.addAsync('Dispatch - Twilio - Lookup', function (test, complete) {
  var outstanding = 0;

  // This is a fake phone number and should show an error.
  outstanding++;
  client.lookup('+1-555-555-5555', function (error) {
    test.isTrue(!!error);
    outstanding--;
    if (!outstanding) complete();
  });

  // This is a real phone number and should show info about the number.
  // The number is a test number from the Twilio site.
  outstanding++;
  client.lookup('+55-11-5525-6325', function (error, info) {
    test.isFalse(!!error);
    test.isTrue(equals(testPhoneInfoNoCarrier, info));
    outstanding--;
    if (!outstanding) complete();
  });

  // This is a real phone number and should show info about the number.
  // The number is a test number from the Twilio site.
  outstanding++;
  client.lookup('+55-11-5525-6325', { Type: 'carrier' }, function (error, info) {
    test.isFalse(!!error);
    test.isTrue(equals(testPhoneInfoCarrier, info));
    outstanding--;
    if (!outstanding) complete();
  });
});
