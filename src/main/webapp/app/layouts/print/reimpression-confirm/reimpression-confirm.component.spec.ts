import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimpressionConfirmComponent } from './reimpression-confirm.component';

describe('ReimpressionConfirmComponent', () => {
  let component: ReimpressionConfirmComponent;
  let fixture: ComponentFixture<ReimpressionConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReimpressionConfirmComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimpressionConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
