"use client";

import { useEffect } from "react";
import { checkForTokenRefresh, onForegroundMessage, requestNotificationPermission } from "../../lib/pushNotification";

const Notifications = () => {
 
    useEffect(() => {
        requestNotificationPermission();
        onForegroundMessage();
        checkForTokenRefresh();
    }, []);

    return <></>;
};
 

export default Notifications;

