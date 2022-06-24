import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimpressionComponent } from './reimpression.component';

describe('ReimpressionComponent', () => {
  let component: ReimpressionComponent;
  let fixture: ComponentFixture<ReimpressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReimpressionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
