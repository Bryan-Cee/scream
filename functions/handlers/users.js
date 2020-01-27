const { db } = require("../utils/admin");
const { isEmpty, isEmail } = require("../utils/helpers");
const firebase = require("firebase");

exports.signUp = (req, res) => {
  const { email, password, confirmPassword, userHandle } = req.body;
  const errors = {};

  if(isEmpty(email)){
    errors.email = "Cannot be empty"
  } else if(!isEmail(email)){
    errors.email = "Must be a valid email"
  }
  if(isEmpty(password)) errors.password = "Must not be empty";
  if(password !== confirmPassword) errors.handle = "Password must match";
  if(isEmpty(userHandle)) errors.handle = "Must not be empty";

  if(Object.keys(errors).length > 0){
    return res.status(400).json({ errors, message: "failed" })
  }
  const user = db.collection('users').doc(userHandle);

  return user.get()
    .then(snapshot => {
      return snapshot.exists ? res.status(400).json({ error: "Handle already taken try another.", message: "failed" })
        // eslint-disable-next-line promise/no-nesting
        : firebase.auth()
          .createUserWithEmailAndPassword(email, password)
          .then(async (cred) => {
            const token = await cred.user.getIdToken();
            const newUser = {
              userHandle,
              email,
              createdAt: new Date().toISOString(),
              userId: cred.user.uid
            };
            // create the user
            await db.doc(`/users/${userHandle}`).set(newUser);
            return res.status(201).json({ token, message: "success" })
          })
          .catch(err => {
            if(err.code === "auth/email-already-in-use") {
              return res.status(400).json({ email: "Email is already in use", message: "failed" });
            }
            return res.status(500).json({ error: err.code, message: "failed" })
          })
    })
};

exports.login = ((req, res) => {
  const { email, password } = req.body;
  const errors = {};

  if(isEmpty(email)) errors.email = "Must not be empty";
  if(isEmpty(password)) errors.password = "Must not be empty";

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(async (snapshot) => {
      const token = await snapshot.user.getIdToken();
      return res.json({ token, message: "success" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code, message: "failed" })
    })
});