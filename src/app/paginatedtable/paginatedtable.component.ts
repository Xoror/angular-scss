import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog} from '@angular/material/dialog';

import {LiveAnnouncer} from '@angular/cdk/a11y';
import { AdditemComponent } from '../additem/additem.component';

import { SpellsService } from '../services/spells.service';
import { Spell } from '../interfaces/spells';
import { Item } from '../interfaces/inventory';
import { MatSort, Sort } from '@angular/material/sort';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-paginatedtable',
  templateUrl: './paginatedtable.component.html',
  styleUrls: ['./paginatedtable.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class PaginatedtableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() data: Spell[] | Item[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() id: string = "bla";
  @Input() noData: boolean = true;
  @Input() detailsCalled: boolean = false;
  @Input() dataType: string = "";
  @Input() container?: string;

  tableCaption: string = ""
  

  expandedElement: Spell | Item | Placeholder = { id:"" }
  displayedColumnsWithExpand: string[]= [];

  expandedElementVariable: boolean = false
  changeExpandedElementVariable(spell: any, event: Event): void {
    if(this.detailsCalled) {
      event.stopPropagation()
      if(this.expandedElement === undefined) {
        this.expandedElement = spell
      }
      else {
        this.expandedElement = this.expandedElement!.id === spell.id ? { id:"" } : spell
      }
    }
  }

  constructor(
    private route: ActivatedRoute, 
    private inventoryService: InventoryService, 
    private spellsService: SpellsService, 
    private _liveAnnouncer: LiveAnnouncer, 
    public dialog: MatDialog) {}
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  dataSource = new MatTableDataSource<Spell | Item>([])

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort) sort!: MatSort;
  
  prepareSpell(event: Event, spell: Spell) {
    event.stopPropagation()
    this.spellsService.prepareSpell(spell, (event.target as HTMLInputElement).checked)
  }
  learnSpell(spell: Spell) {
    this.spellsService.learnSpell(spell)
  }
  removeSpell(spell: Spell) {
    this.spellsService.removeSpell(spell)
  }
  addItem(item: Item): void {
    const dialogRef = this.dialog.open(AdditemComponent, {
      panelClass: "dialog-background",
      width: "100%",
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  removeItem(item: Item) {
    this.inventoryService.removeItem(item)
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    //this.dataSource.sort = this.sort
  }

  ngOnChanges(changes: SimpleChanges) {
    this.data = changes["data"]["currentValue"];
    this.dataSource.data = changes["data"]["currentValue"];
    if(changes["displayedColumns"] != undefined) {
      this.displayedColumns = changes["displayedColumns"]["currentValue"];
    }
    this.displayedColumnsWithExpand = [...this.displayedColumns]
    switch (this.id) {
      case 'allSpells': {
        this.tableCaption = "Table of all available spells you can learn";
        break;
      }
      case 'yourSpells': {
        this.tableCaption = "Table of spells you've learned";
        break;
      }
      case 'allItems': {
        this.tableCaption = "Table of all available items to choose from";
        break;
      }
      case 'yourInventory': {
        this.tableCaption = "Table of items in your inventory";
        break;
      }
    }
  }
  
  ngOnInit() {
    this.dataSource.data = this.data
    this.displayedColumnsWithExpand = this.displayedColumns;
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
}

interface Placeholder {
  id: string
}