import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellinfoComponent } from './spellinfo.component';

describe('SpellinfoComponent', () => {
  let component: SpellinfoComponent;
  let fixture: ComponentFixture<SpellinfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpellinfoComponent]
    });
    fixture = TestBed.createComponent(SpellinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
