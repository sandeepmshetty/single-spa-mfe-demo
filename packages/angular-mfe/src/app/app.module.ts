import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { NotFoundComponent } from './not-found/not-found.component';

// Services
import { SharedServicesService } from './services/shared-services.service';
import { DashboardService } from './services/dashboard.service';
import { AnalyticsService } from './services/analytics.service';
import { GlobalErrorHandler } from './services/error-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AnalyticsComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: '**', component: NotFoundComponent }
    ])
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    SharedServicesService,
    DashboardService,
    AnalyticsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }