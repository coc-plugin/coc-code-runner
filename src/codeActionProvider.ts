import { CodeActionProvider, Command, ProviderResult, CodeActionKind, CodeAction } from 'coc.nvim';
import { CodeAction as VsCodeAction } from 'vscode-languageserver-protocol';
export class RunCodeActionProvider implements CodeActionProvider {
  constructor() {}
  provideCodeActions(): ProviderResult<(Command | CodeAction)[]> {
    const actions: CodeAction[] = [];
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
    return actions;
  }
}
