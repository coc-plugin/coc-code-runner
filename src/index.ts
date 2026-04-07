import { commands, ExtensionContext, languages, OutputChannel, window } from 'coc.nvim';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { getConfigItem } from './config';
import { executor } from './executor';
import { rm } from 'fs/promises';
import { RunCodeActionProvider } from './codeActionProvider';
export let _process: ChildProcessWithoutNullStreams | null = null;
let _channel: OutputChannel | null = null;
export async function activate(context: ExtensionContext): Promise<void> {
  const enable = getConfigItem('enable', true);
  const executorMap = getConfigItem('executorMap', {});
  const executorFt = getConfigItem('executorFt', []);
  const task = getConfigItem('task', false);
  if (!enable) {
    return;
  }
  if (!_channel) {
    _channel = window.createOutputChannel('coc-code-runner');
  }
  const supportedLanguages = [...Object.keys(executorMap)];
  if (task) {
    supportedLanguages.unshift(...executorFt)
  }
  context.subscriptions.push(
    languages.registerCodeActionProvider(
      supportedLanguages.map((language) => ({ scheme: 'file', language })),
      new RunCodeActionProvider(),
      'code-runner'
    ),
    commands.registerCommand('code-runner.stop', async () => {
      if (_channel) {
        _channel.appendLine('[Stopped] Process has been stopped by user.');
        _channel.hide();
        _channel.dispose();
      }
      if (_process) {
        _process.kill();
        _process = null;
      }
      window.showInformationMessage('Code execution stopped.');
    }),
    commands.registerCommand('code-runner.run', async () => {
      if (_channel) {
        _channel.dispose();
      }
      if (_process) {
        _process.kill();
        _process = null;
      }
      _channel = window.createOutputChannel('coc-code-runner');
      let command:
        | { type: number; cmd: string; dir: string; inputFile: string; outputFile: string }
        | undefined;
      try {
        command = await executor();
      } catch (e) {
        _channel!.append('[Error] ' + (e as any)?.message);
        window.showErrorMessage((e as any)?.message);
        return;
      }
      if (command) {
        window.showInformationMessage('Running: ' + command.cmd);

        _channel.appendLine('[Running] ' + command.cmd);

        const startTime = new Date();

        _process = spawn(command.cmd, [], { shell: true });

        _process.stdout.on('data', (data) => {
          _channel!.append(data.toString());
        });

        _process.stderr.on('data', (data) => {
          _channel!.append(data.toString());
        });

        _process.on('close', async (code) => {
          const endTime = new Date();
          const elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;
          _channel!.appendLine('');
          _channel!.appendLine(
            '[Done] exited with code=' + code + ' in ' + elapsedTime + ' seconds'
          );
          _channel!.appendLine('');
          if (command.type == 1) {
            try {
              await rm(command.outputFile);
            } catch {}
          }
          if (_process) {
            _process.kill();
            _process = null;
          }
        });
        _channel.show(true);
      }
    })
  );
}
