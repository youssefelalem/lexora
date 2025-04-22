import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './MainContainer.css';

const MainContainer = () => {
  return (
    <div className="main-container">
      <Routes>
        <Route path="/dashboard" element={<div>لوحة التحكم</div>} />
        <Route path="/users" element={<div>صفحة المستخدمين</div>} />
        <Route path="/settings" element={<div>صفحة الإعدادات</div>} />
      </Routes>
    </div>
  );
};

export default MainContainer; 