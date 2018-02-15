import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InfoComponent } from './info/info.component';
import { StateService } from '../store';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    InfoComponent,
  ],
  providers: [
    StateService,
  ],
  exports: [
    InfoComponent,
  ]
})
export class GlobalModule { }
