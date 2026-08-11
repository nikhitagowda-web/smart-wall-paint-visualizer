import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule, NgStyle, NgIf, NgFor, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PaintService, PaintColor } from '../../services/paint.service';
import { AuthService } from '../../services/auth.service';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-visualizer',
  standalone: true,
  imports: [
    CommonModule,
    NgStyle,
    NgIf,
    NgFor,
    PercentPipe,
    FormsModule,
    RouterLink
  ],
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  imageObj: HTMLImageElement = new Image();
  imageLoaded: boolean = false;
  isLoggedIn: boolean = false;
  isSaving: boolean = false;
  saveMessage: string = '';
  customRoomName: string = '';
  points: Point[] = [];
  
  selectedColor: string = '#2563eb';
  secondaryColor: string = '#f59e0b';
  wallMode: 'solid' | 'dualtone' | 'compare' = 'solid';
  
  selectedFinish: string = 'matte';
  opacity: number = 0.65;
  userRating: number = 5;
  showOriginal: boolean = false;

  colors: PaintColor[] = [];

  constructor(
    private paintService: PaintService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.fetchColors();
  }

  fetchColors(): void {
    this.paintService.getColors().subscribe({
      next: (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.colors = data;
          if (data[0] && data[0].hex) this.selectedColor = data[0].hex;
          if (data[1] && data[1].hex) this.secondaryColor = data[1].hex;
        }
      }
    });
  }

  onFileSelected(event: any): void {
    if (!this.isLoggedIn) {
      alert('🔒 Authentication Required: Please log in or register to upload room photos.');
      this.router.navigate(['/login']);
      return;
    }

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageObj = new Image();
        this.imageObj.crossOrigin = 'anonymous';
        this.imageObj.onload = () => {
          this.imageLoaded = true;
          this.saveMessage = '';
          this.customRoomName = '';
          this.userRating = 5;
          this.initCanvas();
        };
        this.imageObj.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  changeImage(): void {
    this.imageLoaded = false;
    this.points = [];
    this.showOriginal = false;
    this.saveMessage = '';
    this.customRoomName = '';
  }

  initCanvas(): void {
    setTimeout(() => {
      const canvasEl = this.canvas.nativeElement;
      this.ctx = canvasEl.getContext('2d')!;
      canvasEl.width = this.imageObj.width;
      canvasEl.height = this.imageObj.height;
      this.redrawCanvas();
    }, 100);
  }

  onCanvasClick(event: MouseEvent): void {
    if (!this.imageLoaded || this.showOriginal) return;

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const scaleX = this.canvas.nativeElement.width / rect.width;
    const scaleY = this.canvas.nativeElement.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    this.points.push({ x, y });
    this.redrawCanvas();
  }

  redrawCanvas(): void {
    if (!this.ctx || !this.imageLoaded) return;

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.ctx.drawImage(this.imageObj, 0, 0);

    if (this.showOriginal) return;

    if (this.points.length > 0) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.points[0].x, this.points[0].y);

      for (let i = 1; i < this.points.length; i++) {
        this.ctx.lineTo(this.points[i].x, this.points[i].y);
      }

      if (this.points.length > 2) {
        this.ctx.closePath();
        
        if (this.wallMode === 'dualtone') {
          const minY = Math.min(...this.points.map(p => p.y));
          const maxY = Math.max(...this.points.map(p => p.y));
          const gradient = this.ctx.createLinearGradient(0, minY, 0, maxY);
          
          gradient.addColorStop(0, this.hexToRgba(this.selectedColor, this.opacity));
          gradient.addColorStop(1, this.hexToRgba(this.secondaryColor, this.opacity));
          
          this.ctx.fillStyle = gradient;
          this.ctx.fill();
        } else if (this.wallMode === 'compare') {
          const minX = Math.min(...this.points.map(p => p.x));
          const maxX = Math.max(...this.points.map(p => p.x));
          const midX = (minX + maxX) / 2;

          this.ctx.save();
          this.ctx.clip();

          this.ctx.fillStyle = this.hexToRgba(this.selectedColor, this.opacity);
          this.ctx.fillRect(0, 0, midX, this.canvas.nativeElement.height);

          this.ctx.fillStyle = this.hexToRgba(this.secondaryColor, this.opacity);
          this.ctx.fillRect(midX, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

          this.ctx.beginPath();
          this.ctx.moveTo(midX, 0);
          this.ctx.lineTo(midX, this.canvas.nativeElement.height);
          this.ctx.strokeStyle = '#ffffff';
          this.ctx.lineWidth = 3;
          this.ctx.stroke();

          this.ctx.restore();
        } else {
          this.ctx.fillStyle = this.hexToRgba(this.selectedColor, this.opacity);
          this.ctx.fill();
        }

        if (this.selectedFinish === 'glossy') {
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
          this.ctx.fill();
        }
      }

      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      this.points.forEach(p => {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#0284c7';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      });
    }
  }

  toggleBeforeAfter(): void {
    this.showOriginal = !this.showOriginal;
    this.redrawCanvas();
  }

  clearPoints(): void {
    this.points = [];
    this.redrawCanvas();
  }

  setRating(star: number): void {
    this.userRating = star;
  }

  saveDesign(): void {
    if (!this.imageLoaded) return;

    this.isSaving = true;
    this.saveMessage = '';

    const selectedColorObj = this.colors.find(c => c.hex.toLowerCase() === this.selectedColor.toLowerCase());
    const colorName = selectedColorObj ? selectedColorObj.name : `Custom Shade (${this.selectedColor})`;
    
    const finalRoomName = this.customRoomName.trim() !== '' 
      ? this.customRoomName.trim() 
      : `Custom ${colorName} Design`;

    const payload = {
      roomName: finalRoomName,
      colorName: colorName,
      color: this.selectedColor,
      finish: this.selectedFinish,
      opacity: this.opacity,
      rating: this.userRating
    };

    this.paintService.saveProject(payload);

    this.http.post('http://localhost:5000/api/projects/save', payload).subscribe({
      next: () => {},
      error: () => {}
    });

    this.isSaving = false;
    this.saveMessage = `✅ "${finalRoomName}" saved to your designs!`;
  }

  downloadImage(): void {
    if (!this.imageLoaded) return;

    const canvasEl = this.canvas.nativeElement;
    const dataUrl = canvasEl.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'smart-wall-painted-room.png';
    link.href = dataUrl;
    link.click();

    this.saveDesign();
  }

  hexToRgba(hex: string, alpha: number): string {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return `rgba(${(c >> 16) & 255}, ${(c >> 8) & 255}, ${c & 255}, ${alpha})`;
    }
    return `rgba(37, 99, 235, ${alpha})`;
  }
}