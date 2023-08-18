import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { SpellsService } from '../services/spells.service';
import { Spell, SpellsCall } from '../interfaces/spells';


@Component({
  selector: 'app-spells',
  templateUrl: './spells.component.html',
  styleUrls: ['./spells.component.scss']
})
export class SpellsComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);

  spellDetailsCalled: boolean = this.spellsService.spellDetailsCalled
  spells: SpellsCall = {count: 0, results: []};
  spellsSubscription: Subscription;
  data: any[] = this.spellsService.spellDetails.results

  yourSpells: Spell[] = [];
  yourSpellsSubscription: Subscription;
  yourData: any[] = this.spellsService.yourSpells

  reset(): void {
    this.spellsService.reset();
  }
  getSpells(): void {
    if(this.spellsService.spells.count === 0) {
      this.spellsService.getSpells("")
    }
    else {
      this.spells = this.spellsService.spells;
      this.data = this.spells.results;
    }
   }

   constructor(private spellsService: SpellsService) {
    this.spellsSubscription = this.spellsService.spells$.subscribe(spells => {
      this.spells = spells;
      this.data = this.spells.results;
      if(this.spellDetailsCalled != this.spellsService.spellDetailsCalled) {
        this.spellDetailsCalled = this.spellsService.spellDetailsCalled
      }
    });
    this.yourSpellsSubscription = this.spellsService.yourSpells$.subscribe(spells => {
      this.yourSpells = spells;
      this.yourData = this.yourSpells;
    });
  }
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Medium).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Your Spells', cols: 1, rows: 1, class: "card left" },
          { title: 'All Spells', cols: 1, rows: 1, class: "card right" }
        ];
      }

      return [
        { title: 'Your Spells', cols: 2, rows: 2, class: "card left" },
        { title: 'All Spells', cols: 2, rows: 2, class: "card right" }
      ];
    })
  );
   ngOnInit(): void {
     this.getSpells();
   }
   ngOnDestroy(): void {
     this.spellsSubscription.unsubscribe();
     this.yourSpellsSubscription.unsubscribe();
   }
}
