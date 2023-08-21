import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { MatDialog} from '@angular/material/dialog';

import { FilterList } from '../interfaces/filters';
import { Spell } from '../interfaces/spells';
import { SpellsService } from '../services/spells.service';
import { AddnewspellComponent } from '../addnewspell/addnewspell.component';


@Component({
  selector: 'app-spellcard',
  templateUrl: './spellcard.component.html',
  styleUrls: ['./spellcard.component.scss']
})
export class SpellcardComponent implements OnChanges, OnInit {
  @Input() data: any[] = []
  @Input() id: string = "bla"
  displayedColumns: string[] = []
  noSpells: boolean = true

  spellDetailsCalled: boolean = false;

  filterBox: boolean = false
  toggleFilterbox(): void {
    this.filterBox = !this.filterBox
  }
  filterNameLists: FilterList = {
    spellLevels: ["0","1","2","3","4","5","6","7","8","9"],
    classes: ["Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Warlock", "Wizard"],
    schools: ["Abjuration", "Conjuration", "Divination", "Enchantment","Evocation", "Illusion", "Necromancy", "Transmutation"],
    rituals: ["Is Ritual", "Is not Ritual"]
  }
  filterLists: FilterList = {
    spellLevels:  [],
    classes:  [],
    schools: [],
    rituals: []
  }
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
    if(this.id === "allSpells") {
      this.data = this.spellsService.spellDetails.results.filter(spell => this.filterFunction(spell))
    }
    else if(this.id === "yourSpells") {
      this.data = this.spellsService.yourSpells.filter(spell => this.filterFunction(spell))
    }
  }
  filterFunction(spell: Spell): boolean {
    let testTiers: boolean = false
    if(this.filterLists["spellLevels"].length != 0) {
      testTiers = this.filterLists["spellLevels"].find(level => (spell.level.toString() === level)) ? true:false
    }
    else {
      testTiers = true
    }
    //filter for the classes
    let testClasses: boolean = false
    if(this.filterLists["classes"].length != 0) {
      for(let j=0; j<this.filterLists["classes"].length;j++) {
        for(let k=0; k<spell.classes.length;k++) {
            if(this.filterLists["classes"][j] === spell.classes[k].name) {
                testClasses = true
            }
        }
      }
    }
    else {
      testClasses = true
    }
    //filter for the spell schools
    let testSchools: boolean = false
    if(this.filterLists["schools"].length != 0) {
      testSchools = this.filterLists["schools"].find(school => spell.school.name === school) ? true:false
    }
    else {
      testSchools = true
    }
    //filter for the rituals
    let testRituals: boolean = false
    let spellRitualString: string = "bla"
    if(this.filterLists["rituals"].length != 0) {
      spellRitualString = spell.ritual ? "Is Ritual":"Is not Ritual"
      testRituals = this.filterLists["rituals"].find(ritual => ritual === spellRitualString) ? true : false
    }
    else {
      testRituals = true
    }
    return testTiers && testClasses && testSchools && testRituals
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddnewspellComponent, {
      panelClass: "dialog-background",
      width: "50%"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  constructor(private spellsService: SpellsService, public dialog: MatDialog) {

  }
  ngOnInit(): void {
    if(this.id === "yourSpells") {
      this.spellDetailsCalled = true
    }
    this.displayedColumns = this.spellDetailsCalled ? ['learn', 'name', 'level', 'expand'] : ['name']
    this.displayedColumns = this.id === 'yourSpells' ? (!(this.data[0].name === "Add Spells to your Grimoire") ? (this.spellDetailsCalled ? ['learn', 'name', 'level', 'expand'] : ['name']) : ['name']) : this.displayedColumns
  }
  ngOnChanges(changes: SimpleChanges) {
    this.data = changes["data"] != undefined ? [...changes["data"]["currentValue"]] : this.data
    if(this.data.length === 0) {
      this.data = [{name:"Add Spells to your Grimoire"}]
    }
    this.id = changes["id"] != undefined ? changes["id"]["currentValue"] : this.id
    if(this.id === "allSpells") {
      if(this.spellDetailsCalled != this.spellsService.spellDetailsCalled) {
        this.spellDetailsCalled = this.spellsService.spellDetailsCalled
      }
    }
    this.displayedColumns = this.spellDetailsCalled ? ['learn', 'name', 'level', 'expand'] : ['name']
    if(this.id === "allSpells") {
      if(this.data[0].name === "Add Spells to your Grimoire") {
        //this.data = [{name: "Loading spells..."}];
      }
    }
    if(this.data[0].name === "Add Spells to your Grimoire") {
      this.noSpells = true;
    }
    else {
      this.noSpells = false
    }
    this.displayedColumns = this.id === 'yourSpells' ? (!this.noSpells ? (this.spellDetailsCalled ? ['learn', 'prepared', 'name', 'level', 'expand'] : ['name']) : ['name']) : this.displayedColumns 
  }
}
