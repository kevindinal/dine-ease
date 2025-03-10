"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ARMealViewerProps {
  mealId: string;
  modelUrl?: string;
  className?: string;
  fallbackImageUrl?: string;
}

const ARMealViewer: React.FC<ARMealViewerProps> = ({ 
  mealId, 
  modelUrl, 
  className = '',
  fallbackImageUrl
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef<boolean>(true);
  const [isARSupported, setIsARSupported] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [fetchAttempts, setFetchAttempts] = useState<number>(0);
  const [useFallback, setUseFallback] = useState<boolean>(false);
  
  // Default model URL if not provided
  const defaultModelUrl = `/models/meals/${mealId}.glb`;
  const effectiveModelUrl = modelUrl || defaultModelUrl;
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(mobile);
    };
    
    checkMobile();
    
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  // Check AR support
  useEffect(() => {
    const checkARSupport = async () => {
      try {
        if (typeof window !== 'undefined' && 'xr' in navigator) {
          const supported = await (navigator as any).xr.isSessionSupported('immersive-ar');
          if (mountedRef.current) {
            setIsARSupported(supported);
          }
        }
      } catch (error) {
        console.error("Error checking AR support:", error);
        if (mountedRef.current) {
          setIsARSupported(false);
        }
      }
    };
    
    checkARSupport();
  }, []);
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || useFallback) return;
    
    // Create references that will be managed by this effect scope only
    let scene: THREE.Scene | null = new THREE.Scene();
    let camera: THREE.PerspectiveCamera | null = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    let renderer: THREE.WebGLRenderer | null = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    let controls: OrbitControls | null = null;
    let model: THREE.Object3D | null = null;
    let animationFrameId: number | null = null;
    let abortController: AbortController | null = new AbortController();
    
    // Setup renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Append canvas to container
    if (containerRef.current) {
      const canvas = renderer.domElement;
      
      // Remove any existing canvases first to avoid duplication
      containerRef.current.querySelectorAll('canvas').forEach(el => {
        el.remove();
      });
      
      containerRef.current.appendChild(canvas);
    }
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.z = 5;
    
    // Setup controls for desktop
    if (!isMobile || !isARSupported) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 2;
      controls.maxDistance = 10;
      controls.autoRotate = isAutoRotate;
      controls.autoRotateSpeed = 2.0;
    }
    
    // Helper function to add model to scene
    const processLoadedModel = (loadedModel: THREE.Object3D) => {
      if (!scene || !mountedRef.current) return;
      
      model = loadedModel;
      
      // Center the model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.x = -center.x;
      model.position.y = -center.y;
      model.position.z = -center.z;
      
      // Scale the model appropriately
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 2) {
        const scale = 2 / maxDim;
        model.scale.set(scale, scale, scale);
      }
      
      scene.add(model);
      
      if (mountedRef.current) {
        setIsLoading(false);
        setLoadingProgress(100);
      }
    };
    
    // Function to check if a URL is accessible
    const isUrlAccessible = async (url: string): Promise<boolean> => {
      try {
        if (!abortController) return false;
        
        const response = await fetch(url, {
          method: 'HEAD',
          signal: abortController.signal,
          cache: 'no-cache'
        });
        return response.ok;
      } catch (error) {
        console.warn(`URL ${url} is not accessible:`, error);
        return false;
      }
    };
    
    // Load the model with multiple fallback methods
    const loadModel = async () => {
      if (!scene) return;
      
      if (mountedRef.current) {
        setIsLoading(true);
        setModelError(null);
        setLoadingProgress(0);
      }
      
      // Remove any existing model
      if (model && scene) {
        scene.remove(model);
        model = null;
      }
      
      // First check if the model URL is accessible
      try {
        const isAccessible = await isUrlAccessible(effectiveModelUrl);
        if (!isAccessible) {
          throw new Error(`Model URL ${effectiveModelUrl} is not accessible`);
        }
      } catch (error) {
        console.error("URL accessibility check failed:", error);
        if (fallbackImageUrl && mountedRef.current) {
          console.log("Switching to fallback image");
          setUseFallback(true);
          setIsLoading(false);
          return;
        }
      }
      
      const loader = new GLTFLoader();
      
      // Try different approaches to load the model
      const tryLoadMethods = async () => {
        // Set a maximum number of retries
        const maxRetries = 2;
        let currentTry = 0;
        
        // Method 1: Try direct loading with GLTFLoader
        while (currentTry <= maxRetries) {
          try {
            console.log(`Attempt ${currentTry + 1} of ${maxRetries + 1} to load model`);
            setFetchAttempts(currentTry + 1);
            
            return await new Promise<THREE.Object3D>((resolve, reject) => {
              const onProgress = (xhr: { loaded: number; total: number }) => {
                if (xhr.total === 0) return; // Prevent division by zero
                const progress = Math.floor((xhr.loaded / xhr.total) * 100) || 0;
                if (mountedRef.current) {
                  setLoadingProgress(progress);
                }
                console.log(progress + '% loaded');
              };
              
              const onError = (error: ErrorEvent) => {
                console.error(`Error loading model (attempt ${currentTry + 1}):`, error);
                reject(new Error(`Loading failed: ${error.message || 'Unknown error'}`));
              };
              
              // Add cache-busting parameter for retries
              const urlWithCacheBust = currentTry > 0 
                ? `${effectiveModelUrl}?retry=${Date.now()}` 
                : effectiveModelUrl;
              
              loader.load(urlWithCacheBust, (gltf) => resolve(gltf.scene), onProgress);
            });
          } catch (error) {
            console.error(`Method 1 attempt ${currentTry + 1} failed:`, error);
            
            if (currentTry === maxRetries) {
              // If we've exhausted retries, try method 2
              break;
            }
            
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            currentTry++;
          }
        }
        
        // Method 2: Try with fetch API 
        try {
          console.log("Trying Method 2: Fetch API with blob URL");
          
          if (!abortController) {
            abortController = new AbortController();
          }
          
          const response = await fetch(effectiveModelUrl, {
            method: 'GET',
            credentials: 'same-origin',  // Try with credentials for same-origin
            mode: 'cors',
            cache: 'no-store',  // Bypass cache completely
            signal: abortController.signal,
            headers: {
              'Accept': 'application/octet-stream, model/gltf-binary, */*'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Network response error: ${response.status} ${response.statusText}`);
          }
          
          const blob = await response.blob();
          const objectURL = URL.createObjectURL(blob);
          
          try {
            return await new Promise<THREE.Object3D>((resolve, reject) => {
              loader.load(
                objectURL,
                (gltf) => {
                  URL.revokeObjectURL(objectURL);
                  resolve(gltf.scene);
                },
                (xhr) => {
                  if (xhr.total === 0) return;
                  const progress = Math.floor((xhr.loaded / xhr.total) * 100) || 0;
                  if (mountedRef.current) {
                    setLoadingProgress(progress);
                  }
                },
                (error) => {
                  URL.revokeObjectURL(objectURL);
                  console.error('Error loading from blob URL:', error);
                  reject(new Error(`Blob URL loading failed:`));
                }
              );
            });
          } catch (blobErr) {
            URL.revokeObjectURL(objectURL);
            throw blobErr;
          }
        } catch (err2) {
          console.error("Method 2 failed:", err2);
          
          // Method 3: Last resort - try with XMLHttpRequest
          try {
            console.log("Trying Method 3: XMLHttpRequest");
            return await new Promise<THREE.Object3D>((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open('GET', effectiveModelUrl, true);
              xhr.responseType = 'arraybuffer';
              
              xhr.onprogress = (event) => {
                if (event.lengthComputable && event.total > 0) {
                  const progress = Math.floor((event.loaded / event.total) * 100);
                  if (mountedRef.current) {
                    setLoadingProgress(progress);
                  }
                }
              };
              
              xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                  const arrayBuffer = xhr.response;
                  loader.parse(
                    arrayBuffer,
                    '',
                    (gltf) => {
                      resolve(gltf.scene);
                    },
                    (error) => {
                      console.error('Error parsing GLB data:', error);
                      reject(new Error(`Parsing failed: ${error.message || 'Unknown error'}`));
                    }
                  );
                } else {
                  reject(new Error(`XHR failed with status: ${xhr.status}`));
                }
              };
              
              xhr.onerror = function() {
                reject(new Error('XHR request failed'));
              };
              
              xhr.send();
            });
          } catch (err3) {
            console.error("Method 3 failed:", err3);
            throw new Error(`All loading methods failed. Last error: ${err3 instanceof Error ? err3.message : String(err3)}`);
          }
        }
      };
      
      // Try to load with fallback methods
      try {
        const loadedModel = await tryLoadMethods();
        processLoadedModel(loadedModel);
      } catch (finalError) {
        console.error("All loading methods failed:", finalError);
        
        if (mountedRef.current) {
          if (fallbackImageUrl) {
            console.log("Switching to fallback image after loading failures");
            setUseFallback(true);
            setIsLoading(false);
          } else {
            setModelError(`Could not load the 3D model: ${finalError instanceof Error ? finalError.message : String(finalError)}`);
            setIsLoading(false);
          }
        }
      }
    };
    
    // Load model initially
    loadModel().catch(error => {
      console.error("Unhandled error in loadModel:", error);
      if (mountedRef.current) {
        if (fallbackImageUrl) {
          setUseFallback(true);
          setIsLoading(false);
        } else {
          setModelError(`Unexpected error loading model: ${error.message || 'Unknown error'}`);
          setIsLoading(false);
        }
      }
    });
    
    // Animation loop
    const animate = () => {
      if (!scene || !camera || !renderer) return;
      
      if (controls) {
        controls.update();
      }
      
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      mountedRef.current = false;
      
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      
      if (controls) {
        controls.dispose();
        controls = null;
      }
      
      if (model) {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) {
              child.geometry.dispose();
            }
            
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(material => material.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
        
        if (scene) {
          scene.remove(model);
        }
        model = null;
      }
      
      if (renderer) {
        const domElement = renderer.domElement;
        
        try {
          if (domElement.parentElement) {
            domElement.parentElement.removeChild(domElement);
          }
        } catch (e) {
          console.warn("Could not remove renderer DOM element via parentElement:", e);
          try {
            if (containerRef.current && containerRef.current.contains(domElement)) {
              containerRef.current.removeChild(domElement);
            }
          } catch (e2) {
            console.warn("Could not remove renderer DOM element via containerRef either:", e2);
          }
        }
        
        renderer.dispose();
        renderer = null;
      }
      
      if (scene) {
        while (scene.children.length > 0) {
          const object = scene.children[0];
          scene.remove(object);
        }
        scene = null;
      }
      
      camera = null;
    };
  }, [isMobile, isARSupported, isAutoRotate, effectiveModelUrl, fallbackImageUrl, useFallback, fetchAttempts]);
  
  const toggleAutoRotate = () => {
    setIsAutoRotate(prev => !prev);
  };
  
  const startARSession = async () => {
    if (!('xr' in navigator)) {
      setModelError("AR is not supported on this device.");
      return;
    }
    
    try {
      const session = await (navigator as any).xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test']
      });
      
      console.log("AR session started successfully");
      
    } catch (error) {
      console.error("Error starting AR session:", error);
      setModelError("Failed to start AR session. Your device may not support AR or you need to allow camera access.");
    }
  };
  
  // Function to retry loading when it fails
  const handleRetry = () => {
    // Force remount of the component
    setIsLoading(true);
    setModelError(null);
    setUseFallback(false);
    
    // Increment fetch attempts to force reload with new URL parameters
    setFetchAttempts(prev => prev + 1);
  };
  
  // Show fallback image if 3D model fails to load
  if (useFallback && fallbackImageUrl) {
    return (
      <div className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 ${className}`}>
        <img 
          src={fallbackImageUrl} 
          alt={`${mealId} image`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-gray-800 text-white font-medium rounded-xl shadow-md hover:bg-gray-900 transition-colors"
          >
            Try 3D View
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef} 
      className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-70 z-10">
          <div className="text-lg font-medium text-gray-700 mb-2">Loading 3D Model...</div>
          <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <div className="mt-1 text-sm text-gray-600">{loadingProgress}%</div>
        </div>
      )}
      
      {modelError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-100 bg-opacity-70 z-10 p-4">
          <div className="text-center text-red-700 mb-4">{modelError}</div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-xl shadow-md hover:bg-red-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 right-4 flex justify-between z-10">
        {isMobile && isARSupported && !isLoading && !modelError && (
          <button
            onClick={startARSession}
            className="px-4 py-2 bg-red-500 text-white font-medium rounded-xl shadow-md hover:bg-red-600 transition-colors"
          >
            View in AR
          </button>
        )}
        
        {(!isMobile || !isARSupported) && !isLoading && !modelError && (
          <button
            onClick={toggleAutoRotate}
            className="px-4 py-2 bg-gray-800 text-white font-medium rounded-xl shadow-md hover:bg-gray-900 transition-colors"
          >
            {isAutoRotate ? 'Pause Rotation' : 'Start Rotation'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ARMealViewer;