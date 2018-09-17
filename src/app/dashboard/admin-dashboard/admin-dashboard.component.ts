import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../socket.service';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit,OnDestroy {
  public allUsers=[];
  private observer: ISubscription;
  constructor(private socketService:SocketService,private router:Router,private toastr:ToastrService) { 
  }
  private pageValue=0;
  public loaderState:boolean=false;
  ngOnInit() {
  this.fetchAllUsers();
  this.onAllUsers();
  }
  ngOnDestroy(){
    this.observer.unsubscribe();
  }
  public fetchAllUsers=()=>{
    this.socketService.getAllUsers(this.pageValue*5);
  }
  public onAllUsers=()=>{
    this.observer=this.socketService.allUsersList().subscribe((list)=>{
      let previousList=(this.allUsers.length>0)?this.allUsers.slice():[];
      if( Object.keys(list).length!=0){
        let i=0,temp=[];
        for(let x in list){
          if(list.hasOwnProperty(x)){
            temp[i]={'userName':JSON.parse(list[x]).name,'userId':x,'email':JSON.parse(list[x]).email}
            i++;
          }
        }
        this.allUsers=temp.concat(previousList);
      }else{
        this.toastr.info("All users have been loaded.");
        this.allUsers=previousList;
      }
      setTimeout(() => {this.loaderState=false },1000);
    },(err)=>{
      setTimeout(() => {this.loaderState=false },1000);
    })
  }
  public goToDashboard=(user)=>{
    Cookie.set('email',user.email)
    this.router.navigate([`/dashboard/${user.userId}`])
  }
  moreUsers=()=>{
    this.loaderState=true;
    this.pageValue++;
    this.fetchAllUsers();
  }
}
