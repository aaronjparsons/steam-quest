import { firebase } from '../init'
const db = firebase.firestore()

const createUser = function(data) {
  db.collection("users").add(data)
  .then(docRef => {
    console.log(`Document added: ${docRef.id}`)
  })
  .catch(error => {
      console.error(`Error adding document: ${error}`)
  })
}

const getAllUsers = function() {
  db.collection("users").get().then((snapshot) => {
    console.log(snapshot.docs.map(doc =>  {
      return {
        id: doc.id,
        ...doc.data()
      }
    }))
  })
}

export {
  createUser,
  getAllUsers
}