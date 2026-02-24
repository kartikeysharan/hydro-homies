const { onValueWritten } = require("firebase-functions/v2/database");
const admin = require("firebase-admin");

admin.initializeApp();

function getTrashTalk(name, ounces) {
  const messages = [
    `${name} just drank ${ounces}oz 💧 Stay focused.`,
    `${name} logged ${ounces}oz. You're slipping 😤`,
    `${ounces}oz added. Hydration gap widening.`,
    `${name} is on a roll 🔥 ${ounces}oz down.`,
    `+${ounces}oz. Pressure is building 👀`,
    `${name} drank ${ounces}oz. Panic mode?`
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

exports.notifyWaterLog = onValueWritten(
  "/hydration",
  async (event) => {

    const before = event.data.before.val();
    const after = event.data.after.val();

    if (!before || !after) return;

    let targetToken = null;
    let body = null;
    let title = "💧 Hydration War Update";

    // Kartikey logged water
    if (after.yourTotal > before.yourTotal) {
      const diff = (after.yourTotal - before.yourTotal).toFixed(1);

      const snap = await admin.database().ref("tokens/friend").get();
      targetToken = snap.val();

      body = getTrashTalk("Kartikey", diff);
    }

    // Marcee logged water
    if (after.friendTotal > before.friendTotal) {
      const diff = (after.friendTotal - before.friendTotal).toFixed(1);

      const snap = await admin.database().ref("tokens/you").get();
      targetToken = snap.val();

      body = getTrashTalk("Marcee", diff);
    }

    if (!targetToken) return;

    await admin.messaging().send({
      token: targetToken,
      notification: {
        title,
        body
      }
    });
  }
);
