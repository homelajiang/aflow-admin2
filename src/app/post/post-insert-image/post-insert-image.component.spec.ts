import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostInsertImageComponent } from './post-insert-image.component';

describe('PostInsertImageComponent', () => {
  let component: PostInsertImageComponent;
  let fixture: ComponentFixture<PostInsertImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostInsertImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostInsertImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
