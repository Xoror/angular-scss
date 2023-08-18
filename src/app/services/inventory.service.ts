import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

import { nanoid } from 'nanoid';

import { ItemsCall, ItemCalled, Item, Container, Money } from '../interfaces/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  totalWeight: number = 2
  moneyPouch: Money[] = [
    {name: "Platinum", shortName: "pt", value: 0},
    {name: "Gold", shortName: "gp", value: 0},
    {name: "Electrum", shortName: "ep", value: 0},
    {name: "Silver", shortName: "sp", value: 0},
    {name: "Copper", shortName: "cp", value: 0},
  ]
  changeMoney(pouch: Money[]) {
    this.moneyPouch = pouch
  }
  itemsSeparate: any = {
    mundane: {
      itemsCalled: false,
      itemDetailsCalled: false,
      itemsCall: {count: 0, results: []},
      itemDetailsCall: {count: 0, results: []},
      url: "https://www.dnd5eapi.co/api/equipment"
    },
    magic: {
      itemsCalled: false,
      itemDetailsCalled: false,
      itemsCall: {count: 0, results: []},
      itemDetailsCall: {count: 0, results: []},
      url: "https://www.dnd5eapi.co/api/magic-items"
    }
  };
  itemsFetched(): boolean {
    return this.itemsSeparate.mundane.itemsCalled && this.itemsSeparate.magic.itemsCalled;
  }
  itemDetailsFetched(): boolean {
    return this.itemsSeparate.mundane.itemDetailsCalled && this.itemsSeparate.magic.itemDetailsCalled;
  }
  containers: Container[] = [
    {id: nanoid(), name: "Equipment", weight:0, maxWeightIn: 0, weightContained: 0},
    {id: nanoid(), name: "Backpack", weight: 2, maxWeightIn: 30, weightContained: 0}
  ]
  addContainer(container: Container): void {
    this.containers.push(container);
    this.totalWeight += container['weight'];
  }
  deleteContainer(containerToBeDestroyed: string, containerToMoveTo: string, destroyItems: boolean) {
    if(destroyItems) {
      this.totalWeight -= this.containers.filter(item => item["id"] === containerToBeDestroyed)[0]['weightContained'];
      this.yourItems = this.yourItems.filter(item => item.container != containerToBeDestroyed);
      this.yourItemsSource.next(this.yourItems);
    }
    else {
      let test = structuredClone(this.yourItems.filter(item => item.container === containerToBeDestroyed))
      for(let item of test) {
        item.container = containerToMoveTo;
      }
      this.yourItems = this.yourItems.filter(item => item.container != containerToBeDestroyed).concat(test);
      this.yourItemsSource.next(this.yourItems);
    }
    this.containers = this.containers.filter(item => item["id"] != containerToBeDestroyed);
  }

  items: Item[] = [];
  private itemsSource = new Subject<Item[]>();
  items$ = this.itemsSource.asObservable();

  yourItems: Item[] = [];
  private yourItemsSource = new Subject<Item[]>();
  yourItems$ = this.yourItemsSource.asObservable();

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  url: string = "";
  getItems(id: string): void {
   this.http.get<ItemsCall>(this.itemsSeparate[id].url)
      .pipe(
        //tap(result => console.log(result)),
        tap(result => this.itemsSeparate[id].itemsCall = result),
        tap(result => this.itemsSeparate[id].itemsCalled = true),
        tap(result => this.getItemDetails(id)),
        tap(result => this.constructItems()),
        catchError(this.handleError<ItemsCall>('getItems', {count: 0, results:[]}))
      ).subscribe();
  }
  getItemDetails(id: string): void {
    if(!this.itemsSeparate[id].itemDetailsCalled)
      for(let i=0; i<this.itemsSeparate[id].itemsCall.count; i++) {
        let url: string = "https://www.dnd5eapi.co"+ this.itemsSeparate[id].itemsCall.results[i]["url"]
        this.http.get<ItemCalled>(url)
          .pipe(
            tap(result => this.itemsSeparate[id].itemDetailsCall.results = this.itemsSeparate[id].itemDetailsCall.results.concat(this.convertItemTemplate(result, id))),
            tap(result => this.itemsSeparate[id].itemDetailsCall.count += 1),
            tap(result => {
              this.itemsSeparate[id].itemsCall.count === this.itemsSeparate[id].itemDetailsCall.count ? this.itemsSeparate[id].itemDetailsCalled = true : null
            }),
            tap(result => {
              this.construcDetailedItems()
            }),
          ).subscribe();
      }
  }
  constructItems(): void {
    if(this.itemsSeparate["mundane"].itemsCalled && this.itemsSeparate["magic"].itemsCalled) {
      this.items = this.itemsSeparate["mundane"].itemsCall.results.concat(this.itemsSeparate["magic"].itemsCall.results);
      this.items = this.items.sort((item1, item2) => {
        if(item1.name > item2.name) {
          return 1;
        }
        if(item1.name < item2.name) {
          return -1;
        }
        return 0;
      })
      this.itemsSource.next(this.items);
    }
  }
  construcDetailedItems(): void {
    if(this.itemsSeparate["mundane"].itemDetailsCalled && this.itemsSeparate["magic"].itemDetailsCalled) {
      this.items = this.itemsSeparate["mundane"].itemDetailsCall.results.concat(this.itemsSeparate["magic"].itemDetailsCall.results);
      this.items = this.items.sort((item1, item2) => {
        if(item1.name > item2.name) {
          return 1;
        }
        if(item1.name < item2.name) {
          return -1;
        }
        return 0;
      })
      this.itemsSource.next(this.items);
    }
  }
  convertItemTemplate(itemCalled: ItemCalled,id: string): Item {
    let item = {
      id: nanoid(), 
      name: itemCalled.name, 
      container: "",
      category: "",
      qty: 0,
      worth: 0, 
      weight:0, 
      rarity: "",
      attunable: false,
      attuneRequirement: "",
      description: [""]
    }
    if (id === "mundane") {
			if(itemCalled.cost!.unit === "gp") {
				item.worth = itemCalled.cost != undefined ? itemCalled.cost.quantity : 0;
			}
			else if(itemCalled.cost!.unit === "sp") {
				item.worth = itemCalled.cost != undefined ? itemCalled.cost.quantity/10 : 0;
			}
			else if(itemCalled.cost!.unit === "cp") {
				item.worth = itemCalled.cost!.quantity!/100;
			}
			item.weight = itemCalled.weight != undefined ? item.weight : 0;
			item.rarity = "Mundane";
			item.attunable = false;
			item.description = itemCalled.desc;
			if(itemCalled.equipment_category.index === "equipment-packs") {
				item.category = "Other";
			}
			else if(itemCalled.equipment_category.index === "kits") {
				item.category = "Other";
			}
			else if(itemCalled.equipment_category.index === "weapon") {
				item.category = itemCalled.weapon_category + " " + itemCalled.weapon_range + " Weapon";
			}
			else if(itemCalled.equipment_category.index === "armor") {
				item.category = itemCalled.armor_category === "Shield" ? "Shield" : itemCalled.armor_category + " Armor";
			}
      else if(itemCalled.equipment_category.index === "mounts-and-vehicles") {
        if(itemCalled.vehicle_category! === "mounts-and-other-animals") {
          item.category = "Vehicle (Land)";
        }
        else if(itemCalled.vehicle_category! === "Waterborne Vehicles") {
          item.category = "Vehicle (Water)";
        }
        else {
          item.category = "Vehicle (Land)";
        }
      }
			else if(itemCalled.equipment_category.index === "mounts-and-other-animals") {
				item.category = "Other";
			}
			else if(itemCalled.equipment_category.index === "other-tools") {
				item.category = "Other";
			}
			else if(itemCalled.equipment_category.index === "shields") {
				item.category = "Shield";
			}
      else if(itemCalled.equipment_category.index === "tools") {
        if(itemCalled.tool_category === "Gaming Sets") {
          item.category = "Gaming Set";
        }
        else if(itemCalled.tool_category === "Musical Instrument") {
          item.category = "Instrument";
        }
        else {
          item.category = itemCalled.tool_category!;
        }
      }
			else {
				item.category = itemCalled.equipment_category.name;
			}
      if(itemCalled.gear_category != undefined ? itemCalled.gear_category!.name === "Ammunition" : false) {
        item.category = "Ammunition";
      }
      if(itemCalled.gear_category != undefined ? itemCalled.gear_category!.name === "Arcane Foci" : false) {
        item.category = "Arcane Focus";
      }
      if(itemCalled.gear_category != undefined ? itemCalled.gear_category!.name === "Druidic Foci" : false) {
        item.category = "Druidic Focus";
      }
      if(itemCalled.gear_category != undefined ? itemCalled.gear_category!.name === "Holy Symbols" : false) {
        item.category = "Holy Symbol";
      }
		}
		else if (id === "magic") {
      item.id = nanoid();
			item.name = itemCalled.name;
			item.worth = 0;
			item.weight = 0;
			let descSplit = itemCalled.desc[0].split(",");
			let descSplitSpace = descSplit[1].split(" ");
			let paranthesisIndex1 = descSplit[1].indexOf("(");
			let paranthesisIndex2 = descSplit[1].indexOf(")");
			item.rarity = itemCalled.rarity!.name;
			item.attunable = itemCalled.desc[0].includes("requires attunement") ? true : false;
			item.attuneRequirement = !item.attunable ? "bla" : descSplit[1].slice(paranthesisIndex1 + 1, paranthesisIndex2);
			item.description= itemCalled.desc;
			item.category = "Wondrous Item";
		}
    return item
  }

  addItem(item: Item): void {
    let testItem = structuredClone(item)
    testItem.id = nanoid()
    this.yourItems = this.yourItems.concat(testItem);
    this.yourItems = this.yourItems.sort((item1, item2) => {
      if(item1.name > item2.name) {
        return 1;
      }
      if(item1.name < item2.name) {
        return -1;
      }
      return 0;
    })
    this.totalWeight += item.weight;
    this.yourItemsSource.next(this.yourItems);
    this.containers.filter(container => container["id"] === item.container)[0]["weightContained"] += item.qty*item.weight;
  }
  removeItem(item: Item): void {
    let index = this.yourItems.indexOf(this.yourItems.filter(item1 => item1.id === item.id)[0]);
    this.totalWeight -= item.weight;
    this.yourItems = this.yourItems.slice(0, index).concat(this.yourItems.slice(index+1));
    this.yourItemsSource.next(this.yourItems);
    this.containers.filter(container => container["id"] === item.container)[0]["weightContained"] -= item.qty*item.weight;
  }
  importItems(data: any):void {
    this.yourItems = data.items;
    this.containers = data.containers;
    console.log(this.containers)
    this.yourItemsSource.next(this.yourItems);
  }
  constructor(private http: HttpClient) {}
}
