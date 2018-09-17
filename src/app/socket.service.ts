import { Injectable  } from '@angular/core';
import * as io from 'socket.io-client';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { AppService } from './app.service';
import { errorHandler } from '@angular/platform-browser/src/browser';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private url = 'http://api.meeting-planner.opsaini.com';  
  private socket;
  constructor(private http:HttpClient,private toastr:ToastrService,private appService:AppService) { 
    //connection is being created
    this.socket=io(this.url); 
  }

  public getAllMeetings=(userId):Observable<any>=>{
    return this.http.get(`${this.url}/api/v1/meetings/get/by/user?userId=${userId}&authToken=${Cookie.get('authtoken')}`)
  }

  /*** Emitters **/
  public setUserToList=(data)=>{
    this.socket.emit('set-user',(data));
  } //end of setUser
  public getAllUsers(skip){
    this.socket.emit('get-users',skip)
  };// end of getting alluserslist
  public verifySession(data){
    this.socket.emit('verify-session',(data));
  }//end of seesion verification

  public saveMeeting(data){
    this.socket.emit('save-event',(data));
  }
  public deleteMeeting(data){
    this.socket.emit('remove-event',data);
  }
  public exitSocket=()=>{
    this.socket.disconnect();
  }// end exit socket

  /*** Listeners ***/
  public authError=()=>{
    return Observable.create((observer)=>{
      this.socket.on('auth-error',(data)=>{
        observer.next(data);
      }); //end of Socket
    }); //end of Observer
  } //emd of auth-error
  public allUsersList=()=>{
    return Observable.create((observer)=> {
      this.socket.on('all-users-list', (userList)=>{
        observer.next(this.appService.handleError(userList)) 
      });//end of socket
    }); //end of Observer
  } //end of allUsersList receiving 

  public onSaveMeeting(){
    return new Observable((observer)=>{
      this.socket.on('save',data=>{
        observer.next(data);
      })
    })
  }
  public onRemoveMeeting(){
    return new Observable((observer)=>{
      this.socket.on('remove',(data)=>{
        observer.next(data);
      })
    })
  }
  public myIOUserId=(userId)=>{
    return Observable.create((observer) => {     
      this.socket.on(userId, (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable
  } 
}
