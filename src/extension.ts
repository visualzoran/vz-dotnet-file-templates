'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as vzFileTemplates from 'vz-file-templates';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let filetemplatesExt = vscode.extensions.getExtension('visualzoran.vz-file-templates');    
    if (filetemplatesExt) {
        if (!filetemplatesExt.isActive) {
            filetemplatesExt.activate().then((val) => {
                let extApi : vzFileTemplates.IVZFileTemplatesApi = val;                
                
                //register wizards
                //extApi.registerWizard(new MyHtmlWizard(context));
                //register templates folders
                extApi.registerTemplatesFolder(context.asAbsolutePath('templates'));
            });
        } else {
            let api : vzFileTemplates.IVZFileTemplatesApi = filetemplatesExt.exports; 
            
            //!!! Warning !!!
            //!!! This code is copied from a few lines above !!!
            //!!! It is a bad idea, please mobve it to a functions in real projects !!!
            //register wizards
            //api.registerWizard(new MyHtmlWizard(context));
            //register templates folders
            api.registerTemplatesFolder(context.asAbsolutePath('templates'));
        }
    }

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vs-dotnet-file-templates" is now active!');
}

// this method is called when your extension is deactivated
export function deactivate() {
}