import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'

import { Spell } from '../interfaces/spells';

@Component({
  selector: 'app-spellinfo',
  templateUrl: './spellinfo.component.html',
  styleUrls: ['./spellinfo.component.scss']
})

export class SpellinfoComponent implements OnChanges {
  @Input() data!: Spell;

  spellTiers = ["Cantrip", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th",]
  classes: string = "";
  components: string = "";
  areaOfEffect: string = "";

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["data"]["currentValue"].classes != undefined) {
      this.data = changes["data"]["currentValue"]
      for (let i=0; i < this.data.classes.length; i++) {
        if(i === this.data.classes.length - 1) {
            this.classes += `${this.data.classes[i].name}`;
        } else {
            this.classes += `${this.data.classes[i].name}, `;
        }
      }
      for (let i=0; i<this.data.components.length; i++) {
        if(i === 0) {
          this.components += this.data.components[i]
        }
        else {
          this.components += ", " + this.data.components[i]
        }
      }
      if(this.data.material) {
        this.components += " (" + this.data.material + ")"
      }
      if(this.data.area_of_effect) {
        this.areaOfEffect = " (" + this.data.area_of_effect.size +" feet " + this.data.area_of_effect.type +")"
      }
    }
  }
}
