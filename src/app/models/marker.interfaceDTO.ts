export interface IMarker {
  id: number;
  lat: number;
  lng: number;
  title: string;
  description: string;
  temperature: number;
  humidity: number;
  lastUpdated?: Date;
  }