import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import {AckService} from "../ack-service/ack-service.component";

interface shortenResponse {
  status: number;
  statusCode: string;
  originalURL: string;
  shortURL: string;
}

@Component({
  selector: 'short-url',
  templateUrl: './short-url.component.html',
  styleUrls: ['./short-url.component.css'],
  providers: [CookieService]
})
export class ShortURLComponent implements OnInit {
  URLForm: FormGroup;
  URLToShort: FormControl;
  successMessage: string;
  errorMessage: string;
  name: string;
  token: string;

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.successMessage = "";
    this.name = this.cookieService.get('name') || '';
    this.token = this.cookieService.get('token') || '';
  }

  createForm() {
    this.URLForm = new FormGroup({
      URLToShort: this.URLToShort
    });
  }

  createFormControls() {
    this.URLToShort = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern("/^(http[s]?:\\/\\/){0,1}(www\\.){0,1}[a-zA-Z0-9\\.\\-]+\\.[a-zA-Z]{2,5}[\\.]{0,1}/")])
  }

  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private ackService: AckService) {
  }

  onSubmit() {
    this.http.post<shortenResponse>('/shorten', {
      url: this.URLToShort.value,
      token: this.token
    }).subscribe(
      data => {
        this.successMessage = data.shortURL;
        this.errorMessage = "";
        this.ackService.updateList(this.token);
      },
      error => {
        this.errorMessage = "We couldn't short your URL! Check your input!";
        this.successMessage = "";
      });

  }

}
