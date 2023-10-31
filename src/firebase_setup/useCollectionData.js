import { useState, useEffect } from 'react';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { db } from './firebase';

const useCollectionData = (collectionName) => {
  const [collectionData, setCollectionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = db.collection(collectionName);
        const collectionSnapshot = await collectionRef.get();

        const collectionDocs = collectionSnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }));

        setCollectionData(collectionDocs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [collectionName]);

  return collectionData;
}

export default useCollectionData;
