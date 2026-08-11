import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-guide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="guide-container">
      <h2>How to Use Smart Wall Paint Visualizer</h2>
      <p class="subtitle">Follow these 5 simple steps to virtually transform and paint your room walls!</p>

      <div class="steps-list">
        <div class="step-card">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Upload Room Photo</h3>
            <p>Click on the upload box and select a clear, well-lit image of your room in JPG or PNG format.</p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Outline Wall Area</h3>
            <p>Use your mouse to click corner points directly on the wall you want to paint. Connecting points will create a highlighted polygon selection area.</p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>Select Paint Swatches & Finishes</h3>
            <p>Choose your desired paint color from major brand swatches (Behr, Sherwin-Williams) or toggle Dual-Tone Wall mode. Select paint finishes like Matte or Glossy.</p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">4</div>
          <div class="step-content">
            <h3>Compare Before & After Preview</h3>
            <p>Use the "Show Original (Before)" and "Show Painted (After)" toggle button to compare the unpainted room photo directly against your virtual design.</p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">5</div>
          <div class="step-content">
            <h3>Save & Download Image</h3>
            <p>Click "Download Image" to instantly save your painted design high-res PNG image directly to your device!</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .guide-container { padding: 24px; max-width: 900px; margin: 0 auto; font-family: Arial, sans-serif; }
    h2 { color: #0f172a; margin-bottom: 6px; }
    .subtitle { color: #64748b; margin-bottom: 24px; }
    .steps-list { display: flex; flex-direction: column; gap: 16px; }
    .step-card { display: flex; align-items: center; gap: 16px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 8px; }
    .step-number { background-color: #0284c7; color: white; font-weight: bold; font-size: 20px; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .step-content h3 { margin: 0 0 4px 0; color: #1e293b; font-size: 16px; }
    .step-content p { margin: 0; color: #475569; font-size: 14px; }
  `]
})
export class UserGuideComponent {}