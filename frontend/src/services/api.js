const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (path, options, fallbackMessage) => {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error('Cannot reach the backend. Start it on http://localhost:5000 and try again.');
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || fallbackMessage);
  }

  return payload;
};

export const getDashboardData = async (date) => {
  const query = date ? `?date=${date}` : '';
  return request(`/dashboard${query}`, undefined, 'Failed to fetch dashboard data');
};

export const getHistory = async () => {
  return request('/medicines', undefined, 'Failed to fetch history');
};

export const getInsights = async () => {
  return request('/insights', undefined, 'Failed to fetch insights');
};

export const updateMedicineStatus = async (id, newStatus) => {
  return request(`/medicines/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taken: newStatus === 'Taken' })
  }, 'Failed to update status');
};

export const getMedicines = async () => {
  return request('/medicines', undefined, 'Failed to fetch medicines');
};

export const createMedicine = async (medicineData) => {
  return request('/medicines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicineData)
  }, 'Failed to create medicine');
};

export const updateMedicine = async (id, medicineData) => {
  return request(`/medicines/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicineData)
  }, 'Failed to update medicine');
};

export const deleteMedicine = async (id) => {
  return request(`/medicines/${id}`, {
    method: 'DELETE'
  }, 'Failed to delete medicine');
};
