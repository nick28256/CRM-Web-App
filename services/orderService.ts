import api from './api';

export const getOrdersByClient = async (clientId: string) => {
  try {
    const response = await api.get(`/orders/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.error('Eroare la preluarea comenzilor:', error);
    return [];
  }
};
