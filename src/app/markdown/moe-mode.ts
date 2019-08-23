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
    this.rightPanel = document.getElementById('right-panel');
    this.modeMenu = document.getElementById('popup-menu-mode');
    // this.modeMenuItems = this.modeMenu.getElementsByTagName('li');
    this.editor = document.getElementById('editor');
    this.container = document.getElementById('container');

    this.setMode(MoeApp.config['edit-mode']);

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
      if (e.target === this.rightPanel && (MoeApp.config['edit-mode'].startsWith('read')
        || MoeApp.config['edit-mode'].startsWith('preview'))) {
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

    setTimeout(() => {
      updateModeStatus();
    }, 0);

    if (MoeApp.config['edit-mode'] === m) {
      return;
    }

    if (!this.isReadMode(MoeApp.config['edit-mode']) && this.isReadMode(m)) {
      MoeApp.config['edit-mode'] = m;
      MoeApp.moeMd.updatePre(true);
    }
    MoeApp.config['edit-mode'] = m;

    document.getElementById('md-main').classList.remove('notransition');
    setTimeout(() => {
      document.getElementById('md-main').classList.add('notransition');
    }, 500);

  }

  private isReadMode(mode: string) {
    return !(mode === 'write-wide' || mode === 'write-medium' || mode === 'write-narrow');
  }

  private setBaseMode(bm, m) {
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

function updateModeStatus() {

  function setElementActive(element, active) {

    if (!/active/.test(element.className) && active) {
      element.className += ' active';
      return;
    }

    if (/active/.test(element.className) && !active) {
      element.className = element.className.replace(/\s*active\s*/g, '');
      return;
    }

  }

  const mode = MoeApp.config['edit-mode'];

  const editButton = MoeApp.toolbarElements.edit;
  const readButton = MoeApp.toolbarElements.preview;
  const sideBySideButton = MoeApp.toolbarElements['side-by-side'];


  if (mode === 'read-wide' || mode === 'read-medium' || mode === 'read-narrow') {
    setElementActive(editButton, false);
    setElementActive(readButton, true);
    setElementActive(sideBySideButton, false);
  } else if (mode === 'write-wide' || mode === 'write-medium' || mode === 'write-narrow') {
    setElementActive(editButton, true);
    setElementActive(readButton, false);
    setElementActive(sideBySideButton, false);
  } else if (mode === 'preview') {
    setElementActive(editButton, false);
    setElementActive(readButton, false);
    setElementActive(sideBySideButton, true);
  }

}
