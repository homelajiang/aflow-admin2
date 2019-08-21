import {MoeApp} from './moe-app';

export class MoeMode {
  private titlebar;
  main;
  modeButton;
  rightPanel;
  modeMenu;
  // modeMenuItems;
  editor;
  container;

  modeList = ['write-wide', 'write-medium', 'write-narrow', 'preview', 'read-wide', 'read-medium', 'read-narrow'];
  index = 0;

  constructor() {
    this.titlebar = document.getElementById('electron-titlebar');
    this.main = document.getElementById('md-main');
    this.modeButton = document.getElementById('button-bottom-mode');
    this.rightPanel = document.getElementById('right-panel');
    this.modeMenu = document.getElementById('popup-menu-mode');
    // this.modeMenuItems = this.modeMenu.getElementsByTagName('li');
    this.editor = document.getElementById('editor');
    this.container = document.getElementById('container');

    this.setMode(MoeApp.config['edit-mode']);
    this.modeButton.addEventListener('click', (e) => {
      // this.setMode('write-wide');
      this.setMode(this.modeList[this.index % 7]);
      this.index++;
    });

    // for (const it of this.modeMenuItems) {
    //   it.addEventListener('click', () => {
    //     this.setMode(it.attributes['data-name'].value);
    //     MoeApp.editor.focus();
    //   });
    // }


    this.editor.addEventListener('transitionend', (e) => {
      if (e.target === this.editor && e.propertyName === 'width') {
        MoeApp.editor.refresh();
      }
    });

    this.rightPanel.addEventListener('transitionend', (e) => {
      if (e.target === this.rightPanel && (MoeApp.editMode.startsWith('read') || MoeApp.editMode.startsWith('preview'))) {
        // TODO
        // window.updatePreview(true);
      }
    });


  }

  setMode(m) {
    [
      'write-mode',
      'read-mode',
      'write-mode-wide',
      'write-mode-medium',
      'write-mode-thin',
      'read-mode-wide',
      'read-mode-medium',
      'read-mode-thin'
    ].forEach(x => this.main.classList.remove(x));

    if (m === 'write-wide') {
      this.setBaseMode('write', m);
      this.main.classList.add('write-mode-wide');
    } else if (m === 'write-medium') {
      this.setBaseMode('write', m);
      this.main.classList.add('write-mode-medium');
    } else if (m === 'write-narrow') {
      this.setBaseMode('write', m);
      this.main.classList.add('write-mode-thin');
    } else if (m === 'preview') {
      this.setBaseMode('preview', m);
    } else if (m === 'read-wide') {
      this.setBaseMode('read', m);
      this.main.classList.add('read-mode-wide');
    } else if (m === 'read-medium') {
      this.setBaseMode('read', m);
      this.main.classList.add('read-mode-medium');
    } else if (m === 'read-narrow') {
      this.setBaseMode('read', m);
      this.main.classList.add('read-mode-thin');
    }

    if (MoeApp.editMode === m) {
      return;
    }

    // for (const it of this.modeMenuItems) {
    //   it.getElementsByClassName('fa')[0].style.opacity = (it.attributes['data-name'].value === m) ? '1' : '0';
    // }

    MoeApp.editMode = m;
    MoeApp.config['edit-mode'] = m;
    document.getElementById('md-main').classList.remove('notransition');
    setTimeout(() => {
      document.getElementById('md-main').classList.add('notransition');
    }, 500);
  }

  setBaseMode(bm, m) {
    document.body.setAttribute('settings-mode', bm);
    if (bm === 'write') {
      this.main.classList.add('write-mode');
      MoeApp.config['edit-mode-write'] = m;
    } else if (bm === 'read') {
      this.main.classList.add('read-mode');
      MoeApp.config['edit-mode-read'] = m;
    }
  }


}
