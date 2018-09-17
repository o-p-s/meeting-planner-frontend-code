import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, ElementRef, ContentChild, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, addMinutes } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { TimePipe} from './../time-pipe'
import { Subject } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from '../../socket.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';
import { ISubscription } from "rxjs/Subscription";
@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('alert') alertContent: TemplateRef<any>;
  observer:ISubscription[]=[];
  view: string = 'month';

  viewDate: Date = new Date();
  nextBtn:boolean=false;
  prevBtn:boolean=false;
  userId:string='';
  modalData: { event: CalendarEvent; };
  
  alertData={ title:'', purpose:'', end:new Date() }
  
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;
  private timeouts=[];
  events: CalendarEvent[] = [
    // {
    //   start: startOfDay(new Date()),
    //   title: 'An event with no end date',
    //   location:'',
    //   purpose:'',
    //   createdBy:'',
    //   color: colors.yellow,
    //   actions: this.actions
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   location:'',
    //   createdBy:'',
    //   purpose:'',
    //   color: colors.blue
    // },   {
    //   {start: new Date(),
    //   end: new Date('Mon Sep 10 2018 19:18:05 GMT+0530 (India Standard Time)'),
    //   title: 'A 3 day event',
    //   location:'safjkdsa eafj23n 3 3 eaf 0asdf sfads ffffff ssssf ae f   fff',
    //   purpose:'aaa aa a aaa aaaaa a aaa aa a aaaaaaaaaa aaa a a aaaaaaaa aaaaaaa  aaaaaaaaaaaaa  aa aaaaa aa aaa aaaa a  aaa aaaa aaaaaaa aaa aaaa aaa aa a aa aaaaaaaaaa aaaaaaa aaaaaaaaaa a aaaaaa aa a aaaaaaaaaaaa aa a a aaaaaaaaaa aaa a a a a aaaaaa aaaaaaaa a',
    //   createdBy:'',
    //   color: colors.red,
    // },
    // {
    //   start: new Date(),
    //   end: new Date('Mon Sep 10 2018 14:39:00 GMT+0530 (India Standard Time)'),
    //   title: 'A draggable and resizable event',
    //   color: colors.yellow,
    //   createdBy:'',
    //   location:'',
    //   purpose:'',
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
  ];

  constructor(private modal: NgbModal,private datePipe: DatePipe,private socketService:SocketService,
    private route:ActivatedRoute,private toastr:ToastrService, public appService:AppService,private timePipe:TimePipe) {}
  
  ngOnInit(): void {
    this.userId=this.route.snapshot.params['userId'];
    this.fetchMeetings();
    this.onSaveEvent();
    this.onDeleteEvent();
    this.onMyIO();
  }
  ngOnDestroy(){
    this.observer.map(ob=>{ob.unsubscribe()});
  }
  fetchMeetings=()=>{
    this.socketService.getAllMeetings(this.userId).subscribe((res)=>{
      if(res.status==200){
        this.events=res.data;
        this.events.forEach(e => {
          e.start=new Date(e.start); e.end=new Date(e.end);
          if(this.appService.isAdmin!=true){
            if(e.start>new Date())
            this.setAlert(e,this.events.indexOf(e));
          }
        });        
      }
    })    
  }
  setAlert=(e,i)=>{
    this.timeouts[i]=setTimeout(() => {
      this.alertData.title=e.title;
      this.alertData.purpose=e.purpose;
      this.modal.open(this.alertContent,{size:'lg'});
    },Math.round(Math.abs(addMinutes(e.start,-1).getTime() - new Date().getTime())));
  }

  clearAlert=(i)=>{
    clearTimeout(this.timeouts[i]);
  }
  snooze=(at)=>{
    this.modal.dismissAll();
    this.events.forEach(e => {
      if(e.title==(at.innerHTML.toString().substring(at.innerHTML.toString().lastIndexOf(";")+1)))   
      if(e.start.getTime()-new Date().getTime()>5000){
        setTimeout(() => {
          this.alertData.title=e.title;
          this.alertData.purpose=e.purpose;
          this.alertData.end=e.end;
          this.modal.open(this.alertContent,{size:'lg'})
        },5000);
      }
    })
  }
 
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.view = 'day';
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0){
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  handleEvent( event: CalendarEvent): void {
    this.modalData = { event };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {    
    this.handleEvent({
      title: 'New Meeting',
      location:'',
      purpose:'',
      createdBy:Cookie.get('userName'),
      start: startOfDay(this.viewDate),
      end: endOfDay(this.viewDate),
      color:{ primary: '#ad2121', secondary: '#FAE3E3' },
    });
  }
  deleteEvent=():void=>{
    this.socketService.deleteMeeting({ 'action':'delete', 'meeting':this.modalData.event });
    this.modal.dismissAll();
    this.refresh.next();
  }
  saveEvent=():void=>{
    let flag:boolean=true;
    //Validating fields
    if(this.modalData.event.title=='' || this.modalData.event.title==undefined )
    this.toastr.error('Title is required');
    else if(this.modalData.event.purpose=='' || this.modalData.event.purpose==undefined ) 
      this.toastr.error('Purpose can\'t be left blank.')
    else if(this.modalData.event.location=='' || this.modalData.event.location==undefined ) 
      this.toastr.error('Location can\'t be left blank.')
    else{
      this.events.forEach(e => {
        if(e.title==this.modalData.event.title)
          flag=false
      });
    //Saving Meeting to Database
      if(this.modalData.event['meetingId']==null && this.modalData.event['meetingId']==undefined ){
        if(flag==true){
          this.modalData.event['userId']=this.userId;
          this.modalData.event['userEmail']=Cookie.get('email');
          this.socketService.saveMeeting({
            'action':'save',
            'meeting':this.modalData.event});
        this.modal.dismissAll();
        }else
        this.toastr.warning('Title already exist for any other meeting.')  
      }else{
        this.socketService.saveMeeting({
            'action':'update',
            'meeting':this.modalData.event});
        this.modal.dismissAll();
      }
    }
  }
  onSaveEvent=()=>{
    this.observer[0]=this.socketService.onSaveMeeting().subscribe((data)=>{
      let i:number=-1;
      data['meeting'].start=new Date(data['meeting'].start);
      data['meeting'].end=new Date(data['meeting'].end);
      if(data['action']=='save'){
        this.events.push(data['meeting']);        
        this.toastr.success('Meeting has been saved!');
      }else if(data['action']=='update'){        
        i=this.events.map((e)=>{return e['meetingId']}).indexOf(data['meeting']['meetingId']);
        this.events[i]=data['meeting'];
        this.clearAlert(i);  
        this.toastr.success('Meeting has been updated!')
      }
      if(this.appService.isAdmin!=true){  
        if(new Date(data['meeting']['start']) > new Date()){
          if(i<0)
          this.setAlert(data['meeting'],this.events.length);
          else
          this.setAlert(data['meeting'],i);
        }
      }
      this.refresh.next();
    })
  }
  onDeleteEvent=()=>{
    this.observer[1]=this.socketService.onRemoveMeeting().subscribe((data)=>{
      this.events.splice(this.events.map((e)=>{return e['meetingId']}).indexOf(data['meeting']['meetingId']),1);
      this.refresh.next();
      this.toastr.success('Meeting has been deleted!');
    })
  }
  verifyDate=()=>{
    if(this.datePipe.transform(this.viewDate).substring(0,3)=='Jan')
    this.prevBtn=true;
    else 
    this.prevBtn=false;
    
    if(this.datePipe.transform(this.viewDate).substring(0,3)=='Dec')
    this.nextBtn=true;
    else
    this.nextBtn=false;    
  }
  resize=(elem)=>{
    if(elem)
    elem.style.height=elem.scrollHeight+'px';
  }
  onMyIO=()=>{
    this.observer[2]=this.socketService.myIOUserId(Cookie.get('userId')).subscribe((data)=>{
      if(data.action=="save" || data.action=='update'){
        let i:number=-1;
        data['meeting'].start=new Date(data['meeting'].start);
        data['meeting'].end=new Date(data['meeting'].end);
        if(data['action']=='save'){
          this.events.push(data['meeting']);        
          this.toastr.info(`A new Meeting "${data.meeting.title}" has been scheduled by "${data.meeting.createdBy}" on "${new Date(data.meeting.start).toLocaleString()}"`)
        }else if(data['action']=='update'){        
          i=this.events.map((e)=>{return e['meetingId']}).indexOf(data['meeting']['meetingId']);
          this.events[i]=data['meeting'];
          this.clearAlert(i);  
          this.toastr.info(`A Meeting "${data.meeting.title}" on "${new Date(data.meeting.start).toLocaleString()}" has been updated.`)
        }
        if(new Date(data['meeting']['start']) > new Date()){
          if(i<0)
          this.setAlert(data['meeting'],this.events.length);
          else
          this.setAlert(data['meeting'],i);
        }
      }else if(data.action=="delete"){
        this.events.splice(this.events.map((e)=>{return e['meetingId']}).indexOf(data.meeting['meetingId']),1);
        this.toastr.info(`A Meeting "${data.meeting.title}" on "${new Date(data.meeting.start).toLocaleString()} has been Removed.`)
      }
      this.refresh.next();
    })
  }
}