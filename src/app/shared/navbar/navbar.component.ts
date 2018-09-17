import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public username;
  constructor(private router:Router,public appService:AppService,private toastr:ToastrService,
    private socketService:SocketService ) { }
    ngOnInit() {
      if(Cookie.get('userName')!=undefined)this.username=Cookie.get('userName');
     }
  public logout(){
    this.appService.logout().subscribe((apiResponse) => {
      if (apiResponse.status === 200) {       
        this.socketService.exitSocket()
        this.appService.loggedIn=false;
        Cookie.delete('userName');
        Cookie.delete('userId');
        Cookie.delete('authtoken');
        this.router.navigate(['/login']);
        this.toastr.success(apiResponse.message)
      }else {
        this.toastr.error(apiResponse.message)
      }
    }); 
  }


}
