import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule    
  ],
  declarations: [NavbarComponent, FooterComponent,LoaderComponent],
  exports:[NavbarComponent,FooterComponent,LoaderComponent]
})
export class SharedModule { }
