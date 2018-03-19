import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {environment} from './../environments/environment';
import {AppNavbarComponent} from './app-navbar/app-navbar.component';
import {ShortURLComponent} from './short-url/short-url.component';
import {UserURLListComponent} from './user-url-list/user-url-list.component';
import {AckService} from './ack-service/ack-service.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    AppNavbarComponent,
    ShortURLComponent,
    UserURLListComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule.forRoot()
  ],
  providers: [CookieService, AckService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
