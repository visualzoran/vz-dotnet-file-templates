'use strict';

import * as vscode from 'vscode';
import * as vzFileTemplates from 'vz-file-templates';
import { AspNetCoreWizardPage } from './aspNetCoreWizardPage';

export class AspNetCoreWizard implements vzFileTemplates.IProjectItemWizard  {
    protected _name : string;
    protected _context : vscode.ExtensionContext;    
    
    constructor(context : vscode.ExtensionContext) {
        this._name = "vz-dotnet-templates.AspNetCoreWebsiteWizard";
        this._context = context;
    }

    getName() : string {
        return this._name;
    }

    run(template : vzFileTemplates.IProjectItemTemplate, settings : vzFileTemplates.IProjectItemTemplateRunSettings) {
        let wizardPage = new AspNetCoreWizardPage(this._context, template, settings);
        wizardPage.show();
    }

} 