const admin = require("firebase-admin");

var FCM = require("fcm-node");

let serviceAcc = require("../../delivery-app-5e621-firebase-adminsdk-kjin7-392a4a1fae.json");
let fcm = new FCM(serviceAcc);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

//This function takes notification token and payload and it sends notification to a proper device
exports.sendNotification = async (registrationToken, message) => {
  var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };
  // let messageClone = {
  //   ...payload,
  //   token: registrationToken,
  // };

  console.log("before notification", message);

  admin
    .messaging()
    .sendMulticast(message)
    .then((response1) => {
      console.log(response1.responses);
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
console.log("HIIII")
// exports.sendSingleNotificationViaAPI = async (token, data) => {
//   let DATA = [
//     {
//       token: token,
//       data: data,
//     },
//   ];
//   let HEADER = {
//     headers: {
//       Accept: "application/json",
//       "x-api-key": "lfcFQxKrQBofAWpbNGPBQayBuHIPlNrD",
//     },
//   };
//   axios
//     .post(
//       "https://notification-cs.herokuapp.com/api/v1/notifications",
//       DATA,
//       HEADER
//     )
//     .then((response) => {
//       console.log("Req body:", response.data);
//       console.log("Req header :", response.headers);
//     })
//     .catch((e) => {
//       console.error(e);
//     });
// };
// exports.sendMultipleNotificationViaAPI = async (tokens, data, res) => {
//   let DATA = {
//     tokens: tokens,
//     data: data,
//   };

//   console.log("tokens>>>>", tokens);
//   const HEADER = {
//     headers: {
//       Accept: "application/json",
//       "x-api-key": "lfcFQxKrQBofAWpbNGPBQayBuHIPlNrD",
//     },
//   };
//   axios
//     .post(
//       "https://notification-cs.herokuapp.com/api/v1/multiCastNotification",
//       DATA,
//       HEADER
//     )
//     .then((response) => {
//       console.log("Req body:", response.data);
//       console.log("Req header :", response.headers);
//     })
//     .catch((e) => {
//       console.error(e);
//     });
// };
exports.sendSingleNotificationUsingFCM = async (token, data) => {
  let message = {
    to: String(token),
    data: data,
    notification: {},
  };
  fcm.send(message, (err, response) => {
    if (err) {
      console.log("Something has gone wrong!", err);
    } else {
      console.log("Successfully sent with response: ", response.results);
    }
  });
};
