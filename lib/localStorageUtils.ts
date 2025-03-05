export const sendLocalStorageData = async () => {
    const userData = localStorage.getItem("userSession"); // Adjust key based on your use case
  
    if (!userData) {
      console.log("No local storage data found");
      return;
    }
  
    try {
      const response = await fetch("/api/local-storage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData }),
      });
  
      const result = await response.json();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Error sending local storage data:", error);
    }
  };
  