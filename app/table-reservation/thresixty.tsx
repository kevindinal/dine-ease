"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

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

  useEffect(() => {
    if (typeof window === "undefined") return // Ensure it's running on client-side

    // Clean up previous viewer if it exists
    if (viewerRef.current) {
      viewerRef.current.dispose()
      viewerRef.current = null
    }

    setIsLoading(true)
    setError(null)

    // Load Panolens dynamically
    import("panolens")
      .then((PANOLENS) => {
        if (!imageUrl) {
          setError("No image URL provided for 360 viewer.")
          setIsLoading(false)
          return
        }

        try {
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
            setIsLoading(false)
          })

          // Handle panorama error event
          panorama.addEventListener("error", (error: any) => {
            console.error("Error loading 360 image:", error)
            setError("Failed to load 360° image. Please try again later.")
            setIsLoading(false)
          })

          // Set a timeout to handle cases where the load event doesn't fire
          const timeout = setTimeout(() => {
            if (isLoading) {
              setIsLoading(false)
            }
          }, 10000) // 10 seconds timeout

          return () => clearTimeout(timeout)
        } catch (error) {
          console.error("Unexpected error in Panolens:", error)
          setError("An unexpected error occurred. Please try again later.")
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.error("Error importing Panolens:", error)
        setError("Failed to load 360° viewer. Please try again later.")
        setIsLoading(false)
      })

    // Cleanup the viewer when the component unmounts or when imageUrl changes
    return () => {
      if (viewerRef.current) {
        viewerRef.current.dispose() // Clean up the viewer instance
        viewerRef.current = null
      }
    }
  }, [imageUrl]) // Re-run when imageUrl changes

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-sm text-gray-600">Loading 360° view...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
          <div className="bg-white p-4 rounded-lg shadow-md max-w-xs text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-sm text-gray-600">Please check your connection and try again.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThreeSixtyViewer

