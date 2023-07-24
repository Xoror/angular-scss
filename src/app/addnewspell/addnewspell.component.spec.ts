import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewspellComponent } from './addnewspell.component';

describe('AddnewspellComponent', () => {
  let component: AddnewspellComponent;
  let fixture: ComponentFixture<AddnewspellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddnewspellComponent]
    });
    fixture = TestBed.createComponent(AddnewspellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
