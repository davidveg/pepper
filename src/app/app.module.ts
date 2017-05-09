import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';

export const fireBaseConfig = {
    apiKey: "AIzaSyBJwtCRp8_2SsEyNzr-PZG0A559DIP4JkY",
    authDomain: "pepper-af4b0.firebaseapp.com",
    databaseURL: "https://pepper-af4b0.firebaseio.com",
    projectId: "pepper-af4b0",
    storageBucket: "pepper-af4b0.appspot.com",
    messagingSenderId: "457374243586"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(fireBaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
