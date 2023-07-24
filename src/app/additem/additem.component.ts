import { Component, Inject } from '@angular/core';
import { nanoid } from 'nanoid';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Item, Container } from '../interfaces/inventory';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export class AdditemComponent {
  constructor(
    public dialogRef: MatDialogRef<AdditemComponent>, 
    private inventoryService: InventoryService,
    @Inject(MAT_DIALOG_DATA) public data: Item ) {
      if(data) {
        this.addItemForm.setValue(data)
      }
    }


  containers: Container[] = this.inventoryService.containers
  category_options: string[] = ["Adventuring Gear", "Ammunition", "Arcane Focus", "Artisan's Tools", "Druidic Focus", "Gaming Set", "Heavy Armor", "Holy Symbol", "Instrument", "Light Armor", "Martial Melee Weapon", "Martial Ranged Weapon", "Medium Armor", "Potion", "Other", "Ring", "Rod", "Scroll", "Shield", "Simple Melee Weapon", "Simple Ranged Weapon", "Spellcasting Focus", "Staff", "Vehicle (Air)", "Vehicle (Land)", "Vehicle (Water)", "Wand", "Wondrous Item"]
  rarities: string[] = ["Mundane", "Common", "Uncommon", "Rare", "Very Rare", "Legendary", "Artifact", "Unknown"]

  requiresAttunement: boolean = false;
  changeAttuneRequirement(event: any) {
    if(event.isUserInput) {
      this.requiresAttunement = event.source.value;
    }
  }

  createContainerForm = new FormGroup({
    id: new FormControl("", {nonNullable: true}),
    name: new FormControl("", {nonNullable: true}),
    weight: new FormControl(0, {nonNullable: true}),
    maxWeightIn: new FormControl(0, {nonNullable: true}),
    weightContained: new FormControl(0, {nonNullable: true})
  })
  customContainer: boolean = false;
  changeContainerSelect(event: any, id: string) {
    if(event.isUserInput) {
      this.customContainer = id === "custom" ? event.source.value : false
    }
  }
  newContainer?: Container;
  createNewContainer() {
    let test = this.createContainerForm.getRawValue();
    test.id = nanoid();
    this.inventoryService.addContainer(test);
    this.customContainer = false;
    this.addItemForm.patchValue({
      container: test.id
    })
  }

  item: Item = {
    id: "", 
    name: "", 
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

  addItemForm = new FormGroup<ControlsOf<Item>>({
    id: new FormControl(nanoid(),  { nonNullable: true }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    container: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    qty: new FormControl(1 , { nonNullable: true, validators: [Validators.required] }),
    worth: new FormControl(0 , { nonNullable: true, validators: [Validators.required] }),
    weight: new FormControl(0 , { nonNullable: true, validators: [Validators.required] }),
    rarity: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    attunable: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
    attuneRequirement: new FormControl('', { nonNullable: true }),
    description: new FormControl([], { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit() {
    console.log(this.addItemForm.getRawValue())
    let testArray = new Array<string>
    let testString = ""
    for (let item of this.addItemForm.getRawValue().description) {
      testString += item
    }
    testArray.push(testString)
    this.item = this.addItemForm.getRawValue()
    this.item.description = testArray
    this.inventoryService.addItem(this.item)
  }
  onNoClick(event: any): void {
    event.stopPropagation()
    this.dialogRef.close();
  }
}

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any> ? FormControl<T[K]> /* if there are sub-groups: FormGroup<ControlsOf<T[K]>> */ : FormControl<T[K]>
}
