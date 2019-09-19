import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatSnackBar } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import { MarkdownComponent } from '../../markdown/markdown.component';
import { MoeApp } from '../../markdown/moe-app';
import { MatDialog } from '@angular/material/dialog';
import { PostInsertImageComponent } from '../post-insert-image/post-insert-image.component';
import { Media, Post, Categories, Tag } from '../../entry';
import { SnackBar } from '../../utils/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/blog/blog.service';

let that: PostEditComponent;


@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  post: Post = new Post();
  categories: Array<Categories>;
  tags: Array<Tag>;

  editMode = {
    open:false
  };

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput', { static: true })
  fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true })
  matAutocomplete: MatAutocomplete;

  @ViewChild('markdownComponent', { static: true })
  markdownComponent: MarkdownComponent;

  mdOptions;

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar,
    private routerInfo: ActivatedRoute, private blogService: BlogService,
    private snackbar: MatSnackBar) {
    that = this;

    this.mdOptions = new Object();
    this.mdOptions.placeholder = 'yuan';
    this.mdOptions.toolbar = ['bold', 'italic', 'heading', '|',
      'quote', 'code', 'unordered-list', 'ordered-list', '|',
      'link', {
        name: 'image',
        action: function customFunction(editor) {

          const dialogRef = that.dialog.open(PostInsertImageComponent, {
            width: '80vw',
            maxWidth: '100vw',
            height: '80vh'
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result instanceof Array) {
              if (result.length === 0) {
                SnackBar.open(that.snackBar, '请选择要插入的图片');
              } else {
                // Add your own code
                that.markdownComponent.insertImage(result[0].path);
              }
            }
          });

        },
        className: 'fas fa-image',
        title: 'Insert Image',
      }, 'image', 'table', '|',
      'edit', 'preview', 'side-by-side', '|',
      'fullscreen', 'guide'];

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  ngOnInit() {
    const postId = this.routerInfo.snapshot.paramMap.get('id');
    if (postId) {
      this.getPostInfo(postId);
    }

    this.getAllCategories();
    this.getAllTags();
  }

  private getPostInfo(id: string) {
    this.blogService.getPostInfo(id)
      .subscribe(post => {
        this.post = post;
        this.markdownComponent.setValue(this.post.content);
      },
        err => SnackBar.open(this.snackbar, err));
  }

  private getAllCategories() {
    this.blogService.getAllCategories()
      .subscribe(categoriesPage => this.categories = categoriesPage.list)
  }

  private getAllTags() {
    this.blogService.getAllTags()
      .subscribe(tagsPage => this.tags = tagsPage.list);
  }

  onChanged(event) {
    // console.log(this.markdownComponent.getValue());
  }


  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.fruits.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.fruitCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

}
