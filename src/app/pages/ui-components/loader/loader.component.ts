import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule],
  template: `
    <div *ngIf="visible" [ngClass]="wrapperClass">
      <mat-progress-spinner
        [diameter]="size"
        mode="indeterminate"
        color="primary"
      ></mat-progress-spinner>
    </div>
  `,
  styles: [`
    .fullscreen-loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(255, 255, 255, 0.75);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .overlay-loader {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .inline-loader {
      display: inline-block;
      margin-left: 8px;
      vertical-align: middle;
    }
  `],

})
export class LoaderComponent {
  @Input() visible = false;
  @Input() mode: 'inline' | 'overlay' | 'fullscreen' = 'inline';
  @Input() size = 40;

  get wrapperClass(): string {
    return {
      fullscreen: 'fullscreen-loader',
      overlay: 'overlay-loader',
      inline: 'inline-loader',
    }[this.mode] ?? 'inline-loader';
  }
}
