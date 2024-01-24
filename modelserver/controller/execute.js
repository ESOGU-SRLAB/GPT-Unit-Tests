const { PythonShell } = require("python-shell")
const { exec } = require("child_process")
const express = require("express")
const fs = require("fs");
const { stderr } = require("process");

function isBuiltInLibrary(library) {
    try {
        require.resolve(library);
        return true;
    } catch (error) {
        return false;
    }
}

async function runShellCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

async function runPythonScript(kod) {
    return new Promise(async (resolve, reject) => {
        let tempPythonFile = './temp_script.py';

        let stderrMessages = [];
        fs.writeFileSync(tempPythonFile, kod);


        const pythonFileContent = fs.readFileSync(tempPythonFile, 'utf8');
        const imports = pythonFileContent.match(/^import\s+(\S+)/gm) || [];
        const uniqueImports = [...new Set(imports.map((imp) => imp.split(' ')[1]))];

        const librariesToInstall = uniqueImports.filter((lib) => !isBuiltInLibrary(lib));

        const filteredLibrariesToInstall = librariesToInstall.filter((lib) => lib !== 'unittest');

        if (filteredLibrariesToInstall.length > 0) {
            try {
                const installCommand = `pip3 install ${filteredLibrariesToInstall.join(' ')}`;
                const installResult = await runShellCommand(installCommand);
                console.log('Installed libraries:', installResult);
            } catch (err) {
                console.error('Error installing external libraries:', err);
                reject(err);
                return;
            }
        }

        let shell = new PythonShell(tempPythonFile);
        shell.on('message', function (message) {
            // Handle messages if needed
            //but will be empty, otherwise stated BOŞ
            console.log("ERROR HERE!");
            
        });
        shell.on('stderr', function (stderr) {
            stderrMessages.push(stderr);
        });
        shell.on('error', function(error){
            console.log("ERROR HERE!");
            console.log(`${stderr}`)
            stderrMessages.push(error)
        })
        shell.end(function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(stderrMessages.join('\n'));
            }
        });
    });
}


async function runCode(req, res) {

    try {
        const { testFunction } = req.body

        //aralık2 run python code and take results
        let stderr = await runPythonScript(testFunction);
        console.log(stderr);
        //aralık2

        //aralık3 response part
        const responseObject = {
            code: "200",
            executionResult: stderr
        }

        res.json(responseObject)
        //aralık3

    } catch (error) {
        console.log("ERROR MESSAGE:", error.message);
        const catchErrorResponse = {
            code : "500",
            executionResult: error.message,
        }

        res.json(catchErrorResponse)
    }
}

module.exports = {runCode}
