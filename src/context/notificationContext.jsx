/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './authContext';
import { API_BASE_URL } from '../config/api';

export const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useContext(AuthContext);

  const fetchNotifications = async () => {
    if (!currentUser) {
      console.log('⏭️ Skipping notification fetch - no user logged in');
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const lastVisit = localStorage.getItem('lastVisit') || 0;
      
      const response = await fetch(
        `${API_BASE_URL}/notifications/new?since=${lastVisit}`,
        { credentials: 'include' }
      );

      if (response.status === 401) {
        console.log('⏭️ User not authenticated, skipping notifications');
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }

      const data = await response.json();
      console.log('📬 New notifications count:', data.unreadCount || 0);
      
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (notificationId) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.status === 401) {
        console.log('⏭️ User not authenticated');
        return;
      }

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif._id === notificationId ? { ...notif, read: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearAll = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/clear`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.status === 401) {
        console.log('⏭️ User not authenticated');
        return;
      }

      if (response.ok) {
        console.log('🧹 All notifications cleared');
        setNotifications([]);
        setUnreadCount(0);
        localStorage.setItem('lastVisit', Date.now());
      }
      
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      console.log('✅ User logged in, fetching notifications');
      fetchNotifications();
      
      const interval = setInterval(fetchNotifications, 30000);
      return () => {
        console.log('🧹 Cleaning up notification polling');
        clearInterval(interval);
      };
    } else {
      console.log('👋 User logged out, clearing notifications');
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};