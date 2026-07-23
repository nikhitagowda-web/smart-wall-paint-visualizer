import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaintService } from '../../services/paint.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-visualizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizer.component.html',
  styleUrl: './visualizer.component.css'
})
export class VisualizerComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasElement') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  colors: any[] = [];
  selectedColor: any = null;
  opacity: number = 0.65;
  finish: string = 'satin';
  projectTitle: string = 'My Living Room Design';

  uploadedImage: HTMLImageElement | null = null;
  uploadedImageUrl: string = '';
  wallPolygons: { x: number; y: number }[][] = [];
  currentPolygon: { x: number; y: number }[] = [];

  isUploading: boolean = false;
  isSaving: boolean = false;
  saveStatusMessage: string = '';

  constructor(public paintService: PaintService, public authService: AuthService) {}

  ngOnInit(): void {
    this.fetchColors();
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
  }

  fetchColors(): void {
    this.paintService.getColors().subscribe({
      next: (data) => {
        this.colors = data;
        if (this.colors.length > 0) {
          this.selectedColor = this.colors[0];
        }
      },
      error: (err) => console.error('Error fetching paint colors:', err)
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    this.isUploading = true;
    this.paintService.uploadRoomImage(file).subscribe({
      next: (res) => {
        this.isUploading = false;
        this.uploadedImageUrl = `http://localhost:5000${res.imageUrl}`;
        this.loadImageToCanvas(this.uploadedImageUrl);
      },
      error: (err) => {
        this.isUploading = false;
        alert(err.error?.message || 'Error uploading image. Make sure you are logged in!');
      }
    });
  }

  loadImageToCanvas(url: string): void {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.uploadedImage = img;
      const canvas = this.canvasRef.nativeElement;
      canvas.width = img.width > 900 ? 900 : img.width;
      const scale = canvas.width / img.width;
      canvas.height = img.height * scale;

      this.wallPolygons = [];
      this.currentPolygon = [];
      this.redrawCanvas();
    };
    img.src = url;
  }

  onCanvasClick(event: MouseEvent): void {
    if (!this.uploadedImage) return;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.currentPolygon.push({ x, y });
    this.redrawCanvas();
  }

  completeWallSelection(): void {
    if (this.currentPolygon.length >= 3) {
      this.wallPolygons.push([...this.currentPolygon]);
      this.currentPolygon = [];
      this.redrawCanvas();
    } else {
      alert('Click at least 3 points on the wall to form a section!');
    }
  }

  clearSelections(): void {
    this.wallPolygons = [];
    this.currentPolygon = [];
    this.redrawCanvas();
  }

  selectColor(color: any): void {
    this.selectedColor = color;
    this.redrawCanvas();
  }

  redrawCanvas(): void {
    if (!this.ctx || !this.uploadedImage) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.drawImage(this.uploadedImage, 0, 0, canvas.width, canvas.height);

    // Draw existing wall selections with selected color
    if (this.selectedColor) {
      this.wallPolygons.forEach((poly) => {
        this.drawPolygon(poly, this.selectedColor.hexCode, this.opacity);
      });
    }

    // Draw active drawing points
    if (this.currentPolygon.length > 0) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#2563eb';
      this.ctx.lineWidth = 2;
      this.currentPolygon.forEach((pt, index) => {
        if (index === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      });
      this.ctx.stroke();

      this.currentPolygon.forEach((pt) => {
        this.ctx.fillStyle = '#2563eb';
        this.ctx.beginPath();
        this.ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
      });
    }
  }

  drawPolygon(points: { x: number; y: number }[], hexColor: string, opacity: number): void {
    if (points.length < 3) return;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.closePath();

    // Convert HEX to RGBA with chosen opacity
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    this.ctx.fill();

    // Apply finish effect (glossy reflection / matte blur)
    if (this.finish === 'glossy') {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  saveProject(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to save your room design projects!');
      return;
    }

    if (!this.uploadedImageUrl) {
      alert('Please upload a room image first!');
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const savedImageUrl = canvas.toDataURL('image/png');

    const projectData = {
      title: this.projectTitle,
      originalImageUrl: this.uploadedImageUrl,
      wallCoordinates: this.wallPolygons,
      selectedColor: this.selectedColor?._id,
      opacity: this.opacity,
      finish: this.finish,
      savedImageUrl: savedImageUrl
    };

    this.isSaving = true;
    this.paintService.saveProject(projectData).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveStatusMessage = 'Project saved successfully to your dashboard!';
        setTimeout(() => (this.saveStatusMessage = ''), 3000);
      },
      error: (err) => {
        this.isSaving = false;
        alert('Failed to save project: ' + (err.error?.message || err.message));
      }
    });
  }
}