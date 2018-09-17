import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ErrorsModule } from './errors/errors.module';
import { SocketService } from './socket.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorInterceptorService } from './error-logg.service';
import { NotFoundComponent } from './errors/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    ErrorsModule,
    UserModule,
    DashboardModule,
    HttpClientModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      {path:'*',component:NotFoundComponent},
      {path:'**',component:NotFoundComponent}
    ])
  ],
  providers: [AppService,SocketService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    }
  ],
  entryComponents:[],
  bootstrap: [AppComponent]
})
export class AppModule { }
