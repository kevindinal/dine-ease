import React, { FC } from "react";

interface FloatingButtonsProps {
  preOrderCount: number;
  clearPreOrder: () => void;
}

const FloatingButtons: FC<FloatingButtonsProps> = ({ preOrderCount, clearPreOrder }) => {
  const handleCancelPreOrder = () => {
    if (window.confirm("Are you sure you want to cancel the pre-order?")) {
      clearPreOrder();
      alert("Pre-order canceled.");
    }
  };

  return (
    <div className="fixed bottom-5 flex gap-8 md:gap-32 left-0 justify-center right-0">
      <button
        onClick={handleCancelPreOrder}
        className="px-3 py-1 text-sm md:px-4 md:py-2 md:text-base bg-gray-200 text-gray-500 border border-black rounded-lg shadow-lg hover:bg-gray-400 hover:text-black font-bold"
      >
        Clear Pre-order
      </button>

      <button
        onClick={() => alert(`Proceeding to checkout with ${preOrderCount} items.`)}
        className="relative px-3 py-1 text-sm md:px-4 md:py-2 md:text-base bg-[#FA4032] text-white rounded-lg font-bold shadow-lg hover:bg-green-600 border border-black"
      >
        Proceed to Checkout 🛒
        {preOrderCount > 0 && (
          <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-[#FA4032] text-white text-xs md:text-sm font-bold w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-md border border-black">
            {preOrderCount}
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingButtons;
