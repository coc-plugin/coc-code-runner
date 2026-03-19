import { window, workspace } from 'coc.nvim';
import * as path from 'path';
import { getConfigItem } from './config';
import { randomString } from './utils';
export async function executor() {
  const executorSimpleMap = getConfigItem('executorMap', {});
  const language = (await workspace.document).languageId;
  if (!executorSimpleMap[language]) {
    window.showErrorMessage(`No executor found for language: ${language}`);
    return;
  }
  const command = executorSimpleMap[language] as string;
  const file = (await workspace.document).uri;
  const dir = path.dirname(file.split('//')[1]).concat('/');
  const inputFile = path.basename(file.split('//')[1]);
  const outputFile = randomString(6);
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
