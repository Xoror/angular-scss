import { Component, OnInit } from '@angular/core';
import { SpellsService } from './services/spells.service';
import { InventoryService } from './services/inventory.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-scss';
  toggleDarkTheme(): void {
    document.body.classList.toggle('dark-theme');
  }
  state: any;
  getState(): any {
    let buildState = {
      spells: this.spellsService.spells,
      yourSpells: this.spellsService.yourSpells, 
      spellDetailsCalled: this.spellsService.spellDetailsCalled,
      items: this.inventoryService.itemsSeparate,
      yourItems: this.inventoryService.yourItems,
      containers: this.inventoryService.containers,
      totalWeight: this.inventoryService.totalWeight,
      moneyPouch: this.inventoryService.moneyPouch
    };
    return buildState;
  }
  setSessionStorage(): void {
    let saveState = JSON.stringify(this.getState());
    sessionStorage.setItem("spells-inventory-manager", saveState);
  }
  ngOnInit(): void {
    let sessionSave = sessionStorage.getItem("spells-inventory-manager");
    this.inventoryService.importItems(JSON.parse(sessionSave as string));
    this.spellsService.importSpells(JSON.parse(sessionSave as string));
  }
  constructor(private spellsService: SpellsService, private inventoryService: InventoryService ) {
    this.inventoryService.yourItems$.subscribe(items => {
      this.setSessionStorage();
    });
    this.inventoryService.items$.subscribe(items => {
      this.setSessionStorage();
    });
    this.inventoryService.moneyPouch$.subscribe(items => {
      this.setSessionStorage();
    });
    this.inventoryService.containers$.subscribe(items => {
      this.setSessionStorage();
    });
    this.spellsService.yourSpells$.subscribe(spells => {
      this.setSessionStorage();
    });
    this.spellsService.spells$.subscribe(spells => {
      this.setSessionStorage();
    });
  }
}
