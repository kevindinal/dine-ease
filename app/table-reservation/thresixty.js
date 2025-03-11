"use client";
import { useEffect, useRef } from "react";

const ThreeSixtyViewer = ({ imageUrl }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null); // Store the viewer instance

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure it's running on client-side

    // If viewerRef already has an instance, skip initialization
    if (viewerRef.current) {
      console.log("Viewer already initialized. Skipping reinitialization.");
      return;
    }

    // Load Panolens dynamically
    import("panolens")
      .then((PANOLENS) => {
        if (!imageUrl) {
          console.error("No image URL provided for 360 viewer.");
          return;
        }

        console.log("Loading 360 image:", imageUrl);

        try {
          const panorama = new PANOLENS.ImagePanorama(imageUrl);
          const viewer = new PANOLENS.Viewer({ container: containerRef.current });

          viewer.add(panorama);
          viewerRef.current = viewer; // Store the viewer instance for cleanup

          panorama.addEventListener("load", () => {
            console.log("360 image loaded successfully.");
          });

          panorama.addEventListener("error", (error) => {
            console.error("Error loading 360 image:", error);
          });
        } catch (error) {
          console.error("Unexpected error in Panolens:", error);
        }
      })
      .catch((error) => console.error("Error importing Panolens:", error));

    // Cleanup the viewer when the component unmounts
    return () => {
      if (viewerRef.current) {
        viewerRef.current.dispose(); // Clean up the viewer instance
        viewerRef.current = null;
      }
    };
  }, [imageUrl]); // Re-run when imageUrl changes

  return <div ref={containerRef} style={{ width: "100%", height: "500px" }} />;
};

export default ThreeSixtyViewer;
