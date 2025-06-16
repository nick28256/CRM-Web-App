const admin = require("./firebaseAdmin");

admin.auth().setCustomUserClaims("56lDvPOJDRQPspJqAhD2hjTZhMJ3", { admin: true })
  .then(() => {
    console.log("Admin claim set!");
    process.exit();
  })
  .catch((err) => {
    console.error("Error setting admin claim:", err);
    process.exit(1);
  });