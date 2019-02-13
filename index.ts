const fs = require('fs');
const rimraf = require("rimraf");
const exec = require('child-process-promise').exec;
const path = process.cwd();

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createDirectory(): Promise<string> {
    const name = makeid();
    await new Promise(async (resolve, reject) => {
        fs.mkdir(`${path}/temp/${name}`, err => {
            if (err) reject(err);
            else resolve();
        });
    });
    return name;
}

async function deleteDirectory(directory: string): Promise<boolean> {
    let deleted = false;
    await new Promise(async (resolve, reject) => {
        rimraf(`${path}/temp/${directory}`, function () {
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
        exec(`npm init --yes`, { cwd: `${path}/temp/${dir}` }).then(function (result) {
            var stdout = result.stdout;
            var stderr = result.stderr;
            console.log('stdout: ', stdout);
            console.log('stderr: ', stderr);
            exec(`${command}`, { cwd: `${path}/temp/${dir}` }).then(function (result) {
                var stdout = result.stdout;
                var stderr = result.stderr;
                console.log('stdout: ', stdout);
                console.log('stderr: ', stderr);
                packageInstalled = true;
                resolve();
            }).catch(function (err) {
                console.error('ERROR: ', err);
                reject(err);
            });
        }).catch(function (err) {
            console.error('ERROR: ', err);
        });
    });
    return packageInstalled;
}

async function main() {
    let numberArray = [];
    for (let index = 0; index < params.installNumber; index++) {
        numberArray.push(index);
    }
    asyncForEach(numberArray, async function () {
        await timeout(10000); // 10 secondes

        const dir = await createDirectory();
        console.log(`created directory ${dir}`);

        const packageInstalled = await installPackage(dir, `npm i ${params.packageName}`);
        console.log(`package installed ${packageInstalled}`);

        const deleted = await deleteDirectory(dir);
        console.log(`directory delete ${deleted}`);
    });
}

let params = {
    packageName: 'jotils',
    installNumber: 1
}

main();