import { getDb } from '../config/firebase.js';

const getCollection = () => getDb().collection('medicines');

export const getAllMedicines = async () => {
  const collection = getCollection();
  const snapshot = await collection.orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getMedicinesByDate = async (date) => {
  const collection = getCollection();
  const snapshot = await collection.where('date', '==', date).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createMedicine = async (data) => {
  const collection = getCollection();
  const newMed = {
    medicineName: data.medicineName || data.name,
    dosage: data.dosage,
    type: data.type || 'Tablet',
    date: data.date,
    time: data.time,
    taken: false,
    createdAt: new Date().toISOString()
  };
  
  const docRef = await collection.add(newMed);
  return { id: docRef.id, ...newMed };
};

export const updateMedicine = async (id, data) => {
  const collection = getCollection();
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    return null;
  }
  
  const allowedFields = ['medicineName', 'dosage', 'type', 'date', 'time', 'taken'];
  const updates = Object.fromEntries(
    Object.entries(data).filter(([field]) => allowedFields.includes(field))
  );

  if ('name' in data && !('medicineName' in updates)) {
    updates.medicineName = data.name;
  }

  await docRef.update(updates);
  const updatedDoc = await docRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

export const deleteMedicine = async (id) => {
  const collection = getCollection();
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    return null;
  }
  
  await docRef.delete();
  return { id };
};
