meteor twilio
==============

A Meteor package for sending SMS/MMS and making calls with Twilio APIs.

##Usage
`meteor add dispatch:twilio`

Add your Twilio account information to your settings file, as shown in settings.example.json

```
{
  "TWILIO": {
    "FROM": "TWILIO_PHONE", // One of the phone numbers tied to your Twilio account
    "SID": "TWILIO_SID", // SID tied to your Twilio account
    "TOKEN": "TWILIO_TOKEN" // Token tied to your Twilio account
  }
}

```

```
// Configure the Twilio client
var client = new Twilio({
  from: Meteor.settings.TWILIO.FROM,
  sid: Meteor.settings.TWILIO.SID,
  token: Meteor.settings.TWILIO.TOKEN
});

// Send a message
client.sendSMS({
  to: '+18646978257',
  body: 'Hello world!'
});

// Send a message with an image
client.sendMMS({
  to: '+18646978257',
  body: 'Hello world!',
  mediaUrl: 'http://images.clipartpanda.com/world-clip-art-World-Clip-Art-811.jpg'
});

// Make a call
client.makeCall({ to: '+18646978257' });

// Get information about the number
client.lookup('+18646978257');

// Get information about the number asynchronously
client.lookupAsync('+18646978257', function (error, info) {});

```
