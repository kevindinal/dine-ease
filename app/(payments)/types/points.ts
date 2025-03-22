// types/points.ts
export interface UserPoints {
    userId: string;
    points: number;
    lastUpdated: Date | string;
  }
  
  export interface AddPointsParams {
    userId: string;
    pointsToAdd: number;
  }