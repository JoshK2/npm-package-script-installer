const fs = require('fs');
const rimraf = require('rimraf');
const exec = require('child-process-promise').exec;
const path = process.cwd();
const randomBetween = require('@bit/joshk.jotils.random-between');

async function asyncForEach(array: Array<any>, callback: any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function makeid(): string {
  var text: string = '';
  var possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 10; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createDirectory(): Promise<string> {
  const name = makeid();
  await new Promise(async (resolve, reject) => {
    fs.mkdir(`${path}/tmp/${name}`, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });
  return name;
}

async function deleteDirectory(directory: string): Promise<boolean> {
  let deleted = false;
  await new Promise(async (resolve, reject) => {
    rimraf(`${path}/tmp/${directory}`, function() {
      console.log('delete done');
      deleted = true;
      resolve();
    });
  });
  return deleted;
}

async function installPackage(dir: string, command: string): Promise<boolean> {
  let packageInstalled = false;
  await new Promise(async (resolve, reject) => {
    exec(`npm init --yes`, { cwd: `${path}/tmp/${dir}` })
      .then(function(result: any) {
        var stdout = result.stdout;
        var stderr = result.stderr;
        console.log('stdout: ', stdout);
        console.log('stderr: ', stderr);
        exec(`${command}`, { cwd: `${path}/tmp/${dir}` })
          .then(function(result: any) {
            var stdout = result.stdout;
            var stderr = result.stderr;
            console.log('stdout: ', stdout);
            console.log('stderr: ', stderr);
            packageInstalled = true;
            resolve();
          })
          .catch(function(err: any) {
            console.error('ERROR: ', err);
            reject(err);
          });
      })
      .catch(function(err: any) {
        console.error('ERROR: ', err);
      });
  });
  return packageInstalled;
}

async function main() {
  if (process.argv.length === 2) {
    throw new Error('must enter a package name');
  }
  if (typeof process.argv[3] === 'undefined') {
    console.log('number of download not set, default is 1');
  }
  let params = {
    packageName: process.argv[2],
    installNumber: typeof process.argv[3] === 'undefined' ? 1 : parseInt(process.argv[3]),
  };
  let numberArray = [];
  for (let index = 0; index < params.installNumber; index++) {
    numberArray.push(index);
  }
  asyncForEach(numberArray, async function() {
    await timeout(randomBetween(10000, 30000)); // 10 - 30 secondes

    const dir = await createDirectory();
    console.log(`created directory ${dir}`);

    const packageInstalled = await installPackage(dir, `npm i ${params.packageName}`);
    console.log(`package installed ${packageInstalled}`);

    const deleted = await deleteDirectory(dir);
    console.log(`directory delete ${deleted}`);
  });
}

main();
