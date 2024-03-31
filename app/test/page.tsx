import React from 'react'
import { getDocs,collection,} from "firebase/firestore";
import {db} from "../../firebase"


const page = () => {
    const getEvents = async () => {

        const collectionRef = collection(db, 'events')
        const querySnapshot = await getDocs(collectionRef)
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(data)
        return data;
      }
      getEvents()
  return (
    <div>page</div>
  )
}

export default page