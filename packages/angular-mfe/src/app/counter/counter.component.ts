import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { counterActions } from '@single-spa-demo/shared-library';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="counter-container">
      <h2>🅰️ Angular Counter MFE</h2>
      <div class="counter-display">
        <h1>{{ count }}</h1>
      </div>
      <div class="button-group">
        <button (click)="decrement()" class="btn btn-danger">-</button>
        <button (click)="reset()" class="btn btn-secondary">Reset</button>
        <button (click)="increment()" class="btn btn-success">+</button>
      </div>
      <p class="info">✨ Shared state across React, Vue & Angular MFEs</p>
      <p class="info-small">Updates from any MFE will sync across all micro-frontends</p>
    </div>
  `,
  styles: [
    `
      .counter-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      h2 {
        color: #dd0031;
        margin-bottom: 2rem;
        font-size: 2rem;
      }

      .counter-display {
        background: linear-gradient(135deg, #dd0031, #c3002f);
        color: white;
        padding: 3rem 5rem;
        border-radius: 1rem;
        box-shadow: 0 10px 30px rgba(221, 0, 49, 0.3);
        margin-bottom: 2rem;
        min-width: 200px;
        text-align: center;
      }

      .counter-display h1 {
        font-size: 4rem;
        margin: 0;
        font-weight: 700;
      }

      .button-group {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .btn {
        padding: 0.75rem 2rem;
        font-size: 1.25rem;
        font-weight: 600;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        color: white;
      }

      .btn-success {
        background: #28a745;
      }

      .btn-success:hover {
        background: #218838;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
      }

      .btn-danger {
        background: #dc3545;
      }

      .btn-danger:hover {
        background: #c82333;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
      }

      .btn-secondary {
        background: #6c757d;
      }

      .btn-secondary:hover {
        background: #5a6268;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
      }

      .info {
        color: #6c757d;
        font-size: 0.875rem;
        margin-top: 1rem;
        font-weight: 600;
      }

      .info-small {
        color: #6c757d;
        font-size: 0.75rem;
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class CounterComponent implements OnInit, OnDestroy {
  count = 0;
  private unsubscribe?: () => void;

  ngOnInit() {
    // Get initial value
    this.count = counterActions.getValue();

    // Subscribe to changes from other MFEs
    this.unsubscribe = counterActions.subscribe((newValue: number) => {
      this.count = newValue;
    });
  }

  ngOnDestroy() {
    // Cleanup subscription
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  increment() {
    counterActions.increment('angular-mfe');
  }

  decrement() {
    counterActions.decrement('angular-mfe');
  }

  reset() {
    counterActions.reset('angular-mfe');
  }
}
