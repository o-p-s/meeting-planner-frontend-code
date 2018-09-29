# MeetingPlanner

This project establishes a meeting planner for the users registered with this app by any admin. It notifies users via email and in realtime when a meeting is about to start. An admin has full control over the scheduled meetings for any user, but user has read-only permissions. 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## LINKS
  1.)APP URL : http://meeting-planner.opsaini.com \
  2.)API URL : http://api.meeting-planner.opsaini.com \
	3.)Documentation REST Endpoints : http://documentations.opsaini.com/mp-restapi <br/> 
	4.)Documentation Socket Endpoints : http://documentations.opsaini.com/mp-socketio \
	5.)Github (Backend) URL : https://github.com/o-p-s/Meeting-Planner-Backend \
	6.)Github (Frontend) URL : https://github.com/o-p-s/meeting-planner-frontend-code 

## Description
The project has been built using 
		Frontend Technologies - HTML5, CSS3, JS, Bootstrap and Angular
		Backend Technologies - NodeJS, ExpressJS and Socket.IO
		Databases - MongoDB and Redis.

## Features
1) User management System-
		
    a) Signup - User is be able to sign up on the platform providing all details like FirstName, LastName, Email and Mobile   
       number. Country code for mobile number (like 91 for India) & Country Name is also stored. 
		
    b) Login - user is be able to login using the credentials provided at signup.
 
    c) Sign Up Verification* - User receives an email to verify his/her account. However permessions are kept loose, so any 
       unverified user can also login. 
       
    d) Forgot password - User is able to recover password using a link on email. Used Nodemailer to send emails. 
	
  2) User Authorization system-
  
		a) User can be of two roles, normal and admin. Admin is identified with a email ending with "admin", like 
       "alex-admin@gmail.com" is an admin, since it ends with "admin".       
	
  3) User Slots management system (Flow for normal User) -
  
		a) Upon login, normal User is taken to a dashboard showing his current months', planned meetings, in the form of a calendar. 
       Current day-cell is selected by default.
       
		b) User is able to only view his meeting slots and he cannot make any changes to the planned meetings.    
	
  4) User Slots management system (Flow for Admin User) - \
    a) Upon login, admin User is taken to a dashboard, showing all normal users in a list format. \
    b) Upon clicking on any user, admin is further taken to the user's current calendar, with current date selected, 
       by default. \
    c) Admin can add/delete/update meetings on any day, by clicking on a appropriate day-cell/timeline. \
    d) These details are stored in database for every user. 
	
  5) User Alerts management system - \
    a) Normal User is notified in real time, though an alert if he is online, and email (irrespective of whether he is online or 
       offline), when \
      i) A meeting is created by admin. \
      ii) A meeting is changed by admin. \
      iii) 1 minute before meeting, with an option to snooze or dismiss. If snoozed, alert comes again in 5 seconds, if snoozed 
          again, it re-appears in next 5 seconds and so on. Once dismissed, the alert no longer appears. 
	
  6) Planner Views -
  
		a) Similar to Google or outlook calendars.
    
		b) The view follows the following guidelines - 
			
      i) Planner shows only current year, past and future years are ignored.
			
      ii) User is able to change months, through an arrow button(or prev/next button), each month shows all the dates in tabular 
          format, like in actual calendar.
			
      iii) Day Cells are filled, if any meeting is kept, with a circle of desired color. 
			
      iv) Upon click the day's cell, a view pops, showing all meetings, along a 24 hr timeline, with the slots covering the 
          exact duration of each meeting.
			
      v) Upon clicking on a meeting, its details opens up in an another view.
      
		c) Admin Flow:
			
      i) For admin, a create button is there in the middle of calendar view, to create a meeting.
			
      ii) Upon clicking on create button, details view opens.
			
      iii) Once created, it appears on the calendar view and notification is sent to the respective user.
			
      iv) Upon clicking on an already created meeting, same details view opens.
			
      v) Details view is a form.
			
      vi) Admin can make changes in meeting details form, and submit.
			
      vii) Admin can delete a meeting as well, with delete button.
			
      viii) Meeting details covers title, location, purpose, start-time, end-time, colors for meeting icon. Also, by default 
            username of the admin, who kept the meeting, shows in non-editable format.
	
  7) Error Views and messages - 
  
		Each major error response (like 404 or 500) are handled with a different page. Also, all kind of errors, exceptions and 
    messages are handled properly on frontend. The user is aware all the time on frontend about what is happening in the system.
	
  8) Rate limiting - 
  
		a) APIs have pagination or rate limiting to avoid send huge chunks of messages as API response.(Incase of fetching all users 
      each request fetches 5 users at a time, while in case of fetching meetings no limit is there since, beacuse to display 
      snooze for all in valid-time meetings, all meetings for the current user are required).
