import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { nanoid } from 'nanoid';

import { SpellsCall, Spell } from '../interfaces/spells';

@Injectable({
  providedIn: 'root'
})
export class SpellsService {
  private url: string = "https://www.dnd5eapi.co/api/spells";
  
  spellDetailsCalled: boolean = false
  spellDetails: SpellsCall = {count: 0, results: []}
  spells: SpellsCall = {count:0, results: []};
  private spellsSource = new Subject<SpellsCall>();
  spells$ = this.spellsSource.asObservable()

  yourSpells: Spell[] = []
  private yourSpellsSource = new Subject<Spell[]>();
  yourSpells$ = this.yourSpellsSource.asObservable()

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  reset(): void {
    this.spellsSource.next({count: 0, results: []});
    this.spells = {count: 0, results: []};
    this.spellDetails = {count:0, results:[]}
  } 
  subscriptions: Subscription[] = []
  getSpells(extensions: string): void {
    let subscription = this.http.get<SpellsCall>(this.url  + extensions)
      .pipe(
        tap(result => this.spells = result),
        tap(result => this.spellsSource.next(result)),
        tap(result => this.getSpellDetails()),
        //tap(result => console.log(result)),
        catchError(this.handleError<SpellsCall>('getSpells', {count: 0, results:[]}))
      ).subscribe();
    this.subscriptions.push(subscription)
  }
  getSpellDetails(): void {
    for(let i=0; i<this.spells.count;i++) {
      let url: string = "https://www.dnd5eapi.co"+ this.spells.results[i]["url"]
      let subscription = this.http.get<Spell>(url)
        .pipe(
          tap(result => this.spellDetails.results = this.spellDetails.results.concat(result)),
          tap(result => this.spellDetails.count += 1),
          tap(result => this.spellDetails.results[this.spellDetails.count -1 ].id = nanoid()),
          tap(result => {
            this.spellDetails.count === this.spells.count ? this.spellDetailsCalled = true : null
          }),
          tap(result => {
            this.spells = this.spellDetails.count === this.spells.count ? this.spellDetails : this.spells
          }),
          tap(result => {
            this.spellDetails.count === this.spells.count ? this.spellsSource.next(this.spellDetails) : null
          }),
          //tap(result => console.log(this.spellDetails))
        ).subscribe();
        this.subscriptions.push(subscription)
    }
  }

  learnSpell(spell: Spell): void {
    if(this.yourSpells.find(item => item.name === spell.name) === undefined) {
      let spellData = spell
      spellData["prepared"] = false
      this.yourSpells = this.yourSpells.concat(spellData);
      this.yourSpells = this.yourSpells.sort((item1, item2) => {
        if(item1.level > item2.level) {
          return 1;
        }
        if(item1.level < item2.level) {
          return -1;
        }
        return 0;
      })
      this.yourSpellsSource.next(this.yourSpells);
    }
  }
  removeSpell(spell: Spell): void {
    let index = this.yourSpells.indexOf(spell);
    this.yourSpells = this.yourSpells.slice(0, index).concat(this.yourSpells.slice(index+1));
    this.yourSpellsSource.next(this.yourSpells);
  }
  prepareSpell(spell: Spell, checked: boolean): void {
    this.yourSpells.filter(yourSpell => yourSpell.id === spell.id)[0].prepared = checked
  }
  importSpells(data: any):void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions = [];
    this.spells = data.spells;
    this.spellsSource.next(this.spells);
    this.yourSpells = data.yourSpells;
    this.yourSpellsSource.next(this.yourSpells);
    this.spellDetailsCalled = data.spellDetailsCalled;
  }
  constructor(private http: HttpClient) {}
}
