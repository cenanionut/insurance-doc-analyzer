import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
});

export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    const res = await api.post('/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}

export const analyzeDocument = async (text, fileName) => {
    const res = await api.post('/documents/analyze', { text, fileName });
    return res.data;
}

export const sendChatMessage = async (conversationId, question) => {
    const res = await api.post('/chat', { conversationId, question });
    return res.data;
}

export const getConversation = async (conversationId) => {
    const res = await api.get(`/chat/${conversationId}`);
    return res.data;
}

export default api;