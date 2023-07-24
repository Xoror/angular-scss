import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IteminfoComponent } from './iteminfo.component';

describe('IteminfoComponent', () => {
  let component: IteminfoComponent;
  let fixture: ComponentFixture<IteminfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IteminfoComponent]
    });
    fixture = TestBed.createComponent(IteminfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
