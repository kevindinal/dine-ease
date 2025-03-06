"use client";

import { useEffect } from "react";
import { onForegroundMessage, requestNotificationPermission } from "../../lib/pushNotification";

const Notifications = () => {
 
    useEffect(() => {
        requestNotificationPermission();
        onForegroundMessage();
    }, []);

    return <></>;
};
 

export default Notifications;

