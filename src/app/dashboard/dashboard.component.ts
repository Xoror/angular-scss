import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Subscription, map } from 'rxjs';

import { InventoryService } from '../services/inventory.service';
import { SpellsService } from '../services/spells.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent{
  private breakpointObserver = inject(BreakpointObserver);
  yourSpells = this.spellsService.yourSpells
  yourSpellsSubscription: Subscription;

  yourItems = this.inventoryService.yourItems
  yourItemsSubscription: Subscription;
  
  constructor(private inventoryService: InventoryService, private spellsService: SpellsService) {
    this.yourItemsSubscription = this.inventoryService.yourItems$.subscribe(items => {
      this.yourItems = items;
    });
    this.yourSpellsSubscription = this.spellsService.yourSpells$.subscribe(spells => {
      this.yourSpells = spells;
    });
  }

  cardsExpanded = [true, true]
  expandCard(id: string): void {
    console.log(id)
    if(id === 'Your Inventory') {
      this.cardsExpanded[0] = !this.cardsExpanded[0]
    }
    else if(id === 'Your Spells') {
      this.cardsExpanded[1] = !this.cardsExpanded[1]
    }
  }
  isCardExpanded(id: string): boolean {
    if(id === 'Your Inventory') {
      return this.cardsExpanded[0]
    }
    else if(id === 'Your Spells') {
      return this.cardsExpanded[1]
    }
    return false
  }
  cardStyle: string = "max-height: calc(100vh - 164px);"
  
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Medium).pipe(
    map(({ matches }) => {
      if (matches) {
        this.cardStyle="max-height: calc(100vh - 164px); height: calc(100vh - 164px);"
        return [
          { title: 'Your Inventory', cols: 1, rows: 1, class: "card left", expandMenu: false},
          { title: 'Your Spells', cols: 1, rows: 1, class: "card right", expandMenu: false}
        ]
      }
      this.cardStyle="max-height: 800px;"
      return [
        { title: 'Your Inventory', cols: 2, rows: 2, class: "card top", expandMenu: true},
        { title: 'Your Spells', cols: 2, rows: 2, class: "card bottom", expandMenu: true}
      ];
    })
  );
}
