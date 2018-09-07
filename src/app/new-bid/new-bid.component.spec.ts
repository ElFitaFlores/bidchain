import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBidComponent } from './new-bid.component';

describe('NewBidComponent', () => {
  let component: NewBidComponent;
  let fixture: ComponentFixture<NewBidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
