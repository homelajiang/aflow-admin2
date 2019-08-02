import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdeditorComponent } from './mdeditor.component';

describe('MdeditorComponent', () => {
  let component: MdeditorComponent;
  let fixture: ComponentFixture<MdeditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
