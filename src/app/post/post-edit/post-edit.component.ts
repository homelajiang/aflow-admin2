import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatSnackBar} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import {MarkdownComponent} from '../../markdown/markdown.component';
import {MoeApp} from '../../markdown/moe-app';
import {MatDialog} from '@angular/material/dialog';
import {PostInsertImageComponent} from '../post-insert-image/post-insert-image.component';
import {Media, Post, Categories, Tag} from '../../entry';
import {SnackBar} from '../../utils/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {BlogService} from 'src/app/blog/blog.service';

let that: PostEditComponent;


@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  post: Post = new Post();
  categories: Array<Categories> = [null];
  tags: Array<Tag> = [];

  editMode = {
    open: false,
    openComment: false
  };

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<Tag[]>;

  @ViewChild('tagInput', {static: true})
  tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: true})
  matAutocomplete: MatAutocomplete;

  @ViewChild('markdownComponent', {static: true})
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

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => {
       return tag ? this._filter(tag) : this.tags.slice();
      }));
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
      .subscribe(categoriesPage => this.categories = this.categories.concat(categoriesPage.list));
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

      // // Add our fruit
      // if ((value || '').trim()) {
      //   this.post.tags.push(value);
      // }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.tagCtrl.setValue(null);
    }
  }

  removeTag(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.post.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    // this.post.tags.push(event.option.value);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(tag: string): Tag[] {
    const filterValue = tag.toLowerCase();
    return this.tags.filter(t => t.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
