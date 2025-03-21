// "use client"

// import React, { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
// import Script from 'next/script';

// // Create a custom component that renders the model-viewer as a div with dangerouslySetInnerHTML
// // This avoids TypeScript JSX issues with custom elements
// const ModelViewerRaw = () => {
//   // Hardcoded path to sample.glb in the public folder
//   const arModelUrl = '/sample.glb';
  
//   const modelViewerHtml = `
//     <model-viewer
//       src="${arModelUrl}"
//       ar
//       ar-modes="webxr scene-viewer quick-look"
//       camera-controls
//       touch-action="pan-y"
//       auto-rotate
//       shadow-intensity="1"
//       style="width: 100%; height: 100%;"
//       crossorigin="anonymous"
//     >
//       <button slot="ar-button" class="bg-red-500 text-white px-4 py-2 rounded absolute bottom-4 right-4">
//         View in AR
//       </button>
//     </model-viewer>
//   `;

//   return (
//     <>
//       <Script 
//         src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
//         type="module"
//       />
//       <div 
//         className="w-full h-full"
//         dangerouslySetInnerHTML={{ __html: modelViewerHtml }}
//       />
//     </>
//   );
// };

// // Dynamic import for Three.js (3D view on desktop)
// const ThreeViewerComponent = () => {
//   const [ThreeViewer, setThreeViewer] = useState<any>(null);
  
//   // Hardcoded path to sample.glb in the public folder
//   const arModelUrl = '/sample.glb';

//   useEffect(() => {
//     // Dynamically import Three.js components
//     import('@react-three/fiber').then(() => {
//       import('@react-three/drei').then(() => {
//         const ThreeViewerImpl = () => {
//           const { Canvas } = require('@react-three/fiber');
//           const { OrbitControls, useGLTF, Stage } = require('@react-three/drei');
          
//           const Model = () => {
//             const gltf = useGLTF(arModelUrl);
//             return <primitive object={gltf.scene} scale={1} />;
//           };
          
//           return (
//             <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
//               <Stage environment="city" intensity={0.6}>
//                 <Model />
//               </Stage>
//               <OrbitControls autoRotate />
//             </Canvas>
//           );
//         };
        
//         setThreeViewer(() => ThreeViewerImpl);
//       });
//     });
//   }, []);

//   if (!ThreeViewer) {
//     return (
//       <div className="w-full h-full flex items-center justify-center bg-gray-100">
//         <div className="text-gray-500">Loading 3D viewer...</div>
//       </div>
//     );
//   }

//   return <ThreeViewer />;
// };

// const MealModelViewer: React.FC = () => {
//   const [isMobile, setIsMobile] = useState(false);
  
//   useEffect(() => {
//     // Check if device is mobile
//     const checkMobile = () => {
//       const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
//       const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
//       setIsMobile(mobileRegex.test(userAgent));
//     };
    
//     checkMobile();
    
//     // Recheck on resize
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Lazy load the appropriate viewer component
//   const ViewerComponent = dynamic(
//     () => Promise.resolve(isMobile ? ModelViewerRaw : ThreeViewerComponent),
//     { 
//       ssr: false,
//       loading: () => (
//         <div className="w-full h-full flex items-center justify-center bg-gray-100">
//           <div className="text-gray-500">Loading viewer...</div>
//         </div>
//       )
//     }
//   );

//   return (
//     <div className="w-full h-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
//       <ViewerComponent />
//     </div>
//   );
// };

// export default MealModelViewer;