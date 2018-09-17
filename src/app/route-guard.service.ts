import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AppService } from './app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from './socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {
  constructor(private router:Router,private appService:AppService,private toastr:ToastrService,
    private socketService:SocketService) { 
      this.socketService.authError().subscribe((data)=>{
          this.removeSession();
      })
    }
 removeSession=()=>{
  Cookie.deleteAll('/','localhost');
  this.appService.loggedIn=false;
  this.router.navigate(['/login']);
 }

  canActivate(route : ActivatedRouteSnapshot) : boolean{
    if(this.appService.getUserInfoFromLocalStorage()!=undefined && this.appService.getUserInfoFromLocalStorage()!==null
      && Cookie.get('authtoken') !== undefined && Cookie.get('authtoken') !== null ){
        this.socketService.verifySession(Cookie.get('authtoken'));
        this.appService.loggedIn=true;
          if(this.appService.getUserInfoFromLocalStorage().email.substring(this.appService.getUserInfoFromLocalStorage().email.indexOf('admin'),this.appService.getUserInfoFromLocalStorage().email.indexOf('@'))==='admin'){        
            this.appService.isAdmin=true;
            if(route.routeConfig.path=='' && this.appService.loggedIn)this.router.navigate(['/admin']);
          }else {
            if((route.routeConfig.path=='admin' || route.routeConfig.path=='') && this.appService.loggedIn){            
              this.router.navigate(['/dashboard',Cookie.get('userId')]);return false;
            }
          }
        return true;
        
      }else{
        this.removeSession();
        return false;
      } 
  }
}
