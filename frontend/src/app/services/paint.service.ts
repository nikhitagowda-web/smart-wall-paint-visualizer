import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface PaintColor {
  _id?: string;
  name: string;
  hex: string;
  brand: string;
}

export interface Project {
  _id: string;
  roomName?: string;
  imageUrl?: string;
  colorName?: string;
  color: string;
  finish: string;
  opacity: number;
  rating: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaintService {
  private initialColors: PaintColor[] = [
    { _id: '1', name: 'Ocean Blue', hex: '#2563eb', brand: 'Asian Paints' },
    { _id: '2', name: 'Emerald Green', hex: '#059669', brand: 'Dulux' },
    { _id: '3', name: 'Sunset Orange', hex: '#ea580c', brand: 'Nippon' },
    { _id: '4', name: 'Modern Gray', hex: '#6b7280', brand: 'Berger' },
    { _id: '5', name: 'Royal Purple', hex: '#7c3aed', brand: 'Asian Paints' },
    { _id: '6', name: 'Crisp White', hex: '#f8fafc', brand: 'Dulux' }
  ];

  private projects: Project[] = [
    {
      _id: 'proj-101',
      roomName: 'Living Room - Modern Accent',
      colorName: 'Ocean Blue',
      color: '#2563eb',
      finish: 'matte',
      opacity: 0.70,
      rating: 5,
      createdAt: '2026-07-15T10:30:00Z'
    },
    {
      _id: 'proj-102',
      roomName: 'Master Bedroom - Emerald Wall',
      colorName: 'Emerald Green',
      color: '#059669',
      finish: 'eggshell',
      opacity: 0.65,
      rating: 5,
      createdAt: '2026-07-20T14:15:00Z'
    },
    {
      _id: 'proj-103',
      roomName: 'Dining Room - Sunset Feature',
      colorName: 'Sunset Orange',
      color: '#ea580c',
      finish: 'satin',
      opacity: 0.80,
      rating: 4,
      createdAt: '2026-07-28T09:45:00Z'
    },
    {
      _id: 'proj-104',
      roomName: 'Home Office - Minimalist Gray',
      colorName: 'Modern Gray',
      color: '#6b7280',
      finish: 'matte',
      opacity: 0.60,
      rating: 5,
      createdAt: '2026-08-02T16:20:00Z'
    },
    {
      _id: 'proj-105',
      roomName: 'Guest Bedroom - Soft Lavender',
      colorName: 'Royal Purple',
      color: '#7c3aed',
      finish: 'glossy',
      opacity: 0.75,
      rating: 5,
      createdAt: '2026-08-08T11:10:00Z'
    }
  ];

  constructor(private http: HttpClient) {}

  getColors(): Observable<PaintColor[]> {
    return of(this.initialColors);
  }

  getProjects(): Observable<Project[]> {
    return of(this.projects);
  }

  saveProject(newProjectData: Partial<Project>): Project {
    const newProject: Project = {
      _id: 'proj-' + Date.now(),
      roomName: newProjectData.roomName || 'Custom Virtual Room',
      colorName: newProjectData.colorName || 'Custom Paint',
      color: newProjectData.color || '#2563eb',
      finish: newProjectData.finish || 'matte',
      opacity: newProjectData.opacity || 0.65,
      rating: newProjectData.rating || 5,
      createdAt: new Date().toISOString()
    };

    this.projects.unshift(newProject);
    return newProject;
  }

  deleteProject(projectId: string): void {
    this.projects = this.projects.filter(p => p._id !== projectId);
  }

  updateProjectRating(projectId: string, newRating: number): void {
    const project = this.projects.find(p => p._id === projectId);
    if (project) {
      project.rating = newRating;
    }
  }

  getProjectsCount(): number {
    return this.projects.length;
  }

  getAverageRating(): string {
    if (this.projects.length === 0) return '0.0 / 5.0';
    const sum = this.projects.reduce((acc, p) => acc + (p.rating || 5), 0);
    const avg = (sum / this.projects.length).toFixed(1);
    return `${avg} / 5.0`;
  }
}