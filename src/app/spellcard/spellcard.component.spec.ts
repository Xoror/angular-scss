import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellcardComponent } from './spellcard.component';

describe('SpellcardComponent', () => {
  let component: SpellcardComponent;
  let fixture: ComponentFixture<SpellcardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpellcardComponent]
    });
    fixture = TestBed.createComponent(SpellcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
