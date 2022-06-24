import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateTTComponent } from './template-tt.component';

describe('TemplateTTComponent', () => {
  let component: TemplateTTComponent;
  let fixture: ComponentFixture<TemplateTTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateTTComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateTTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
