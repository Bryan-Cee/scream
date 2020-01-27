const admin = require("firebase-admin");

exports.AuthMiddleware = (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
    token = req.headers.authorization.replace('Bearer ', '');
  } else {
    return res.status(403).json({ error: 'UNAUTHORIZED'})
  }

  return admin.auth().verifyIdToken(token)
    .then(async (decodeToken) => {
      req.user = decodeToken;
      const data = await db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
      req.user.userHandle = data.docs[0].data().userHandle;
      return next();
    })
    .catch(err => {
      console.error(err);
      return res.status(403).json({ body: 'Body must not be empty' })
    })
};
