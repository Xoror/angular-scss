import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  isSidenavOpened: string = "true"
  toggle(): string {
    if(this.isSidenavOpened === "true") {
      return this.isSidenavOpened = "false"
    }
    else {
      return this.isSidenavOpened = "true"
    }
  }
  constructor() { }
}
