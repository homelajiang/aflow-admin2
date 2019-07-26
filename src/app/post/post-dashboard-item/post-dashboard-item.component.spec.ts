import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDashboardItemComponent } from './post-dashboard-item.component';

describe('PostDashboardItemComponent', () => {
  let component: PostDashboardItemComponent;
  let fixture: ComponentFixture<PostDashboardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostDashboardItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDashboardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
