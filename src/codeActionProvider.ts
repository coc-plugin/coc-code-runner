import {
  CodeActionProvider,
  Command,
  ProviderResult,
  CodeActionKind,
  CodeAction,
  window,
} from 'coc.nvim';
import { CodeAction as VsCodeAction } from 'vscode-languageserver-protocol';
import { _process } from './index';
export class RunCodeActionProvider implements CodeActionProvider {
  constructor() {}
  provideCodeActions(): ProviderResult<(Command | CodeAction)[]> {
    const actions: CodeAction[] = [];
    if (_process) {
      window.showInformationMessage('ss');
      actions.push(
        VsCodeAction.create(
          'stop code runner',
          {
            title: 'stop code runner',
            command: 'coc-code-runner.stop',
            arguments: [],
          },
          CodeActionKind.Empty
        )
      );
    } else {
      actions.push(
        VsCodeAction.create(
          'code runner',
          {
            title: 'code runner',
            command: 'coc-code-runner.run',
            arguments: [],
          },
          CodeActionKind.Empty
        )
      );
    }
    return actions;
  }
}
