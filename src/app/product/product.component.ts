import { Component, Input, OnInit, EventEmitter, ViewChild, Output } from '@angular/core';
import { Product } from '../world';
import { ToasterModule, ToasterService} from 'angular2-toaster';
import { RestserviceService } from '../restservice.service';


declare var require;
const ProgressBar = require("progressbar.js");



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ToasterModule]

})
export class ProductComponent implements OnInit {

  product: Product;
  progressbar: any;
  lastupdate: number;
  _qtmulti:string;
  _money:number;
  cost:number;
  costt:number;
  REVENU:number;
  purchaseNb:number;
  location:string;


  @ViewChild('bar') progressBarItem;

  constructor(private toasterService: ToasterService, private service: RestserviceService) {
    this.toasterService = toasterService;

  }

  ngOnInit() {
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, { strokeWidth: 50, color: '#33BDFF' });
    setInterval(() =>{ this.calcScore(); }, 100);
  }

  //Le composant parent passe au composant produit : product, qtmulti et money
  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    //if (this._qtmulti && this.product) this.calcMaxCanBuy();
  }

  @Input()
  set money(value: number) {
    this._money = value;
  }

  /*Calcule la quantité supplémentaire maximale achetable par le joueur de ce produit
  toutes les 100ms
  qtmulti est une propriété qui stocke l'état actuel du multiplicateur
  Acheter n produits demandera 𝑥 ∗ (1 + 𝑐 + 𝑐^2 + 𝑐 ^3 + … + 𝑐 ^𝑛) argent.
  Soit grâce aux suites géométriques : x * ((1-c^n+1) / (1-c))

   Math.pow(a,b) = a^b
   problème formule donc utilisation boucle for
  */
 //this.cost = prix du lot

  calcMaxCanBuy() {

    switch(this._qtmulti) {

      case "Buy X1":
        this.purchaseNb=1;
        this.cost=this.product.cout;
        this.REVENU=this.product.revenu;
        break;

      case "Buy X10":
        this.purchaseNb=10;
        //this.cost=this.product.cout*((1-Math.pow(this.product.croissance, 11))/ (1-this.product.croissance));
        this.cost= this.product.cout;
        this.REVENU=this.product.revenu;
        for(var i=0; i<this.purchaseNb; i++){
          this.cost=this.cost*this.product.croissance;
          this.REVENU=this.REVENU*this.product.croissance;
        }
        break;

      case "Buy X100":
        this.purchaseNb=100;
        //this.cost=this.product.cout*((1-Math.pow(this.product.croissance, 101) )/ (1-this.product.croissance));
        this.cost= this.product.cout;
        this.REVENU=this.product.revenu;
        for(var i=0; i<this.purchaseNb; i++){
          this.cost=this.cost*this.product.croissance;
          this.REVENU=this.REVENU*this.product.croissance;

        }
        break;

      case "Buy MAX":

        //initialisation du cout de p
        this.cost= this.product.cout;
        this.purchaseNb=0;
        this.REVENU=this.product.revenu;
        var fin=0;

        while(this._money>Math.round(this.cost)&& fin==0){   //tant que je peux acheter cost=p et p+1
          
          this.purchaseNb++;
          //on teste pour p+1 : costt=p+1
          this.costt=this.cost*this.product.croissance;
          
          if(this._money>this.costt){ //si je peux acheter p+1 alors p=p+1
            this.cost=this.costt; 
            this.REVENU=this.REVENU*this.product.croissance;
          }
          else{ // je ne peux pas acheter p+1
            fin=1;
          }
        }
        break;
    }
  }

  //Quand on clique sur le bouton "Buy", cette fonction vérifie si on a assez d'argent pour l'acheter
  //Si oui, on ajuste les autres paramètres

  buyProduct(){
    this.calcMaxCanBuy();
    if(this._money < this.cost){
      this.toasterService.pop('error', 'Not enough gold ! ');
    }
    else{
      this.product.quantite += this.purchaseNb; // augmente la quantité de produits
      this.notifyBuy.emit(this.cost); // transmet l'info : totalArgent = totalArgent - coutProduit 

      this.product.revenu = this.REVENU*this.product.croissance;  //augmente le revenu
      this.product.cout=this.cost*this.product.croissance;
      this.service.putProduct(this.product);    
    }
  }

/*
11 x1 gain 16.74 et cout 11.16
11 x1 x10 gain 16.90 et cout 11.27
*/




  startProduction() {
    if(this.product.quantite!=0){
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.product.timeleft = this.product.vitesse;
      /*this.progressbar.set(progress);*/
      this.service.putProduct(this.product);
    }
    else{
      this.toasterService.pop('error', 'You need to buy at least 1 product ');

    }


  }

  calcScore(): void {
    let now = Date.now();
    let elapseTime = now - this.lastupdate
    this.lastupdate = now
    
    if (this.product.timeleft > 0) {
      this.product.timeleft -= elapseTime;
      /*console.log(this.product.timeleft);*/
      
      if (this.product.timeleft <= 0 && this.product.managerUnlocked==false) {
        
        this.product.timeleft = 0;
        this.progressbar.set(0);
        /*console.log("produit produit");*/
        this.notifyProduction.emit(this.product);// on prévient le composant parent que ce produit a généré son revenu.
      }
      if (this.product.timeleft <= 0 && this.product.managerUnlocked==true){
        this.product.timeleft=0;
        this.progressbar.set(0);
        this.startProduction();        
        this.notifyProduction.emit(this.product);        
        
      /* if (manager=1) alors
    this.progressbar.animate(1, { duration: this.product.vitesse });
    this.product.timeleft = this.product.vitesse; */
    }
  }
    
  }


  @Output() // transmet l'info : totalArgent = totalArgent - prixProduit
  notifyBuy: EventEmitter<Number> = new EventEmitter<Number>();


  @Output()// on prévient le composant parent que ce produit a généré son revenu.
  notifyProduction : EventEmitter<Product> = new EventEmitter<Product>();


}



