'use strict';

import * as vscode from 'vscode';
import * as vzFileTemplates from 'vz-file-templates';
import { MyHtmlWizardPage } from './myHtmlWizardPage';

export class MyHtmlWizard implements vzFileTemplates.IProjectItemWizard {
    protected _name : string;
    protected _context : vscode.ExtensionContext;    

    constructor(context : vscode.ExtensionContext) {
        this._name = "vz.MyHtmlWizardDemo";
        this._context = context;
    }

    getName() : string {
        return this._name;
    }

    run(template : vzFileTemplates.IProjectItemTemplate, settings : vzFileTemplates.IProjectItemTemplateRunSettings) {
        let wizardPage = new MyHtmlWizardPage(this._context, template, settings);
        wizardPage.show();
    }

}