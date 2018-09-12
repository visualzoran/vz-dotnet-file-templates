'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as vzFileTemplates from 'vz-file-templates';
import { ProjectItemWizardPage } from "./projectItemWizardPage";
import { AspNetCoreWizardData } from './aspNetCoreWizardData';
import { AspNetCoreWizardAuthData } from './aspNetCoreWizardAuthData';

export class AspNetCoreWizardPage extends ProjectItemWizardPage {
    protected _data : AspNetCoreWizardData;
    protected _websiteType : string;

    constructor(context : vscode.ExtensionContext, template : vzFileTemplates.IProjectItemTemplate, settings : vzFileTemplates.IProjectItemTemplateRunSettings) {
        super(context, "ASP.Net Core Website Wizard", template, settings);
        this._data = new AspNetCoreWizardData();
        this._websiteType = "";
        if ((settings.command == "dotnet") && (settings.commandParameters) && (settings.commandParameters.length >= 2) && (settings.commandParameters[0] == "new"))
            this._websiteType = settings.commandParameters[1];
        this.prepareAuthMethods();
    }

    protected getHtmlContentPath() : string {
        return path.join('htmlresources', 'aspnetprojectwizard', 'aspnetprojectwizard.html');
    }

    protected getViewType() : string {
        return "vz-dotnet-templates.AspNetCoreWebsitePage";
    }

    protected onDocumentLoaded() {
        this.sendMessage({
            command : 'setData',
            data : this._data
        });
    }

    protected finishWizard(data : any) : boolean {
        //copy data to local property
        this._data.setFields(data);

        //process message
        this.appendParameter("--auth", this._data.auth, "None", true);
        this.appendParameter("--aad-b2c-instance", this._data.aadb2cinstance, "", (this._data.auth == "IndividualB2C"));
        this.appendParameter("--susi-policy-id", this._data.susipolicyid, "", (this._data.auth == "IndividualB2C"));
        this.appendParameter("--reset-password-policy-id", this._data.resetpasswordpolicyid, "", (this._data.auth == "IndividualB2C"));
        this.appendParameter("--edit-profile-policy-id", this._data.editprofilepolicyid, "", (this._data.auth == "IndividualB2C"));
        this.appendParameter("--aad-instance", this._data.aadinstance, "", ((this._data.auth == "SingleOrg") || (this._data.auth == "MultiOrg")));
        this.appendParameter("--client-id", this._data.clientid, "", ((this._data.auth == "IndividualB2C") || (this._data.auth == "SingleOrg") || (this._data.auth == "MultiOrg")));
        this.appendParameter("--domain", this._data.domain, "", ((this._data.auth == "IndividualB2C") || (this._data.auth == "SingleOrg")));
        this.appendParameter("--tenant-id", this._data.tenantid, "", (this._data.auth == "SingleOrg"));
        this.appendParameter("--callback-path", this._data.callbackpath, "", ((this._data.auth == "IndividualB2C") || (this._data.auth == "SingleOrg")));
        this.appendBoolParameter("--org-read-access", this._data.orgreadaccess, ((this._data.auth == "SingleOrg") || (this._data.auth == "MultiOrg")));
        this.appendBoolParameter("--use-local-db", this._data.uselocaldb, ((this._data.auth == "Individual") || (this._data.auth == "IndividualB2C")));
        this.appendBoolParameter("--no-https", this._data.nohttps, 
            ((this._data.auth == "Individual") || 
            (this._data.auth == "IndividualB2C") ||
            (this._data.auth == "SingleOrg") ||
            (this._data.auth == "MultiOrg")));

        this._template.run(this._templateRunSettings);

        return true;
    }

    protected appendParameter(name : string, value : string, defaultValue : string, append : boolean) {
        if ((value) && (value != "") && (value != defaultValue) && (append)) {
            this._templateRunSettings.commandParameters.push(name);
            this._templateRunSettings.commandParameters.push(value);
        }
    }

    protected appendBoolParameter(name : string, value : boolean, append : boolean) {
        if (value && append)
            this._templateRunSettings.commandParameters.push(name);
    }

    protected prepareAuthMethods() {
        this._data.authValues = [];
        this._data.authValues.push(new AspNetCoreWizardAuthData("None", "No authentication"));
        if ((this._websiteType == "mvc") || (this._websiteType == "razor"))
            this._data.authValues.push(new AspNetCoreWizardAuthData("Individual", "Individual authentication"));
        this._data.authValues.push(new AspNetCoreWizardAuthData("IndividualB2C", "Individual authentication with Azure AD B2C"));
        this._data.authValues.push(new AspNetCoreWizardAuthData("SingleOrg", "Organizational authentication for a single tenant"));
        if ((this._websiteType == "mvc") || (this._websiteType == "razor"))
            this._data.authValues.push(new AspNetCoreWizardAuthData("MultiOrg", "Organizational authentication for multiple tenants"));
        this._data.authValues.push(new AspNetCoreWizardAuthData("Windows", "Windows authentication"));
    }

} 