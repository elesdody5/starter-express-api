const admin = require('firebase-admin');

var serviceAccount = require('../delivery-app-5e621-firebase-adminsdk-kjin7-465d741a9b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//This function takes notification token and payload and it sends notification to a proper device
exports.sendNotification = (notificationToken, payload) => {
  var options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  admin
    .messaging()
    .sendToDevice(notificationToken, payload, options)
    .then((response1) => {
      console.log('Message sent successfully', response1);
    })
    .catch((err) => console.log('Error in sending message', err));
};
exports.sendMultipleNotification = (
  registrationTokens,
  message,
  topic,
  res
) => {
  admin
    .messaging()
    .subscribeToTopic(registrationTokens, topic)
    .then((response) => {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log('Successfully subscribed to topic:', response);
    })
    .catch((error) => {
      console.log('Error subscribing to topic:', error);
    });

  // Send a message to devices subscribed to the provided topic.
  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      res.json(error);
    });
};
