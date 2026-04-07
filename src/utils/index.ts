import fs from 'fs';
import which from 'which';
export function randomString(length = 5) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


export function executable(cmd: string): boolean {
  try {
    which.sync(cmd)
  } catch (e) {
    return false
  }
  return true
}



export function hasPackageJson(): boolean {
  return fs.existsSync(process.cwd() + '/package.json')
}


export function getPackageJsonScripts(): Record<string, string> | null {
  const isPackageJson = hasPackageJson();
  if (isPackageJson) {
    return require(process.cwd() + '/package.json')?.scripts || null;
  }
  return null;
}
