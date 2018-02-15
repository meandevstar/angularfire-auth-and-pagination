import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
  ],
  declarations: [
    MainComponent,
    HeaderComponent,
  ]
})
export class MainModule { }
