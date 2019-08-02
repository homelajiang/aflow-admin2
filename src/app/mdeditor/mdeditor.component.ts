import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import SimpleMDE from 'simplemde';

@Component({
  selector: 'app-mdeditor',
  templateUrl: './mdeditor.component.html',
  styleUrls: ['./mdeditor.component.css']
})
export class MdeditorComponent implements OnInit, AfterViewInit {
  @Input() model: any;
  @Output() modelChange = new EventEmitter<string>();
  @ViewChild('simplemde', {static: true}) textarea: ElementRef;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const modelChange = this.modelChange;
    const mde = new SimpleMDE({
      element: this.textarea.nativeElement,
      forceSync: true,
      status: ['autosave', 'lines', 'words', 'cursor']
    });

    mde.codemirror.on('change', () => {
      const value = mde.codemirror.getValue();
      modelChange.emit(value);
    });

    if (this.model) {
      mde.codemirror.setValue(this.model);
    }
  }

}
