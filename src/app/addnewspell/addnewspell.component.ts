import { Component } from '@angular/core';

import { MatDialogRef  } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { SpellsService } from '../services/spells.service';

import { Spell } from '../interfaces/spells';

export interface NewSpell {
  name: string,
  classes: string[],
  casting_time: string,
  ritual: boolean,
  duration: string,
  concentration: boolean,
  area_of_effect?: {
    type: string,
    size: number
  },
  range: string,
  components: string,
  material?: string,
  desc: string[];
}

@Component({
  selector: 'app-addnewspell',
  templateUrl: './addnewspell.component.html',
  styleUrls: ['./addnewspell.component.scss']
})
export class AddnewspellComponent {
  constructor(
    private spellsService: SpellsService,
    public dialogRef: MatDialogRef<AddnewspellComponent>,
    private fb: FormBuilder
  ) {}

  classes: string[] = ["Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Warlock", "Wizard"];
  levels: number[] = [0,1,2,3,4,5,6,7,8,9];
  schools: string[] = ["Abjuration", "Conjuration", "Divination", "Enchantment","Evocation", "Illusion", "Necromancy", "Transmutation"];

  components: any = {
    vocal: {has: false, value: "V"},
    somatic: {has: false, value: "S"},
    material: {has: false, value: "M"}
  }
  selectedClasses: any = []
  changeComponents(key: string, event: any) {
    if(event.isUserInput) {
      this.components[key].has = event.selected
    }
  }
  removeSelectedClass(class1: any) {
    this.data.classes = this.data.classes.filter(item => item.name != class1.name)
  }

  hasAoE: boolean = false
  data: Spell = {
    id: "",
    name: "New Spell",
    level: 0,
    classes: [{name:"Wizard"}],
    casting_time: "",
    ritual: false,
    duration: "",
    concentration: false,
    range: "",
    area_of_effect: {
      type: "",
      size: 0
    },
    components: [],
    material: "",
    desc: [""],
    higher_level: [""],
    school: {name: "placeholder"},
  };
  isDisplayed(class1: any) {
    return this.data.classes.filter(item => class1 === item.name).length === 0
  }
  changeData(id: string, event: any) {
    if(id === "name") {
      this.data.name = event.target.value
    }
    else if(id === "level") {
      this.data.level = event.target.value
    }
    else if(id === "classes") {
      if(event.isUserInput) {
        this.data.classes.push({name: event.source.value})
      }
    }
    else if(id === "school") {
      if(event.isUserInput) {
        this.data.school = {name: event.source.value}
      }
    }
    else if(id ==="casting") {
      this.data.casting_time = event.target.value
    }
    else if(id === "ritual") {
      if(event.isUserInput) {
        this.data.ritual = event.source.value
      }
    }
    else if(id === "duration") {
      this.data.duration = event.target.value
    }
    else if(id === "concentration") {
      if(event.isUserInput) {
        this.data.concentration = event.source.value
      }
    }
    else if(id === "range") {
      this.data.range = event.target.value
    }
    else if(id === "aoe_type") {
      this.data.area_of_effect.type = event.target.value
    }
    else if(id === "aoe_size") {
      this.data.area_of_effect.size = event.target.value
    }
    else if(id === "desc") {
      this.data.desc[0] = event.target.value
    }
    else if(id === "higher_level") {
      this.data.higher_level![0] = event.target.value
    }
    else if(id === "components") {
      let test = []
      let keys = Object.keys(this.components)

      for(let key of keys) {
        if(this.components[key].has) {
          test.push(this.components[key].value)
        }
      }
      this.data.components = test
      console.log(this.data.components)
    }
    else if(id === "material") {
      this.data.material = event.target.value
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit(): void {
    this.spellsService.learnSpell(this.data)
  }
}
