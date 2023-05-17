import { Ora } from 'ora';
import { exec } from 'node:child_process';

import { handleError } from './helpers.js';

// ts interfaces
export interface DemoListItem {
  name: string;
  value: string;
  npmCommand?: string;
}

export interface KeyPressKey {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
}

export interface ExecNpmCommandParams {
  command: string;
  flags: string;
  callback: (...args: any) => any;
  spinnerRef?: Ora;
}

// helper methods
export const execNpmCommand = ({
  command,
  flags,
  callback,
  spinnerRef = undefined,
}: ExecNpmCommandParams) => {
  exec(`npm run ${command} --silent -- ${flags}`, (error, stdout) => {
    if (error) {
      if (spinnerRef) {
        spinnerRef.fail();
      }
      handleError(error);
    }
    if (spinnerRef) {
      spinnerRef.succeed();
    }
    callback(stdout);
  });
};
