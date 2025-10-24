const isDevelopment = import.meta.env.MODE === 'development';

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8800'  
  : 'http://54.169.211.105/api';

export const CLIENT_URL = isDevelopment
  ? 'http://localhost:5173'
  :  'http://54.169.211.105';

// Debug logging
console.log('🔧 Environment:', import.meta.env.MODE);
console.log('📡 API Base URL:', API_BASE_URL);
console.log('🌐 Client URL:', CLIENT_URL);

export const testAPIConnection = async () => {
    try {
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