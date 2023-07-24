import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

import { InventoryService } from '../services/inventory.service';
import { SpellsService } from '../services/spells.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent{
  private breakpointObserver = inject(BreakpointObserver);
  
  constructor(private inventoryService: InventoryService, private spellsService: SpellsService) {}
  yourSpells = this.spellsService.yourSpells
  yourItems = this.inventoryService.yourItems
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Medium).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Your Inventory', cols: 1, rows: 1, class: "card left" },
          { title: 'Your Spells', cols: 1, rows: 1, class: "card right" }
        ];
      }

      return [
        { title: 'Your Inventory', cols: 2, rows: 2, class: "card left" },
        { title: 'Your Spells', cols: 2, rows: 2, class: "card right bottom" }
      ];
    })
  );
}
