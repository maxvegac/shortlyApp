import {Component, OnInit, ApplicationRef} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {AckService} from "../ack-service/ack-service.component";

interface URLSResponse {
  status: number;
  statusCode: string;
  data: Array<JSON>;
}

@Component({
  selector: 'user-url-list',
  templateUrl: './user-url-list.component.html',
  styleUrls: ['./user-url-list.component.css'],
  providers: [CookieService]
})
export class UserURLListComponent implements OnInit {
  name: string;
  token: string;
  URLs: Array<JSON>;

  ngOnInit() {
    this.name = this.cookieService.get('name') || '';
    this.token = this.cookieService.get('token') || '';
    this.URLs = Array<JSON>();
    if (this.token) {
      this.getURLs();
    }
    this.ackService.updateURLList.subscribe((token) => {
      this.token = token;
      this.getURLs();
    })
    this.ackService.eraseURLList.subscribe(() => {
      this.eraseURLs();
    })
  }

  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private appRef: ApplicationRef,
              private ackService: AckService) {
  }

  eraseURLs() {
    this.URLs = Array<JSON>();
  }

  getURLs() {
    this.http.get<URLSResponse>('/user/urls', {
      params: {
        token: this.token
      }
    }).subscribe(
      response => {
        console.log(response.data);
        this.URLs = response.data;
        this.appRef.tick();
      },
      error => {
        this.URLs = Array<JSON>();
      });
  }

}
