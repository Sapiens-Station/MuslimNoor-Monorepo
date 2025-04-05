import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  const serviceAccount = require('../../muslim-noor-firebase-adminsdk-fbsvc-f674336847.json')

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export { admin }
