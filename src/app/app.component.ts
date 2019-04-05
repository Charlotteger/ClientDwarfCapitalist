import { Component, Output } from '@angular/core';
import{ RestserviceService} from'./restservice.service';
import{ World, Product, Pallier} from'./world';
import { ToasterModule, ToasterService} from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ToasterModule]
})

export class AppComponent {
  title = 'DwarfCapitalist';
  world: World= new World();
  server: string;
  qtmulti: string = "Buy X1";;
  cpt: number = 0;

  managerBuyable: boolean = false;  
  manager: Pallier;

  username: string;

  constructor(private service: RestserviceService, private toasterService: ToasterService) {
    this.server= service.getServer();
    this.username = localStorage.getItem("username");
    this.service.setUser(this.username);
    this.toasterService = toasterService;
    service.getWorld().then(world=>{this.world= world;});
  }

//Au chargement de la page on ira voir si cet espace
//contient par exemple la clé username et on utilisera sa valeur en tant que pseudo
//de l’utilisateur :
  ngOnInit() {
    this.onUsernameChanged();
  }

//Si initialement le localStorage est vide, on en génère un pseudo aléatoirement et on le stocke localement.
//Pseudo aléatoire = Captiain + chiffre aléatoire entre 0 et 10000 
onUsernameChanged(){
  if(this.username == null || this.username == "") {
    this.username = "Captain" + Math.floor(Math.random() * 10000).toString();
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
    this.service.getWorld().then(world=>{this.world= world;});
  }
  else {
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
    this.service.getWorld().then(world=>{this.world= world;});
  }
}

  /*Permet d'afficher les différents états du multiplicateur.
  A chaque clic on incrémente le compteur et si c'est >3 on le remet à 0*/

  selectQtmulti() {
    this.cpt+=1;

    if (this.cpt>3){
      this.cpt=0;
    } 
    switch(this.cpt) {
      case 1:
        this.qtmulti = "Buy X10";
        break;
      case 2:
        this.qtmulti = "Buy X100";
        break;
      case 3:
        this.qtmulti = "Buy MAX";
        break;
      case 0:
      this.qtmulti = "Buy X1";
      break;
    }
  }

  /*Augmente l'argent et le score du joueur en fonction de ce que rapporte la production du produit*/
  onProductionDone(p:Product) {
    this.world.score += p.revenu;
    this.world.money += p.revenu;

    this.world.managers.pallier.forEach(element => {
      if(element.unlocked == false && element.seuil <= this.world.money) {
        this.managerBuyable = true;
      }
    });
  }

  /*Après un achat on soustrait le prix d'achat à la tirelire */
  onBuyDone(n) : void {
    this.world.money -= n;
    

    this.world.managers.pallier.forEach(element => {
      if(element.unlocked == false && element.seuil <= this.world.money) {
        this.managerBuyable = true;
      }


    });
  }
/*new affcihé même quand plus assez d'argent

*/



//On peut acheter un manager s'il est verrouilé et que le seuil est inférieur à notre argent

  @Output()
  hireManager(manager: Pallier){
    if (this.world.money <= manager.seuil){
     this.toasterService.pop('error', 'Not enough money to hire : ', manager.name);
    }else {
    this.toasterService.pop('success', 'Manager hired ! ', manager.name);
      this.world.money -= manager.seuil;
      manager.unlocked=true;
      this.world.products.product.forEach(element => {
        if(element.id == manager.idcible) {
          element.managerUnlocked=true;
          this.managerBuyable = false;
        }
      });
      this.service.putManager(manager);
    }
  }



}




