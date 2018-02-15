import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { GlobalModule } from './global/global.module';

import { environment } from '../environments/environment';
import { AppRoutes } from './app.routes';
import { IsLoggedInGuard } from 'app/guards/isLoggedIn.guard';
import { IsNotLoggedInGuard } from 'app/guards/isNotLoggedIn.guard';
import { reducers, metaReducers } from './store/store.config';

import { AppComponent } from './app.component';
import { LoginComponent } from './main/login/login.component';
import { SignUpComponent } from './main/signup/signup.component';
import { StateService,
         UserEffects,
         ConfigEffects,
         TokenEffects,
       } from './store';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgxDatatableModule,
    RouterModule.forRoot(AppRoutes),
    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot([
      UserEffects,
      ConfigEffects,
      TokenEffects,
    ]),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    GlobalModule
  ],
  providers: [
    IsLoggedInGuard,
    IsNotLoggedInGuard,
    AngularFireAuth,
    StateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
