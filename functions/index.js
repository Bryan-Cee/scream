const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello World!");
});

exports.getScreams = functions.https.onRequest((request, response) => {
  admin.firestore().collection('screams').get()
    .then(data => {
      let screams = [];
      data.forEach(doc => screams.push(doc.data()));
      return response.json(screams);
    })
    .catch(err => console.error(err))
});

exports.createScreams = functions.https.onRequest(((req, res) => {
  if(req.method !== 'POST'){
    return res.status(400).json({ error: "Method not allowed"})
  }
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };

  admin.firestore().collection('scream').add(newScream)
    .then(doc => res.json({ message: `document ${doc.id} created successfuly`}))
    .catch(err => {
      res.status(500).json({ error: "Something went wrong"});
      console.error(err);
    })
}));