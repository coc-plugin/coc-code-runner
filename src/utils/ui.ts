import { QuickPickItem, window } from 'coc.nvim';

export function createInput(title: string, defaultValue = ''): Promise<string> {
  return new Promise(async (resolve, _) => {
    const box = await window.createInputBox(title, defaultValue, {
      position: 'center',
    });
    box.onDidFinish(async (name) => {
      if (!name) {
        resolve('outPut');
        return;
      }
      resolve(name);
    });
  });
}

export function createPrompt(title: string): Promise<boolean> {
  return new Promise(async (resolve, _) => {
    const status = await window.showPrompt(title);
    resolve(status);
  });
}

export function createQuickPick(title: string, items: QuickPickItem[]): Promise<QuickPickItem | undefined> {
  return new Promise(async (resolve, _) => {
    const status = await window.showQuickPick(items, { title });
    resolve(status)
  })
}
