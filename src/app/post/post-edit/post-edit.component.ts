import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatSnackBar} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import {MarkdownComponent} from '../../markdown/markdown.component';
import {MatDialog} from '@angular/material/dialog';
import {Media, Post, Categories} from '../../entry';
import {SnackBar} from '../../utils/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {BlogService} from 'src/app/blog/blog.service';
import {ImageSelectDialogComponent} from '../../component/image-select-dialog/image-select-dialog.component';

let that: PostEditComponent;


@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  post: Post = new Post();
  categories: Array<Categories> = [null];
  editMode = {
    open: false,
    openComment: false
  };

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  allTags: string[] = []; // 所有的tag名称

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
          that.selectImage()
            .subscribe(result => {
              that.markdownComponent.insertImage(result[0].path);
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
        return tag ? this._filter(tag) : this.allTags.slice();
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

  savePost() {
    const temp = JSON.parse(JSON.stringify(this.post));
    // 整理categories
    temp.categories = this.post.categories ? this.post.categories.id : '';

    // 添加文章内容
    temp.content = this.markdownComponent.getValue();

    if (this.post.id) {
      this.blogService.updatePost(temp, this.post.id)
        .subscribe(res => {
          SnackBar.open(this.snackBar, '已保存');
        }, err => {
          SnackBar.open(this.snackbar, err);
        });
    } else {
      this.blogService.createPost(temp)
        .subscribe(res => {
          SnackBar.open(this.snackBar, '已创建');
          console.log(res);
          this.post.id = res.id;
        }, err => {
          SnackBar.open(this.snackbar, err);
        });
    }
  }

  private selectCover() {
    this.selectImage()
      .subscribe(result => {
        this.post.cover = result[0].path;
      });
  }

  private selectImage(): Observable<Array<Media>> {
    const dialogRef = that.dialog.open(ImageSelectDialogComponent, {
      width: '80vw',
      maxWidth: '100vw',
      height: '80vh'
    });
    return dialogRef.afterClosed();
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
      .subscribe(tagsPage => {
        this.allTags = tagsPage.list;
      });
  }

  onMdChanged(event) {
    // console.log(this.markdownComponent.getValue());
  }


  tagAdd(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // // Add our fruit
      if ((value || '').trim()) {
        let repeat = false;
        for (const tag of this.post.tags) {
          if (tag.toLocaleLowerCase() === value.trim().toLocaleLowerCase()) {
            repeat = true;
            break;
          }
        }
        if (!repeat) {
          this.post.tags.push(value.trim());
          // todo 添加tag对象
        }
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.tagCtrl.setValue(null);
    }
  }

  removeTag(tag: string): void {
    const index = this.post.tags.indexOf(tag);

    if (index >= 0) {
      this.post.tags.splice(index, 1);
    }
  }

  tagSelected(event: MatAutocompleteSelectedEvent): void {

    let repeat = false;
    for (const tag of this.post.tags) {
      if (tag.toLocaleLowerCase() === event.option.viewValue.trim().toLocaleLowerCase()) {
        repeat = true;
        break;
      }
    }
    if (!repeat) {
      this.post.tags.push(event.option.viewValue.trim());
      // 选择所有tag中的数据
    }

    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLocaleLowerCase();
    return this.allTags.filter(t => t.toLowerCase().indexOf(filterValue) === 0);
  }

}
