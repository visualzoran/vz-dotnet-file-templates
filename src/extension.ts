'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as vzFileTemplates from 'vz-file-templates';
import { DotnetRunSettingsProcessor } from './dotnetRunSettingsProcessor';
import { AspNetCoreWizard } from './wizards/aspNetCoreWizard';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let filetemplatesExt = vscode.extensions.getExtension('visualzoran.vz-file-templates');    
    if (filetemplatesExt) {
        if (!filetemplatesExt.isActive) {
            filetemplatesExt.activate().then((val) => {
                initializeFileTemplates(context, val);                
            });
        } else {
            initializeFileTemplates(context, filetemplatesExt.exports);            
        }
    }

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vz-dotnet-file-templates" is now active!');
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function initializeFileTemplates(context : vscode.ExtensionContext, api : vzFileTemplates.IVZFileTemplatesApi) {
    api.registerTemplatesFolder(context.asAbsolutePath('templates'));
    api.registerRunSettingsProcessor(new DotnetRunSettingsProcessor());
    api.registerWizard(new AspNetCoreWizard(context));
}