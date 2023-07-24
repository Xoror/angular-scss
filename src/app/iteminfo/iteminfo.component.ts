import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Item } from '../interfaces/inventory';

@Component({
  selector: 'app-iteminfo',
  templateUrl: './iteminfo.component.html',
  styleUrls: ['./iteminfo.component.scss']
})
export class IteminfoComponent implements OnChanges {
  @Input() data!: Item;

  ngOnChanges(changes: SimpleChanges) {
    this.data = changes["data"]["currentValue"]
  }
}
