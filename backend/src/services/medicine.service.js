import { db } from '../config/firebase.js';

const collection = db.collection('medicines');

export const getAllMedicines = async () => {
  const snapshot = await collection.orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getMedicinesByDate = async (date) => {
  const snapshot = await collection.where('date', '==', date).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createMedicine = async (data) => {
  const newMed = {
    medicineName: data.medicineName || data.name,
    dosage: data.dosage,
    date: data.date,
    time: data.time,
    taken: false,
    createdAt: new Date().toISOString()
  };
  
  const docRef = await collection.add(newMed);
  return { id: docRef.id, ...newMed };
};

export const updateMedicine = async (id, data) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    return null;
  }
  
  await docRef.update(data);
  const updatedDoc = await docRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

export const deleteMedicine = async (id) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    return null;
  }
  
  await docRef.delete();
  return { id };
};
