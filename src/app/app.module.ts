import { BrowserModule } from '@angular/platform-browser';

import {HttpModule} from '@angular/http';//npm i @angular/http
import {ToasterModule, ToasterService } from 'angular2-toaster';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import {RestserviceService} from './restservice.service';
import { HttpClientModule } from '@angular/common/http';
import { BigvaluePipe } from './bigvalue.pipe';
import { ModalComponent } from './modal/modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    BigvaluePipe,
    ModalComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    ToasterModule
  ],
  providers: [RestserviceService, ToasterModule, ToasterService, ProductComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
