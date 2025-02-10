'use client';

import { useEffect, useState } from "react";

export default function usePreOrder() {
    const [preOrderCount, setPreOrderCount] = useState<number>(0);

    useEffect(() => {
        const storedCount = parseInt(localStorage.getItem('preOrderCount') || '0');
        setPreOrderCount(storedCount);
    }, []);

    const addItemToPreOrder = () => {
        const updatedCount = preOrderCount + 1;
        setPreOrderCount(updatedCount);
        localStorage.setItem('preOrderCount', updatedCount.toString());
    };

    const clearPreOrder = () => {
        setPreOrderCount(0);
        localStorage.setItem('preOrderCount', '0');
    };

    return { preOrderCount, addItemToPreOrder, clearPreOrder };
}
