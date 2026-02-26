"use client";
import { createContext, useContext, useEffect, useState } from "react";

// Create context for admin data
const AdminDataContext = createContext();

// Custom hook to use admin data
export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
};

// Admin Data Provider Component
const AdminDataProvider = ({ children }) => {
  const [data, setData] = useState({
    packages: [],
    adventures: [],
    familyTrips: [],
    honeymoonTrips: [],
    internationalTrips: [],
    weekendGetaways: [],
    culturalTours: [],
    companyInfo: {},
    contactForms: []
  });

  // Load data from localStorage
  const loadData = () => {
    try {
      const loadedData = {
        packages: JSON.parse(localStorage.getItem("adminPackages") || "[]"),
        adventures: JSON.parse(localStorage.getItem("adminAdventures") || "[]"),
        familyTrips: JSON.parse(localStorage.getItem("adminFamilyTrips") || "[]"),
        honeymoonTrips: JSON.parse(localStorage.getItem("adminHoneymoonTrips") || "[]"),
        internationalTrips: JSON.parse(localStorage.getItem("adminInternationalTrips") || "[]"),
        weekendGetaways: JSON.parse(localStorage.getItem("adminWeekendGetaways") || "[]"),
        culturalTours: JSON.parse(localStorage.getItem("adminCulturalTours") || "[]"),
        companyInfo: JSON.parse(localStorage.getItem("adminCompanyInfo") || "{}"),
        contactForms: JSON.parse(localStorage.getItem("adminContactForms") || "[]")
      };
      setData(loadedData);
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
  };

  // Update data and save to localStorage
  const updateData = (key, value) => {
    try {
      const updatedData = { ...data, [key]: value };
      setData(updatedData);
      localStorage.setItem(`admin${key.charAt(0).toUpperCase() + key.slice(1)}`, JSON.stringify(value));
      
      // Trigger storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: `admin${key.charAt(0).toUpperCase() + key.slice(1)}`,
        newValue: JSON.stringify(value)
      }));
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
    }
  };

  // Get specific data
  const getData = (key) => {
    return data[key] || [];
  };

  // Add new item to any collection
  const addItem = (key, item) => {
    const currentData = getData(key);
    const newItem = { ...item, id: Date.now() };
    updateData(key, [newItem, ...currentData]);
    return newItem;
  };

  // Update existing item
  const updateItem = (key, id, updatedItem) => {
    const currentData = getData(key);
    const updatedData = currentData.map(item => 
      item.id === id ? { ...item, ...updatedItem } : item
    );
    updateData(key, updatedData);
  };

  // Delete item
  const deleteItem = (key, id) => {
    const currentData = getData(key);
    const updatedData = currentData.filter(item => item.id !== id);
    updateData(key, updatedData);
  };

  // Add contact form submission
  const addContactForm = (formData) => {
    const newForm = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'pending',
      priority: 'normal'
    };
    updateData('contactForms', [newForm, ...data.contactForms]);
    return newForm;
  };

  // Update contact form status
  const updateContactFormStatus = (id, status) => {
    updateItem('contactForms', id, { status });
  };

  // Update contact form priority
  const updateContactFormPriority = (id, priority) => {
    updateItem('contactForms', id, { priority });
  };

  // Get statistics
  const getStats = () => {
    return {
      totalPackages: data.packages.length,
      totalAdventures: data.adventures.length,
      totalFamilyTrips: data.familyTrips.length,
      totalHoneymoonTrips: data.honeymoonTrips.length,
      totalInternationalTrips: data.internationalTrips.length,
      totalWeekendGetaways: data.weekendGetaways.length,
      totalCulturalTours: data.culturalTours.length,
      totalContactForms: data.contactForms.length,
      pendingContactForms: data.contactForms.filter(form => form.status === 'pending').length,
      respondedContactForms: data.contactForms.filter(form => form.status === 'responded').length,
      urgentContactForms: data.contactForms.filter(form => form.priority === 'urgent').length
    };
  };

  // Search functionality
  const searchItems = (key, searchTerm) => {
    const items = getData(key);
    if (!searchTerm) return items;
    
    return items.filter(item => {
      const searchFields = Object.values(item).join(' ').toLowerCase();
      return searchFields.includes(searchTerm.toLowerCase());
    });
  };

  // Filter by category/type
  const filterItems = (key, filterKey, filterValue) => {
    const items = getData(key);
    return items.filter(item => item[filterKey] === filterValue);
  };

  // Sort items
  const sortItems = (key, sortBy, order = 'asc') => {
    const items = getData(key);
    return [...items].sort((a, b) => {
      if (order === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });
  };

  // Export data to JSON
  const exportData = (key) => {
    const items = getData(key);
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${key}_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import data from JSON
  const importData = (key, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          updateData(key, importedData);
          resolve(importedData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Clear all data
  const clearAllData = () => {
    const keys = ['packages', 'adventures', 'familyTrips', 'honeymoonTrips', 'internationalTrips', 'weekendGetaways', 'culturalTours', 'contactForms'];
    keys.forEach(key => {
      updateData(key, []);
    });
    updateData('companyInfo', {});
  };

  // Load data on mount and set up listeners
  useEffect(() => {
    loadData();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('admin')) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = {
    data,
    getData,
    updateData,
    addItem,
    updateItem,
    deleteItem,
    addContactForm,
    updateContactFormStatus,
    updateContactFormPriority,
    getStats,
    searchItems,
    filterItems,
    sortItems,
    exportData,
    importData,
    clearAllData,
    loadData
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

export default AdminDataProvider;
