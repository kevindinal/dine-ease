declare module "panolens" {
    export class ImagePanorama {
      constructor(url: string)
      addEventListener(event: string, callback: (event?: any) => void): void
    }
  
    export class Viewer {
      constructor(options: {
        container: HTMLElement | null
        controlBar?: boolean
        autoRotate?: boolean
        autoRotateSpeed?: number
        enableReticle?: boolean
      })
      add(panorama: ImagePanorama): void
      dispose(): void
    }
  }
  
  