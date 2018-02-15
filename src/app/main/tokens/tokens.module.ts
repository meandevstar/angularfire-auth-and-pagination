import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokensRoutingModule } from './tokens-routing.module';
import { TokensComponent } from './tokens.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    TokensRoutingModule,
    NgxDatatableModule,
    FormsModule
  ],
  declarations: [TokensComponent]
})
export class TokensModule { }
