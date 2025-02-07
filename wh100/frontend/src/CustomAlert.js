import React from 'react';

const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-lg mx-auto" role="alert">
      <div className="flex justify-between items-center">
        <div>
          <strong className="font-bold">Error &ensp;</strong>
          <span className="block sm:inline">{message}</span>
        </div>
        <button onClick={onClose} className="text-red-500 hover:text-red-700">
          <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
