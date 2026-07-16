const API_URL = 'http://localhost:5000/api';

export const getDashboardData = async (date) => {
  const url = date ? `${API_URL}/dashboard?date=${date}` : `${API_URL}/dashboard`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  return res.json();
};

export const getHistory = async () => {
  const res = await fetch(`${API_URL}/medicines`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
};

export const getInsights = async () => {
  const res = await fetch(`${API_URL}/insights`);
  if (!res.ok) throw new Error('Failed to fetch insights');
  return res.json();
};

export const updateMedicineStatus = async (id, newStatus) => {
  const res = await fetch(`${API_URL}/medicines/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taken: newStatus === 'Taken' })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
};

export const getMedicines = async () => {
  const res = await fetch(`${API_URL}/medicines`);
  if (!res.ok) throw new Error('Failed to fetch medicines');
  return res.json();
};

export const createMedicine = async (medicineData) => {
  const res = await fetch(`${API_URL}/medicines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicineData)
  });
  if (!res.ok) throw new Error('Failed to create medicine');
  return res.json();
};

export const deleteMedicine = async (id) => {
  const res = await fetch(`${API_URL}/medicines/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete medicine');
  return res.json();
};
