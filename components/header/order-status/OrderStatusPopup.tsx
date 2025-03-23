"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useOrderStatus } from './hooks/useOrderStatus';
import { Utensils, Coffee, CalendarCheck, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderStatusPopupProps {
  onClose: () => void;
}

const OrderStatusPopup: React.FC<OrderStatusPopupProps> = ({ onClose }) => {
  const { orderStatus, loading, error } = useOrderStatus();
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose(); // Call the parent's function instead
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const StatusItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    isComplete: boolean;
    timestamp?: string;
  }> = ({
    icon,
    title,
    isComplete,
    timestamp
  }) => {
      return (
        <div className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200">
          <div className={`p-3 rounded-full mr-4 ${isComplete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} shadow-sm transition-all duration-300`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">{title}</h3>
            <div className="flex justify-between items-center mt-1">
              <p className={`text-sm font-medium ${isComplete ? 'text-green-600' : 'text-amber-600'}`}>
                {isComplete ? 'Complete' : 'Pending'}
              </p>
              {timestamp && isComplete && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{timestamp}</span>
              )}
            </div>
          </div>
        </div>
      );
    };

  return (
    <div>
      {/* Button can be used in dropdown or standalone */}
      <button
        onClick={onClose}
        className="px-5 py-2.5 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center justify-center"
        
        aria-haspopup="true"
      >
        {loading ? (
          <span className="flex items-center">
            <RefreshCw size={16} className="mr-2 animate-spin" />
            Checking...
          </span>
        ) : (
          <span className="flex items-center">
            <Coffee size={16} className="mr-2" />
            Order Status
          </span>
        )}
      </button>

      {/* Full-screen overlay with centered popup */}
      <AnimatePresence>
        {true && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="m-4"
            >
              <div
                ref={popupRef}
                className="w-full max-w-md rounded-xl shadow-2xl bg-white overflow-hidden"
                role="dialog"
                aria-modal="true"
              >
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Order Status</h2>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Close popup"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  {orderStatus && (
                    <div className="flex flex-col text-sm text-gray-600 mt-2">
                      <p>Order ID: <span className="font-medium text-blue-600">{orderStatus.id}</span></p>
                    </div>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-8 text-center text-gray-600 flex flex-col items-center">
                      <div className="bg-blue-50 p-4 rounded-full mb-3">
                        <RefreshCw size={28} className="animate-spin text-blue-600" />
                      </div>
                      <p className="font-medium">Updating status...</p>
                    </div>
                  ) : error ? (
                    <div className="p-6 text-center text-red-600 bg-red-50 m-3 rounded-lg">
                      <p className="mb-3 font-medium">{error}</p>
                      <button
                        className="text-sm px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : orderStatus ? (
                    <>
                      <StatusItem
                        icon={<Coffee size={20} color={orderStatus.isTableReady ? "#10B981" : "#9CA3AF"} />}
                        title="Table Ready"
                        isComplete={orderStatus.isTableReady}
                      />
                      <StatusItem
                        icon={<Utensils size={20} color={orderStatus.isMealReady ? "#10B981" : "#9CA3AF"} />}
                        title="Meal Ready"
                        isComplete={orderStatus.isMealReady}
                      />
                      <StatusItem
                        icon={<CalendarCheck size={20} color={orderStatus.isReservationReady ? "#10B981" : "#9CA3AF"} />}
                        title="Reservation Complete"
                        isComplete={orderStatus.isReservationReady}
                      />
                      <div className="p-4 bg-gray-50">
                        <button
                          className="w-full py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center shadow-sm border border-gray-100 font-medium"
                        >
                          <RefreshCw size={14} className="mr-2" />
                          Refresh Status
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center text-gray-600">
                      <div className="bg-gray-100 p-4 rounded-full inline-block mb-3">
                        <Coffee size={24} className="text-gray-400" />
                      </div>
                      <p className="font-medium">No data available</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderStatusPopup;