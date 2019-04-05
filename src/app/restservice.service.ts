import { Injectable } from '@angular/core';
import {World, Pallier, Product} from './world';
import { Http, Response, Headers } from '@angular/http'
//import { HttpModule } from '@angular/http'


@Injectable({
  providedIn: 'root'
})

export class RestserviceService {
  
  server ="http://localhost:8080/";
  /*10.183.106.14*/
  user="";
  
  constructor(private http: Http){}

  private handleError(error:any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  

  public getUser(){
    return this.user;
  }

  public setUser(user: string){
     this.user=user;
  }

  public getServer(){
    return this.server;
  }

  public setServer(server: string){
     this.server=server;
  }

  
  getWorld(): Promise<World> {
    return this.http.get(this.server + "adventureisis/generic/world",
    {headers: this.setHeaders(this.user)}).toPromise().then(response =>
      response.json()).catch(this.handleError);
  };


  private setHeaders(user : string) : Headers { 
    var headers = new Headers(); 
    headers.append("X-user",user);
  return headers; 
  }

/*
  getWorld(): Promise<World>{
    return this.http.get(this.server + "adventureisis/generic/world").toPromise().catch(this.handleError);
  }
*/

  putManager(manager : Pallier): Promise<Response> { 
    return this.http.put(this.server + "adventureisis/generic/manager", manager,
    { headers: this.setHeaders(this.user)} )
    .toPromise(); 
  }

  putProduct(product : Product){ 
    return this.http.put(this.server + "adventureisis/generic/product", product,
    { headers: this.setHeaders(this.user)} )
    .toPromise(); 
  }

}



