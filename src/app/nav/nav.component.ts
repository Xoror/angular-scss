import { Component, inject } from '@angular/core';

import { NavService } from '../services/nav.service';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  private breakpointObserver = inject(BreakpointObserver);

  navigationVariable: string = "spells"
  isOpen: string = "true"
  toggle(): void {
    this.isOpen = this.navService.toggle()
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
    .pipe(
      map(result => !result.matches),
      shareReplay()
    );
  
  constructor (private navService: NavService) {}
}
