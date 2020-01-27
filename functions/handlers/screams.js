const { db } = require("../utils/admin");

exports.getAllScreams = (req, res) => {
  db.collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(snapshot => {
      let screams = [];
      snapshot.forEach(doc => {
        screams.push({
          screamId: doc.id,
          ...doc.data()
        })
      });
      return res.json(screams);
    })
    .catch(err => console.error(err))
};

exports.postScream = (req, res) => {
  const newScream = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    updateAt: new Date().toISOString(),
    userHandle: req.user.userHandle
  };

  return db.collection('screams')
    .add(newScream)
    .then(doc => res.json({
      data: `Document ${doc.id} created successfully`,
      message: "success"
    }))
    .catch(err => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    })
};