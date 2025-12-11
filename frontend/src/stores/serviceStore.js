// frontend/src/stores/serviceStore.js
import { defineStore } from 'pinia';
import api from '../services/api';
import { ref } from 'vue';

export const useServiceStore = defineStore('service', () => {
    // State
    const services = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // Actions
    
    // 1. Fetch all services for the logged-in company
    async function fetchServices() {
        loading.value = true;
        try {
            const response = await api.get('/services');
            services.value = response.data;
        } catch (err) {
            console.error('Error fetching services:', err);
            error.value = 'Failed to load services.';
        } finally {
            loading.value = false;
        }
    }

    // 2. Add a new service
    async function addService(serviceData) {
        try {
            const response = await api.post('/services', serviceData);
            // Add the new service to the local list immediately (Optimistic UI update)
            services.value.push(response.data);
            return true;
        } catch (err) {
            console.error('Error creating service:', err);
            throw err;
        }
    }

    // 3. Delete a service
    async function deleteService(id) {
        try {
            await api.delete(`/services/${id}`);
            // Remove from local list
            services.value = services.value.filter(s => s.id !== id);
        } catch (err) {
            console.error('Error deleting service:', err);
        }
    }

    return { services, loading, error, fetchServices, addService, deleteService };
});