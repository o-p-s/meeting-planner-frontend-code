import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[NavbarComponent]
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService,private navbar:NavbarComponent,
    private socketService:SocketService){}

  ngOnInit() {
  }

  public goToForgotPassword: any = () => {

    this.router.navigate(['/forgot-password']);

  } // end goToSignUp
  public signinFunction: any = () => {

    if (!this.email) {
      this.toastr.warning('enter email')

    } else if (!this.password) {

      this.toastr.warning('enter password')

    } else if(!this.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
      this.toastr.warning('Enter valid email!')
    } else {

      let data = {
        email: this.email,
        password: this.password
      }

      this.appService.signinFunction(data).subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
             Cookie.set('authtoken', apiResponse.data.authToken);
             Cookie.set('userId', apiResponse.data.userDetails.userId);
             Cookie.set('userName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
             this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
             this.navbar.username=Cookie.get('userName'); 
             if(apiResponse.data.userDetails.email.substring(apiResponse.data.userDetails.email.indexOf('admin'),apiResponse.data.userDetails.email.indexOf('@'))==='admin'){
              this.router.navigate(['/admin']); 
             }else{
              this.socketService.setUserToList(apiResponse.data.authToken);
              this.router.navigate([`/dashboard/${apiResponse.data.userDetails.userId}`]); 
             } 
             this.toastr.success(apiResponse.message);
          }else {
            this.toastr.error(apiResponse.message)
          }
        });

    } // end condition

  } // end signinFunction

}