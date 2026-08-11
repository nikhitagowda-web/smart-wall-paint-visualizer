import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, TitleCasePipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaintService, Project } from '../../services/paint.service';

@Component({
  selector: 'app-my-projects',
  standalone: true,
  imports: [
    CommonModule, 
    NgIf, 
    NgFor, 
    TitleCasePipe, 
    DatePipe, 
    RouterLink
  ],
  template: `
    <div class="projects-container">
      <div class="header-section">
        <h2>My Saved Designs</h2>
        <p class="subtitle">View, compare, rate, and manage your saved room paint projects.</p>
      </div>

      <div *ngIf="loading" class="loading-state">
        <p>🔄 Loading saved designs...</p>
      </div>

      <div *ngIf="!loading && projects.length === 0" class="empty-state">
        <p>🎨 You haven't saved any room designs yet!</p>
        <a routerLink="/visualizer" class="btn-create">Create Your First Design</a>
      </div>

      <div *ngIf="!loading && projects.length > 0" class="projects-grid">
        <div *ngFor="let p of projects" class="project-card">
          <div class="preview-header">
            <div class="color-swatch-badge" [style.backgroundColor]="p.color"></div>
            <span class="color-name">{{ p.colorName || 'Custom Paint' }}</span>
          </div>

          <div class="project-info">
            <h3>{{ p.roomName || 'Virtual Room Design' }}</h3>
            <div class="info-row">
              <span><strong>Color Code:</strong> {{ p.color }}</span>
            </div>
            <div class="info-row">
              <span><strong>Paint Finish:</strong> {{ p.finish | titlecase }}</span>
            </div>
            <div class="info-row">
              <span><strong>Opacity:</strong> {{ p.opacity * 100 }}%</span>
            </div>
            
            <div class="info-row rating-row">
              <strong>User Rating:</strong>
              <div class="card-star-rating">
                <span 
                  *ngFor="let star of [1, 2, 3, 4, 5]" 
                  class="star" 
                  [class.filled]="star <= (p.rating || 5)"
                  (click)="updateRating(p._id, star)"
                  title="Click to update rating">
                  ★
                </span>
                <span class="rating-num">({{ p.rating || 5 }}/5)</span>
              </div>
            </div>

            <span class="date">Saved on {{ p.createdAt | date:'mediumDate' }}</span>

            <button class="btn-delete" (click)="deleteDesign(p._id)">
              🗑️ Delete Design
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .projects-container { padding: 28px; max-width: 1180px; margin: 0 auto; font-family: Arial, sans-serif; }
    h2 { color: #0f172a; margin-bottom: 4px; font-size: 24px; }
    .subtitle { color: #64748b; margin-bottom: 24px; font-size: 14px; }
    .loading-state { text-align: center; padding: 40px; color: #0284c7; font-weight: bold; }
    .empty-state { text-align: center; padding: 40px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 8px; }
    .btn-create { display: inline-block; margin-top: 12px; background: #0284c7; color: white; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: bold; }
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .project-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.2s; }
    .project-card:hover { transform: translateY(-3px); }
    .preview-header { display: flex; align-items: center; gap: 12px; padding: 16px; background-color: #f8fafc; border-bottom: 1px solid #f1f5f9; }
    .color-swatch-badge { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 0 2px #cbd5e1; }
    .color-name { font-weight: bold; font-size: 15px; color: #0f172a; }
    .project-info { padding: 18px; }
    .project-info h3 { margin: 0 0 12px 0; font-size: 16px; color: #1e293b; }
    .info-row { font-size: 13px; color: #475569; margin-bottom: 6px; }
    .rating-row { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
    .card-star-rating { display: flex; align-items: center; gap: 2px; }
    .star { font-size: 16px; color: #cbd5e1; cursor: pointer; }
    .star.filled { color: #f59e0b; }
    .rating-num { font-size: 12px; font-weight: bold; color: #64748b; margin-left: 4px; }
    .date { font-size: 11px; color: #94a3b8; display: block; margin-top: 12px; padding-top: 8px; border-top: 1px solid #f1f5f9; margin-bottom: 12px; }
    .btn-delete { width: 100%; background-color: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; padding: 8px; border-radius: 6px; font-weight: bold; font-size: 12px; cursor: pointer; transition: background 0.2s; }
    .btn-delete:hover { background-color: #fecaca; }
  `]
})
export class MyProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading: boolean = true;

  constructor(private paintService: PaintService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.paintService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      }
    });
  }

  updateRating(projectId: string, rating: number): void {
    this.paintService.updateProjectRating(projectId, rating);
    this.fetchProjects();
  }

  deleteDesign(projectId: string): void {
    if (confirm('Are you sure you want to delete this saved design?')) {
      this.paintService.deleteProject(projectId);
      this.fetchProjects();
    }
  }
}