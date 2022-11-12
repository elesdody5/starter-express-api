const admin = require("firebase-admin");

var serviceAccount = require("../delivery-app-5e621-firebase-adminsdk-kjin7-465d741a9b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//This function takes notification token and payload and it sends notification to a proper device
exports.sendNotification = async (notificationToken, payload) => {
  var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };
  // let messageClone = {
  //   ...payload,
  //   token: String(notificationToken.split(":")[1]),
  // };
  console.log(notificationToken, payload);

  await admin
    .messaging()
    .sendToDevice([String(notificationToken)], payload, options)
    .then((response1) => {
      console.log("Message sent successfully", response1);
    })
    .catch((err) => console.log("Error in sending message", err));
};
exports.sendMultipleNotification = async (
  registrationTokens,
  message,
  topic,
  res
) => {
  // await admin
  //   .messaging()
  //   .subscribeToTopic(registrationTokens, topic)
  //   .then((response) => {
  //     console.log("subbed");
  //     // See the MessagingTopicManagementResponse reference documentation
  //     // for the contents of response.
  //     console.log("Successfully subscribed to topic:", response);
  //   })
  //   .catch((error) => {
  //     console.log("Error subscribing to topic:", error);
  //   });

  // Send a message to devices subscribed to the provided topic.
  let messageClone = {
    ...message,
    tokens: registrationTokens,
  };

  console.log("YAHOOOOOO");

  admin
    .messaging()
    .sendMulticast(messageClone)
    .then((response) => {
      // Response is a message ID string.

      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      res.json(error);
    });
};
