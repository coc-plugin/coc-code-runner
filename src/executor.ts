import { window, workspace } from 'coc.nvim';
import * as path from 'path';
import { getConfigItem } from './config';
import { randomString, executable, getPackageJsonScripts } from './utils';
import { createPrompt, createQuickPick } from './utils/ui';
export async function executor() {
  const executorSimpleMap = getConfigItem('executorMap', {});
  const task = getConfigItem('task', false);
  const language = (await workspace.document).languageId;
  const file = (await workspace.document).uri;
  const dir = path.dirname(file.split('//')[1]).concat('/');
  const inputFile = path.basename(file.split('//')[1]);
  const outputFile = randomString(6);
  if (task) {
    const packageJson = getPackageJsonScripts()
    if (packageJson) {
      const usePackage = await createPrompt("package.json found, do you want to use the executor defined in it?");
      if (usePackage) {
        const selected = await createQuickPick("Select the executor you want to use", Object.keys(packageJson).map(item => {
          const cmd = packageJson[item];
          return {
            label: item,
            description: executable("pnpm") ? `pnpm ${item}` : executable("yarn") ? `yarn ${item}` : `npm run ${item}`,
            value: cmd
          }
        }));
        if (selected) {
          return {
            type: 0,
            cmd: selected.description!,
            dir,
            inputFile,
            outputFile,
          };
        }
        return
      }
    }
  }
  if (!executorSimpleMap[language]) {
    window.showErrorMessage(`No executor found for language: ${language}`);
    return;
  }
  const command = executorSimpleMap[language] as string;
  const dynamic = ['$dir', '$fileNameWithoutExt', '$fileName'];
  if (!dynamic.some((item) => command.includes(item))) {
    return {
      type: 0,
      cmd: command + ` ${dir}${inputFile}`,
      dir,
      inputFile,
      outputFile,
    };
  } else {
    return {
      type: 1,
      cmd: command
        .replace(/\$dir/gi, dir)
        .replace(/\$fileNameWithoutExt/gi, outputFile)
        .replace(/\$fileName/gi, inputFile),
      dir,
      inputFile,
      outputFile,
    };
  }
}
