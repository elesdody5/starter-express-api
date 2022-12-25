const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: "delivery-app-5e621",
  keyFilename: "delivery-app-5e621-firebase-adminsdk-kjin7-392a4a1fae.json",
});
let bucket = storage.bucket("gs://delivery-app-5e621.appspot.com");

module.exports = {
  storage,
  bucket,
};
