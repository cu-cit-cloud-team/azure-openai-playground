import { exec } from 'node:child_process';
import { Ora } from 'ora';

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
  playMusic?: boolean;
}

// helper methods

/**
 * @function
 * @description Executes an npm command and optionally stops an Ora spinner
 * @param {ExecNpmCommandParams} params
 * @param {string} params.command - npm command to execute
 * @param {string} params.flags - flags to pass to the npm command
 * @param {Function} params.callback - callback function to execute after the npm command is executed
 * @param {Ora} [params.spinnerRef=undefined] - Ora spinner reference to stop
 * @param {boolean} [params.playMusic=false] - whether to play the benny hill theme song while the command is executing
 * @returns {void}
 */
export const execNpmCommand = ({
  command,
  flags,
  callback,
  spinnerRef = undefined,
  playMusic = false,
}: ExecNpmCommandParams) => {
  exec(
    `${
      playMusic ? 'npx benny-hill ' : ''
    }npm run ${command} --silent -- ${flags}`,
    (error, stdout) => {
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
    },
  );
};
