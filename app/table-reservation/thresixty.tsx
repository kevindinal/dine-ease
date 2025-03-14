"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, RefreshCw, AlertTriangle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

// Use a more explicit approach for dynamic imports
type PanolensDynamicImport = {
  ImagePanorama: new (
    url: string,
  ) => {
    addEventListener: (event: string, callback: (event?: any) => void) => void
  }
  Viewer: new (options: {
    container: HTMLElement | null
    controlBar?: boolean
    autoRotate?: boolean
    autoRotateSpeed?: number
    enableReticle?: boolean
  }) => {
    add: (panorama: any) => void
    dispose: () => void
  }
}

const ThreeSixtyViewer = ({ imageUrl }: { imageUrl: string }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null) // Store the viewer instance
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [corsError, setCorsError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Function to check if the error is a CORS error
  const isCorsError = (errorMessage: string): boolean => {
    return (
      errorMessage.includes("CORS") ||
      errorMessage.includes("cross-origin") ||
      errorMessage.includes("Access-Control-Allow-Origin")
    )
  }

  // Function to validate the image URL
  const validateImageUrl = (url: string): boolean => {
    // Check if URL is valid
    try {
      new URL(url)
      return true
    } catch (e) {
      console.error("Invalid URL format:", url)
      return false
    }
  }

  // Function to preload the image to check if it's accessible
  const preloadImage = (url: string): Promise<{ success: boolean; corsError: boolean }> => {
    return new Promise((resolve) => {
      const img = new Image()

      // Set up error handling before setting src
      img.onerror = (e) => {
        const errorEvent = e as ErrorEvent
        const isCorsProblem = errorEvent.message ? isCorsError(errorEvent.message) : navigator.onLine // If we're online, it's likely a CORS issue

        console.error("Error preloading image:", errorEvent.message || "Unknown error")
        resolve({ success: false, corsError: isCorsProblem })
      }

      img.onload = () => {
        console.log("Image preloaded successfully:", url)
        resolve({ success: true, corsError: false })
      }

      // Set crossOrigin after the event handlers
      img.crossOrigin = "anonymous"
      img.src = url
    })
  }

  const loadViewer = async () => {
    setIsLoading(true)
    setError(null)
    setCorsError(false)

    // Clean up previous viewer if it exists
    if (viewerRef.current) {
      viewerRef.current.dispose()
      viewerRef.current = null
    }

    let timeoutId: NodeJS.Timeout | null = null

    try {
      // Validate the image URL
      if (!imageUrl) {
        setError("No image URL provided for 360 viewer.")
        setIsLoading(false)
        return
      }

      console.log("Attempting to load 360° image:", imageUrl)

      // Validate URL format
      if (!validateImageUrl(imageUrl)) {
        setError("Invalid image URL format.")
        setIsLoading(false)
        return
      }

      // Preload the image to check if it's accessible
      const { success, corsError } = await preloadImage(imageUrl)

      if (!success) {
        if (corsError) {
          console.error("CORS error detected when loading image")
          setCorsError(true)
          setError("CORS policy is blocking access to the 360° image.")
        } else {
          setError("The 360° image could not be accessed. It may be restricted or unavailable.")
        }
        setIsLoading(false)
        return
      }

      // Dynamic import with type assertion
      const PANOLENS = (await import("panolens")) as unknown as PanolensDynamicImport

      // Create a new panorama with the image URL
      const panorama = new PANOLENS.ImagePanorama(imageUrl)

      // Create a new viewer with the container reference
      const viewer = new PANOLENS.Viewer({
        container: containerRef.current,
        controlBar: true,
        autoRotate: true,
        autoRotateSpeed: 0.5,
        enableReticle: false,
      })

      // Add the panorama to the viewer
      viewer.add(panorama)

      // Store the viewer instance for cleanup
      viewerRef.current = viewer

      // Handle panorama load event
      panorama.addEventListener("load", () => {
        console.log("360° image loaded successfully")
        setIsLoading(false)
        if (timeoutId) clearTimeout(timeoutId)
      })

      // Handle panorama error event
      panorama.addEventListener("error", (err: any) => {
        console.error("Error loading 360 image:", err)

        // Check if this might be a CORS error
        if (err && err.message && isCorsError(err.message)) {
          setCorsError(true)
          setError("CORS policy is blocking access to the 360° image.")
        } else {
          const errorDetails = err ? JSON.stringify(err) : "Unknown error"
          setError(`Failed to load 360° image. Error details: ${errorDetails}`)
        }

        setIsLoading(false)
        if (timeoutId) clearTimeout(timeoutId)
      })

      // Set a timeout to handle cases where the load event doesn't fire
      timeoutId = setTimeout(() => {
        if (isLoading) {
          console.warn("360° image loading timed out")
          setIsLoading(false)
          setError("Loading timed out. The image may be too large or in an unsupported format.")
        }
      }, 15000) // 15 seconds timeout

      return () => {
        if (timeoutId) clearTimeout(timeoutId)
      }
    } catch (error) {
      console.error("Error initializing 360° viewer:", error)
      setError("Failed to initialize 360° viewer. Please check your connection and try again.")
      setIsLoading(false)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }

  // Load the viewer when the component mounts or when imageUrl changes
  useEffect(() => {
    if (typeof window === "undefined") return // Ensure it's running on client-side

    loadViewer()

    // Cleanup the viewer when the component unmounts or when imageUrl changes
    return () => {
      if (viewerRef.current) {
        viewerRef.current.dispose() // Clean up the viewer instance
        viewerRef.current = null
      }
    }
  }, [imageUrl, retryCount]) // Re-run when imageUrl changes or when retry is triggered

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1) // This will trigger the useEffect to run again
  }

  // Render a fallback view for CORS errors
  if (corsError) {
    return (
      <div className="relative w-full h-full bg-gray-100 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">CORS Policy Error</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your browser cannot load the 360° image due to Cross-Origin Resource Sharing (CORS) restrictions.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
              <h4 className="font-medium text-amber-800 mb-2">How to fix this:</h4>
              <ol className="text-xs text-left text-amber-700 list-decimal pl-5 space-y-1">
                <li>Configure CORS in your Firebase Storage settings</li>
                <li>
                  Add <code className="bg-amber-100 px-1 rounded">http://localhost:3000</code> to the allowed origins
                </li>
                <li>Or deploy your application to match the allowed origins</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={handleRetry} variant="outline" size="sm" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>

              <Button
                onClick={() =>
                  window.open(
                    "https://firebase.google.com/docs/storage/web/download-files#cors_configuration",
                    "_blank",
                  )
                }
                variant="default"
                size="sm"
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                CORS Setup Guide
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-sm text-gray-600">Loading 360° view...</p>
            <p className="text-xs text-gray-500 mt-1">This may take a moment for large images</p>
          </div>
        </div>
      )}

      {error && !corsError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">The 360° image could not be loaded. This might be due to:</p>
              <ul className="text-xs text-left text-gray-600 list-disc pl-5 space-y-1">
                <li>The image URL is invalid or inaccessible</li>
                <li>The image format is not supported (should be equirectangular)</li>
                <li>The image is too large or corrupted</li>
              </ul>
              <Button onClick={handleRetry} className="mt-4 w-full" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Loading
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThreeSixtyViewer

