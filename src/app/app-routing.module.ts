import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SpellsComponent } from './spells/spells.component';
import { InventoryComponent } from './inventory/inventory.component';



const routes: Routes = [
  { path: "", component: DashboardComponent},
  { path: "spells", component: SpellsComponent},
  { path: "inventory", component: InventoryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
