import {Component, OnInit, ApplicationRef} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AckService} from "../ack-service/ack-service.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css'],
  providers: [CookieService]
})
export class AppNavbarComponent implements OnInit {
  name: string;
  token: string;

  constructor(private http: HttpClient,
              private appRef: ApplicationRef,
              private _firebaseAuth: AngularFireAuth,
              private cookieService: CookieService,
              private ackService: AckService) {
  }

  ngOnInit() {
    this.name = this.cookieService.get('name');
    this.token = this.cookieService.get('token');
  }

  logout() {
    this.cookieService.deleteAll();
    this._firebaseAuth.auth.signOut();
    this.name = '';
    this.token = '';
    this.ackService.eraseList();
    // Let's update the UI
    this.appRef.tick();
  }

  loginEmail() {
    this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    ).then((credential) => {
      this.cookieService.set('name', credential.user.displayName);
      this.cookieService.set('token', credential.user.uid);
      this.name = credential.user.displayName;
      this.token = credential.user.uid;
      // Update the list of urls
      this.ackService.updateList(this.token);
      // Let's update the UI
      this.appRef.tick();
      this.http.post('/user', {
        token: this.token,
        displayName: this.name
      }).subscribe(
        data => {
// Do something with the data?
        },
        error => {
// Do something with the error?
        });

    }).catch(error => console.log(error));
  }

}
