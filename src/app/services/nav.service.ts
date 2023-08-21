import { Injectable } from '@angular/core';

import { SpellsService } from './spells.service';
import { InventoryService } from './inventory.service';
import { HttpEvent } from '@angular/common/http';

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
  constructor(private spellsService: SpellsService, private inventoryService: InventoryService) {}

  

  downloadFile = ( data: string, fileName: string, fileType: string ) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  }
  
  exportToJson = (currentState: any) => {
    this.downloadFile(
      JSON.stringify(currentState, null, "\t"),
      "manager-data" +'.json',
      'text/json',
    );
  }

  selectedFile: File | null | undefined;
  readFileOnUpload = (event: Event) => {
    this.selectedFile = (event.target as HTMLInputElement).files?.item(0);
    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile as Blob, "UTF-8");
    fileReader.onloadend = () => {
      try {
        console.log(JSON.parse(fileReader.result as string));
        this.inventoryService.importItems(JSON.parse(fileReader.result as string));
        this.spellsService.importSpells(JSON.parse(fileReader.result as string));
      } catch(e) {
        console.log("**Not valid JSON file!**");
      }
    }
  }
}
