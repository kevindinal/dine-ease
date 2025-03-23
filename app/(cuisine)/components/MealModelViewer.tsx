"use client"

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';


const ModelViewerRaw = () => {
  // Hardcoded path to sample.glb in the public folder
  const arModelUrl = '/sample.glb';
  
/**
 * Generates an HTML string for embedding a 3D model viewer.
 * - Uses `<model-viewer>` to render an interactive 3D model.
 * - Supports AR features across various platforms (WebXR, Scene Viewer, Quick Look).
 * - Provides user interaction via camera controls and auto-rotation.
 * - Includes a styled AR button for entering AR mode.
 */ 
  const modelViewerHtml = `
    <model-viewer
      src="${arModelUrl}"
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      touch-action="pan-y"
      auto-rotate
      shadow-intensity="1"
      style="width: 100%; height: 100%;"
      crossorigin="anonymous"
    >
      <button slot="ar-button" class="bg-red-500 text-white px-4 py-2 rounded absolute bottom-4 right-4">
        View in AR
      </button>
    </model-viewer>
  `;

  return (
    <>
      <Script 
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        type="module"
      />
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: modelViewerHtml }}
      />
    </>
  );
};

const ThreeViewerComponent = () => {
  const [ThreeViewer, setThreeViewer] = useState<any>(null);
  
  const arModelUrl = '/sample.glb';
/**
 * Effect to dynamically load and initialize the 3D model viewer component.
 * - Imports `@react-three/fiber` and `@react-three/drei` libraries only when needed (on mount).
 * - Defines `ThreeViewerImpl`, a React component that sets up a 3D scene using `Canvas`, `Stage`, and `OrbitControls`.
 * - Loads and renders a GLTF model from the specified `arModelUrl`.
 * - Uses `setThreeViewer` to update the component state with the viewer implementation.
 * 
 * Dependencies:
 * - Empty dependency array `[]` ensures the effect runs once on mount.
 */
  useEffect(() => {
    import('@react-three/fiber').then(() => {
      import('@react-three/drei').then(() => {
        const ThreeViewerImpl = () => {
          const { Canvas } = require('@react-three/fiber');
          const { OrbitControls, useGLTF, Stage } = require('@react-three/drei');
          
          const Model = () => {
            const gltf = useGLTF(arModelUrl);
            return <primitive object={gltf.scene} scale={1} />;
          };
          
          return (
            <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
              <Stage environment="city" intensity={0.6}>
                <Model />
              </Stage>
              <OrbitControls autoRotate />
            </Canvas>
          );
        };
        
        setThreeViewer(() => ThreeViewerImpl);
      });
    });
  }, []);

  if (!ThreeViewer) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading 3D viewer...</div>
      </div>
    );
  }

  return <ThreeViewer />;
};

const MealModelViewer: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  /**
 * Effect to detect mobile devices based on user agent string.
 * - Checks if the user is on a mobile device by testing the user agent with a regex.
 * - Sets the `isMobile` state accordingly.
 * - Listens for window resize events to update the state if the device screen size changes.
 * - Cleans up the resize event listener when the component unmounts to prevent memory leaks.
 * 
 * Dependencies:
 * - Empty dependency array `[]` ensures this effect runs only once when the component mounts.
 */
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const ViewerComponent = dynamic(
    () => Promise.resolve(isMobile ? ModelViewerRaw : ThreeViewerComponent),
    { 
      ssr: false,
      loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">Loading viewer...</div>
        </div>
      )
    }
  );

  return (
    <div className="w-full h-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
      <ViewerComponent />
    </div>
  );
};

export default MealModelViewer;