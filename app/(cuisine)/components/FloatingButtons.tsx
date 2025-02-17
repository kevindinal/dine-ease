import React, { FC } from "react";

interface FloatingButtonsProps {
  preOrderCount: number;
  setPreOrderCount: () => void;
}

const FloatingButtons: FC<FloatingButtonsProps> = ({ preOrderCount, setPreOrderCount }) => {
  const handleCancelPreOrder = () => {
    if (window.confirm("Are you sure you want to cancel the pre-order?")) {
      setPreOrderCount(); 
      alert("Pre-order canceled.");
    }
  };

  return (
    <div className="fixed flex gap-32">
      <button
        onClick={handleCancelPreOrder}
        className="px-4 py-2 bg-gray-200 text-gray-500 border border-black rounded-lg shadow-lg hover:bg-gray-400 hover:text-black font-bold"
      >
        Clear Pre-order
      </button>

      <button
        onClick={() => alert(`Proceeding to checkout with ${preOrderCount} items.`)}
        className="relative px-4 py-2 bg-[#FA4032] text-white rounded-lg font-bold shadow-lg hover:bg-green-600 border border-black"
      >
        Proceed to Checkout 🛒
        {preOrderCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-[#FA4032] text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md border border-black">
            {preOrderCount}
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingButtons;
