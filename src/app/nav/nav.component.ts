import { Component, Input, inject, OnChanges, SimpleChanges } from '@angular/core';

import { NavService } from '../services/nav.service';
import { SpellsService } from '../services/spells.service';
import { InventoryService } from '../services/inventory.service';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnChanges {
  private breakpointObserver = inject(BreakpointObserver);

  navigationVariable: string = "spells"
  isOpen: string = "true"
  toggle(): void {
    this.isOpen = this.navService.toggle()
  }
  exportToJson(event: Event): void {
    event.preventDefault()
    let state = {
      spells: this.spellsService.spells,
      yourSpells: this.spellsService.yourSpells, 
      spellDetailsCalled: this.spellsService.spellDetailsCalled,
      items: this.inventoryService.itemsSeparate,
      yourItems: this.inventoryService.yourItems,
      containers: this.inventoryService.containers,
      totalWeight: this.inventoryService.totalWeight,
      moneyPouch: this.inventoryService.moneyPouch
    }
    this.navService.exportToJson(state)
  }
  readFileOnUpload(event: Event): void {
    this.navService.readFileOnUpload(event)
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
    .pipe(
      map(result => !result.matches),
      shareReplay()
    );
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes["state"]["currentValue"])
    sessionStorage.setItem("spells-inventory-manager-data", JSON.stringify(changes["state"]["currentValue"]))
  }
  constructor (private navService: NavService, private spellsService: SpellsService, private inventoryService: InventoryService) {}
}
