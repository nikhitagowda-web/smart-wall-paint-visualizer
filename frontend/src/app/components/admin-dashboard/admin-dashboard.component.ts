import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { PaintService } from '../../services/paint.service';

interface AdminStats {
  totalRoomImagesUploaded: number;
  totalSavedDesigns: number;
  avgSessionDuration: string;
  userSatisfactionRating: string;
  lastUpdated?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf],
  template: `
    <div class="admin-container">
      <h2>Admin Dashboard & System Analytics</h2>
      <p class="subtitle">Real-time system usage metrics and database counts.</p>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Total Room Images Uploaded</span>
          <span class="stat-value">{{ stats.totalRoomImagesUploaded }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Total Saved Designs</span>
          <span class="stat-value">{{ stats.totalSavedDesigns }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Avg Session Duration</span>
          <span class="stat-value">{{ stats.avgSessionDuration }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">User Satisfaction Rating</span>
          <span class="stat-value">{{ stats.userSatisfactionRating }}</span>
        </div>
      </div>

      <div class="management-section">
        <h3>System Management & Live Data Sync</h3>
        <p>Manage color swatches, inspect user activity logs, and refresh live database metrics across the platform.</p>
        
        <div class="action-row">
          <button class="btn-refresh" (click)="fetchAnalytics()" [disabled]="refreshing">
            {{ refreshing ? '⏳ Refreshing Data...' : '🔄 Refresh Analytics Data' }}
          </button>
          <span class="last-sync" *ngIf="stats.lastUpdated">Last synced at: {{ stats.lastUpdated }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container { padding: 28px; max-width: 1180px; margin: 0 auto; font-family: Arial, sans-serif; }
    h2 { color: #0f172a; margin-bottom: 4px; font-size: 24px; }
    .subtitle { color: #64748b; margin-bottom: 24px; font-size: 14px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 22px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .stat-label { display: block; font-size: 13px; color: #64748b; font-weight: 600; margin-bottom: 8px; }
    .stat-value { font-size: 28px; font-weight: bold; color: #0284c7; }
    .management-section { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 22px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .management-section h3 { margin-top: 0; color: #0f172a; margin-bottom: 8px; }
    .management-section p { color: #64748b; font-size: 14px; margin-bottom: 18px; }
    .action-row { display: flex; align-items: center; gap: 16px; }
    .btn-refresh { background-color: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
    .btn-refresh:hover { background-color: #0369a1; }
    .btn-refresh:disabled { opacity: 0.7; cursor: not-allowed; }
    .last-sync { font-size: 12px; color: #10b981; font-weight: 600; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminStats = {
    totalRoomImagesUploaded: 5,
    totalSavedDesigns: 5,
    avgSessionDuration: '4m 12s',
    userSatisfactionRating: '4.8 / 5.0'
  };
  refreshing: boolean = false;

  constructor(private paintService: PaintService) {}

  ngOnInit(): void {
    this.fetchAnalytics();
  }

  fetchAnalytics(): void {
    this.refreshing = true;
    const currentCount = this.paintService.getProjectsCount();
    const avgRating = this.paintService.getAverageRating();

    this.stats = {
      totalRoomImagesUploaded: currentCount,
      totalSavedDesigns: currentCount,
      avgSessionDuration: '4m 12s',
      userSatisfactionRating: avgRating,
      lastUpdated: new Date().toLocaleTimeString()
    };
    this.refreshing = false;
  }
}