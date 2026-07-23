import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaintService } from '../../services/paint.service';

@Component({
  selector: 'app-my-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-projects.component.html',
  styleUrl: './my-projects.component.css'
})
export class MyProjectsComponent implements OnInit {
  projects: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private paintService: PaintService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.isLoading = true;
    this.paintService.getMyProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to load your saved projects.';
      }
    });
  }
}