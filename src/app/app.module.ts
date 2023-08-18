import { NgModule } from '@angular/core';
import { NgFor, NgForOf } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SpellsComponent } from './spells/spells.component';
import { PaginatedtableComponent } from './paginatedtable/paginatedtable.component';
import { SpellcardComponent } from './spellcard/spellcard.component';
import { SpellinfoComponent } from './spellinfo/spellinfo.component'
import { AddnewspellComponent } from './addnewspell/addnewspell.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { InventoryComponent } from './inventory/inventory.component';
import { ItemcardComponent } from './itemcard/itemcard.component';
import { IteminfoComponent } from './iteminfo/iteminfo.component';
import { AdditemComponent } from './additem/additem.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    SpellsComponent,
    PaginatedtableComponent,
    SpellcardComponent,
    SpellinfoComponent,
    AddnewspellComponent,
    InventoryComponent,
    ItemcardComponent,
    IteminfoComponent,
    AdditemComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    HttpClientModule,
    MatPaginatorModule,
    MatTableModule,
    MatChipsModule,
    MatSortModule,
    MatExpansionModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonToggleModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgFor,
    NgForOf,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
