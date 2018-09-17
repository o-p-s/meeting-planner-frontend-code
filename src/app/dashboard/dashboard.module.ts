import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { RouteGuardService } from '../route-guard.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { TimePipe } from './time-pipe';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    BrowserAnimationsModule,
    RouterModule.forChild([
      {path:'',component:MeetingsComponent,canActivate:[RouteGuardService],pathMatch:'full'},
      {path:'admin',component:AdminDashboardComponent,canActivate:[RouteGuardService]},
      {path:'dashboard/:userId',component:MeetingsComponent,canActivate:[RouteGuardService]},
    ]),
    NgbModalModule.forRoot(),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  declarations: [AdminDashboardComponent, MeetingsComponent,TimePipe],
  exports:[TimePipe],
  providers:[DatePipe,TimePipe]
})
export class DashboardModule { }
