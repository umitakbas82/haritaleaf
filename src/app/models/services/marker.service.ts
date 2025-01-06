import { Injectable } from '@angular/core';
import { IMarker } from '../marker.interfaceDTO';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor() { }

 markers: IMarker[] = [
    {
      id: 1,
      lat: 41.0082,
      lng: 28.9784,
      title: 'İstanbul',
      description: 'Tarihi Yarımada',
      temperature: 25,
      humidity: 65,
      lastUpdated: new Date()
    },
    {
      id: 2,
      lat: 39.9334,
      lng: 32.8597,
      title: 'İstanbul',
      description: 'Tarihi Yarımada',
      temperature: 25,
      humidity: 65,
      lastUpdated: new Date()
    },
    // Diğer noktalar...
  ];

  getMarkers(): IMarker[] {
    return this.markers;
  }


  searchMarkers(searchTerm: string): IMarker[] {
    searchTerm = searchTerm.toLowerCase().trim();
    return this.markers.filter(marker => 
      marker.title.toLowerCase().includes(searchTerm) ||
      marker.description.toLowerCase().includes(searchTerm)
    );
  }


  updateMarkerData(id: number, data: Partial<IMarker>): void {
    const index = this.markers.findIndex(m => m.id === id);
    if (index !== -1) {
      this.markers[index] = {
        ...this.markers[index],
        ...data,
        lastUpdated: new Date()
      };
    }
  }
}
