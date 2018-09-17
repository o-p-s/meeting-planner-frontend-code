import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from './app.service';

@Injectable({
	providedIn: 'root',
})
export class ErrorInterceptorService implements HttpInterceptor {
	constructor(private toastr:ToastrService,private router:Router,private appService:AppService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(catchError(error => {
        if(error.status==404)
        this.toastr.info(error.error.message);
        else if(error.status==500)
        this.router.navigate(['/internal-error'])
        else if(error.status==400)
        this.toastr.error('Bad Request.');
        else if(error.status==401){
          this.toastr.error(error.error.message);
          Cookie.deleteAll('/','localhost');
          this.appService.loggedIn=false;
          this.router.navigate(['/login']);
        }

				return of(error);
			})
		);
  }
}
