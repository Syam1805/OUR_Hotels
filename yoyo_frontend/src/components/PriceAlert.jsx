import React, { useState } from 'react';
import { toast } from 'react-toastify';

function PriceAlert({ onClose }) {
  const [price, setPrice] = useState('');

  const handleSave = () => {
    localStorage.setItem('priceAlert', price);
    toast.success('Price alert set!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default PriceAlert;