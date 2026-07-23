import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaintService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getColors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/colors`);
  }

  uploadRoomImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('roomImage', file);
    return this.http.post(`${this.apiUrl}/projects/upload`, formData, this.getAuthHeaders());
  }

  saveProject(projectData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/save`, projectData, this.getAuthHeaders());
  }

  getMyProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects/my-projects`, this.getAuthHeaders());
  }
}