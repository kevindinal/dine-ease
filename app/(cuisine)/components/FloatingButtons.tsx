import React, { FC } from "react";

interface FloatingButtonsProps {
  preOrderCount: number;
  setPreOrderCount: () => void;
}

const FloatingButtons: FC<FloatingButtonsProps> = ({ preOrderCount, setPreOrderCount }) => {
  const handleCancelPreOrder = () => {
    if (window.confirm("Are you sure you want to cancel the pre-order?")) {
      setPreOrderCount(); // Correctly clears pre-order count
      alert("Pre-order canceled.");
    }
  };

  return (
    <div className="fixed flex gap-32">
      <button
        onClick={handleCancelPreOrder}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
      >
        Clear Pre-order
      </button>

      <button
        onClick={() => alert(`Proceeding to checkout with ${preOrderCount} items.`)}
        className="relative px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600"
      >
        Proceed to Checkout
        {preOrderCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-white text-green-500 text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
            {preOrderCount}
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingButtons;
