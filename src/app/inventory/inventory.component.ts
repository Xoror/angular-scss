import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Subscription, map } from 'rxjs';

import { InventoryService } from '../services/inventory.service';
import { Item } from '../interfaces/inventory';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);

  itemDetailsCalled: boolean = this.inventoryService.itemsSeparate["mundane"].itemsCalled && this.inventoryService.itemsSeparate["magic"].itemsCalled
  items: any;
  itemsSubscription: Subscription;
  data: Item[] = this.inventoryService.items

  yourItems: Item[] = [];
  yourItemsSubscription: Subscription;
  yourData: any[] = this.inventoryService.yourItems


  getItems(id: string): void {
    if(this.inventoryService.items.length === 0) {
      this.inventoryService.getItems(id)
    }
    else {
      this.items = this.inventoryService.items;
      this.data = this.items;
    }
   }

   constructor(private inventoryService: InventoryService) {
    this.data = inventoryService.items
    this.yourData = inventoryService.yourItems
    this.itemsSubscription = this.inventoryService.items$.subscribe(items => {
      this.items = items;
      this.data = this.items;
    });
    this.yourItemsSubscription = this.inventoryService.yourItems$.subscribe(items => {
      this.yourItems = items;
      this.yourData = this.yourItems;
    });
  }
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Medium).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Your Inventory', cols: 1, rows: 1, class: "card left" },
          { title: 'All Items', cols: 1, rows: 1, class: "card right" }
        ];
      }

      return [
        { title: 'Your Inventory', cols: 2, rows: 2, class: "card left" },
        { title: 'All Items', cols: 2, rows: 2, class: "card right bottom" }
      ];
    })
  );

  ngOnInit(): void {
  console.log("inventory init")
    this.getItems("mundane");
    this.getItems("magic")
  }
  ngOnDestroy(): void {
    this.itemsSubscription.unsubscribe();
    this.yourItemsSubscription.unsubscribe();
  }
  
}
