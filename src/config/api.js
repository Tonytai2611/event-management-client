const isDevelopment = import.meta.env.MODE === 'development';

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8800'  
  : import.meta.env.VITE_API_BASE_URL || 'http://18.143.73.181/api';

export const CLIENT_URL = isDevelopment
  ? 'http://localhost:5173'
  : import.meta.env.VITE_CLIENT_URL || 'http://18.143.73.181';

// Debug logging
console.log('🔧 Environment:', import.meta.env.MODE);
console.log('📡 API Base URL:', API_BASE_URL);
console.log('🌐 Client URL:', CLIENT_URL);

// Test connection function - FIX: Remove /api prefix
export const testAPIConnection = async () => {
    try {
        // Remove /api/ since it's already in API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/test`, {  
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ API connection successful');
            return true;
        } else {
            console.warn('⚠️ API responded with status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ API connection failed:', error);
        return false;
    }
};