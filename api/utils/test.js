const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: "delivery-app-5e621",
  keyFilename: "delivery-app-5e621-firebase-adminsdk-kjin7-465d741a9b.json",
});
let bucket = storage.bucket("gs://delivery-app-5e621.appspot.com");

module.exports = {
  storage,
  bucket,
};
