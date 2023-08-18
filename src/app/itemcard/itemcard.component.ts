import { Component, Input, OnInit, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { FilterList } from '../interfaces/filters';
import { Container, Item, Money } from '../interfaces/inventory';
import { InventoryService } from '../services/inventory.service';
import { AdditemComponent } from '../additem/additem.component';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';




@Component({
  selector: 'app-itemcard',
  templateUrl: './itemcard.component.html',
  styleUrls: ['./itemcard.component.scss'],
  animations: [
    trigger('containerExpand', [
      state('collapsed', style({
        position: 'absolute', 
        overflow: 'hidden', 
        height: '0px', 
        margin: '-1px', padding: '0', border: '0',
      })),
      state('expanded', style({display: '*'})),
      transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ItemcardComponent implements OnChanges, OnInit {
  @Input() data: any[] = []
  @Input() id: string = "bla"
  moneyPouch: Money[] = []
  totalWeight: number = 0

  displayedColumns: string[] = this.inventoryService.itemDetailsFetched() ? ['add', 'name', 'rarity', 'expand'] : ['name']
  noItems: boolean = true
  dataFilteredByContainers: FilteredContainers = {}

  containers: Container[] = this.inventoryService.containers
  containersExpanded: string[] = []
  changeContainerExpanse(id: string) {
    if(this.containersExpanded.find(item => item === id)) {
      this.containersExpanded = this.containersExpanded.filter(item => item != id)
    }
    else {
      this.containersExpanded.push(id)
    }
  }
  isContainerExpanded(id: string) {
    return this.containersExpanded.find(item => item === id) != undefined ? false : true
  }

  itemsCalled: boolean = false;
  itemDetailsCalled: boolean = false;

  onKeyUp(event: Event, id: string): void {
    if(id === "filter") {
      if((event as KeyboardEvent).key === " " || (event as KeyboardEvent).key === "Enter") {
        this.toggleFilterbox()
      }
    }
    else if(id === 'add') {
      if((event as KeyboardEvent).key === " " || (event as KeyboardEvent).key === "Enter") {
        this.openDialog()
      }
    }
  }
  filterBox: boolean = false
  toggleFilterbox(): void {
    this.filterBox = !this.filterBox
  }
  filterNameLists: FilterList = {
    category_options: ["Adventuring Gear", "Ammunition", "Arcane Focus", "Artisan's Tools", "Druidic Focus", "Gaming Set", "Heavy Armor", "Holy Symbol", "Instrument", "Light Armor", "Martial Melee Weapon", "Martial Ranged Weapon", "Medium Armor", "Potion", "Other", "Ring", "Rod", "Scroll", "Shield", "Simple Melee Weapon", "Simple Ranged Weapon", "Spellcasting Focus", "Staff", "Vehicle (Air)", "Vehicle (Land)", "Vehicle (Water)", "Wand", "Wondrous Item"],
    rarities: ["Mundane", "Common", "Uncommon", "Rare", "Very Rare", "Legendary", "Artifact", "Unknown"]
  }
  filterLists: FilterList = {
    search_field: [""],
    category_options: [],
    rarities: []
  }
  isSelected(testValue: string, id: string): boolean {
    return this.filterLists[id].find(item => testValue === item) ? true:false
  }

  filtering(filterValue: any, id: string) {
    if(this.filterLists[id].find(filter => filter === filterValue)) {
      this.filterLists[id] = this.filterLists[id].filter(filter => filter != filterValue)
    }
    else {
      this.filterLists[id].push(filterValue)
    }
    this.data = this.inventoryService.items.filter(item => this.filterFunction(item))
  }
  filterFunction(item: Item): boolean {
    //filter for the categories
    let testCategories: boolean = false
    if(this.filterLists["category_options"].length != 0) {
      testCategories = this.filterLists["category_options"].find(category => item.category === category) ? true:false
    }
    else {
      testCategories = true
    }
    //filter for the rarities
    let testRarities: boolean = false
    if(this.filterLists["rarities"].length != 0) {
      testRarities = this.filterLists["rarities"].find(rarity => item.rarity === rarity) ? true:false
    }
    else {
      testRarities = true
    }
    return testCategories && testRarities
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AdditemComponent, {
      panelClass: "dialog-background",
      width: "100%",
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openDeleteDialog(id: string): void {
    const dialogRef = this.dialog.open(DeleteContainerDialog, {
      panelClass: "dialog-background",
      width: "100%",
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openChangeMoneyDialog(): void {
    const dialogRef = this.dialog.open(ChangeMoneyDialog, {
      panelClass: "dialog-background",
      width: "100%",
      data: this.moneyPouch
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  constructor(private inventoryService: InventoryService, public dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.itemsCalled = this.inventoryService.itemsFetched();
    this.itemDetailsCalled = this.inventoryService.itemDetailsFetched();
    this.displayedColumns = this.itemDetailsCalled ? ['add', 'name', 'rarity', 'expand'] : ['name']
    this.displayedColumns = this.id === 'yourInventory' ? (!(this.data[0].name === "Add Items to your Inventory") ? (this.itemDetailsCalled ? ['add', 'name', 'rarity', 'expand'] : ['name']) : ['name']) : this.displayedColumns
    if(this.id === "yourInventory") {
      this.itemDetailsCalled = true
      for(let container of this.containers) {
        this.dataFilteredByContainers[container["id"]] = this.data.filter(item => item.container === container["id"])
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.data = changes["data"] != undefined ? [...changes["data"]["currentValue"]] : this.data
    if(this.data.length === 0) {
      this.data = [
        {name:"Add Items to your Inventory", container: this.containers.filter(item => item["name"] === "Equipment")[0]["id"]},
        {name:"Add Items to your Inventory", container: this.containers.filter(item => item["name"] === "Backpack")[0]["id"]}
      ]
    }
    this.id = changes["id"] != undefined ? changes["id"]["currentValue"] : this.id
    if(true) {
      this.itemsCalled = this.inventoryService.itemsFetched()
      this.itemDetailsCalled = this.inventoryService.itemDetailsFetched()

      if(this.data[0].name === "Add Items to your Inventory") {
        this.data = [{name: "Loading items..."}];
      }
    }
    if(this.data[0].name === "Add Items to your Inventory") {
        this.noItems = true;
      }
    else {
      this.noItems = false;
    }
    this.displayedColumns = this.itemDetailsCalled ? ['add', 'name', 'rarity', 'expand'] : ['name']
    this.displayedColumns = this.id === 'yourInventory' ? (!this.noItems ? (this.itemDetailsCalled ? ['add', 'name', 'rarity', 'expand'] : ['name']) : ['name']) : this.displayedColumns 
    this.containers = this.inventoryService.containers
    if(this.id === "yourInventory") {
      for(let container of this.containers) {
        this.dataFilteredByContainers[container["id"]] = this.data.filter(item => item.container === container["id"])
      }
    }
    this.totalWeight = this.inventoryService.totalWeight
    this.moneyPouch = this.inventoryService.moneyPouch
  }
}

interface FilteredContainers {
  [index: string]: Item[]
}

@Component({
  selector: 'app-deleteContainerDialog',
  templateUrl: './deleteContainerDialog.component.html',
  styleUrls: ['./deleteContainerDialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatSelectModule, MatInputModule, MatFormFieldModule, NgFor, MatButtonModule, MatDividerModule, MatIconModule]
})
export class DeleteContainerDialog {
  constructor(
      public dialogRef: MatDialogRef<DeleteContainerDialog>, 
      private inventoryService: InventoryService,
      @Inject(MAT_DIALOG_DATA) public data: string
    ) {
      this.containerToBeDestroyed = this.inventoryService.containers.filter(item => item["id"] === data)[0]
      this.remainingContainers = this.inventoryService.containers.filter(item => item["id"] != data)
    }
  containerToBeDestroyed: Container;
  remainingContainers: Container[];
  destroyItems: boolean = false
  changeDestroyItems(event: any) {
    if(event.isUserInput) {
      this.destroyItems = event.source.value
    }
  }
  moveItemsTo: string = ""
  changeMoveToContainer(id: string) {
    this.moveItemsTo = id
  }
  onSubmit(): void {
    this.inventoryService.deleteContainer(this.containerToBeDestroyed["id"], this.moveItemsTo, this.destroyItems)
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-changeMoneyDialog',
  templateUrl: './changeMoneyDialog.component.html',
  //styleUrls: ['./changeMoneyDialog.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatSelectModule, MatInputModule, MatFormFieldModule, NgFor, MatButtonModule, MatDividerModule, MatIconModule]
})
export class ChangeMoneyDialog {
  constructor(
      public dialogRef: MatDialogRef<ChangeMoneyDialog>, 
      private inventoryService: InventoryService,
      @Inject(MAT_DIALOG_DATA) public data: any[]
    ) {}

    addItemForm = new FormGroup({
      platinum: new FormControl(this.data[0].value, { nonNullable: true, validators: [Validators.required] }),
      gold: new FormControl(this.data[1].value, { nonNullable: true, validators: [Validators.required] }),
      electrum: new FormControl(this.data[2].value, { nonNullable: true, validators: [Validators.required] }),
      silver: new FormControl(this.data[3].value, { nonNullable: true, validators: [Validators.required] }),
      copper: new FormControl(this.data[4].value, { nonNullable: true, validators: [Validators.required] }),
    });
    onSubmit(): void {
      this.data[0].value = this.addItemForm.getRawValue().platinum
      this.data[1].value = this.addItemForm.getRawValue().gold
      this.data[2].value = this.addItemForm.getRawValue().electrum
      this.data[3].value = this.addItemForm.getRawValue().silver
      this.data[4].value = this.addItemForm.getRawValue().copper
      this.inventoryService.changeMoney(this.data)
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
}