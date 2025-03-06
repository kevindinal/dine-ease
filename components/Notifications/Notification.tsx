"use client";

import { useEffect } from "react";
import { requestNotificationPermission } from "../../lib/pushNotification";

const Notifications = () => {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return <></>;
};

export default Notifications;
