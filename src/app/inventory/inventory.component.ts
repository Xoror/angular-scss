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

  itemsCalled: boolean = this.inventoryService.itemsFetched();
  itemDetailsCalled:boolean = this.inventoryService.itemDetailsFetched();

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
    this.itemsSubscription = this.inventoryService.items$.subscribe(items => {
      this.items = items;
      this.data = this.items;
      this.itemsCalled = this.inventoryService.itemsFetched();
      this.itemDetailsCalled = this.inventoryService.itemDetailsFetched();
    });
    this.yourItemsSubscription = this.inventoryService.yourItems$.subscribe(items => {
      this.yourItems = items;
      this.yourData = this.yourItems;
    });
  }
  /** Based on the screen size, switch from standard to one column per row */
  
  cardsExpanded = [true, true]
  expandCard(id: string): void {
    console.log(id)
    if(id === 'Your Inventory') {
      this.cardsExpanded[0] = !this.cardsExpanded[0]
    }
    else if(id === 'All Items') {
      this.cardsExpanded[1] = !this.cardsExpanded[1]
    }
  }
  isCardExpanded(id: string): boolean {
    if(id === 'Your Inventory') {
      return this.cardsExpanded[0]
    }
    else if(id === 'All Items') {
      return this.cardsExpanded[1]
    }
    return false
  }
  cardStyle: string = "max-height: calc(100vh - 164px);"
  cards = this.breakpointObserver.observe(Breakpoints.Medium).pipe(
    map(({ matches }) => {
      if (matches) {
        this.cardStyle="max-height: calc(100vh - 164px); height: calc(100vh - 164px);"
        return [
          { title: 'Your Inventory', cols: 1, rows: 1, class: "card left", expandMenu: false },
          { title: 'All Items', cols: 1, rows: 1, class: "card right", expandMenu: false }
        ];
      }
      this.cardStyle="max-height: 800px;"
      return [
        { title: 'Your Inventory', cols: 2, rows: 2, class: "card top", expandMenu: true },
        { title: 'All Items', cols: 2, rows: 2, class: "card bottom", expandMenu: true }
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
