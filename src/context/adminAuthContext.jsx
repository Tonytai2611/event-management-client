// context/AdminAuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

export const AdminAuthContext = createContext();

export const AdminAuthContextProvider = ({ children }) => {
    const [currentAdmin, setCurrentAdmin] = useState(() => {
        const saved = localStorage.getItem("admin");
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(false);

    const adminLogin = async (username, password) => {
        try {
            console.log('🔑 Admin login attempt...');
            
            const response = await fetch(`${API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Admin login failed with status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Admin login successful:', data);
            
            setCurrentAdmin(data.user);
            localStorage.setItem('admin', JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            console.error('❌ Admin login error:', error);
            throw error;
        }
    };

    const adminLogout = async () => {
        try {
            console.log('🚪 Admin logging out...');
            
            await fetch(`${API_BASE_URL}/admin/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            setCurrentAdmin(null);
            localStorage.removeItem('admin');
            
            console.log('✅ Admin logout successful');
        } catch (error) {
            console.error('❌ Admin logout error:', error);
            setCurrentAdmin(null);
            localStorage.removeItem('admin');
        }
    };

    const updateAdmin = (data) => {
        setCurrentAdmin(data);
        if (data) {
            localStorage.setItem("admin", JSON.stringify(data));
        } else {
            localStorage.removeItem("admin");
        }
    };

    useEffect(() => {
        if (currentAdmin === null) {
            localStorage.removeItem("admin");
        } else {
            localStorage.setItem("admin", JSON.stringify(currentAdmin));
        }
    }, [currentAdmin]);

    return (
        <AdminAuthContext.Provider value={{ 
            currentAdmin, 
            setCurrentAdmin,
            adminLogin,      // ← ADD
            adminLogout,     // ← ADD
            updateAdmin,
            loading 
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

