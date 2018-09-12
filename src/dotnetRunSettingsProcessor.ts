'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as vzFileTemplates from 'vz-file-templates';
import { StringHelper } from './helpers/stringHelper';
import { ExtConst } from './extConst';

export class DotnetRunSettingsProcessor implements vzFileTemplates.ITemplateRunSettingsProcessor {
    private _workspacePath : string;    

    constructor() {
        this._workspacePath = "";
    }

    getName(): string {
        return "vzFileTemplates.dotNet";
    }

    processSettings(settings: vzFileTemplates.IProjectItemTemplateRunSettings): void {
        this.updateWorkspacePath();
        settings.setVariable(ExtConst.rootNameSpaceVariable, this.namespaceFromPath(settings.destPath));
    }

    protected namespaceFromPath(destPath : string) : string {
        if (this._workspacePath == "")
            return "";

        //make path relative to the workspace root path
        if (path.isAbsolute(destPath))
            destPath = path.relative(this._workspacePath, destPath);

        //find root namespace
        let nsName = this.detectRootNamespace();

        //parse relative path and add it to the namespace
        if (destPath != "") {
            destPath = destPath
                .replace(new RegExp("\\/", "g"), ".")
                .replace(new RegExp("\\\\", "g"), ".");
            let nodes : string[] = destPath.split(".");

            for (let i=0; i<nodes.length;i++) {
                let nsPartName : string = StringHelper.toSafeName(nodes[i]);            
                if (nsPartName != "") {
                    if (nsName != "")
                        nsName = nsName + ".";
                    nsName = nsName + nsPartName;
                }
            }
        }

        return nsName;
    }

    protected detectRootNamespace() : string {
        if (this._workspacePath == "")
            return "";

        //find project file
        let projectFile : string = this.getProjectFileName(this._workspacePath);
        if (projectFile == "")
            return StringHelper.toSafeName(path.parse(this._workspacePath).name);

        let rootNameSpace : string = StringHelper.toSafeName(path.parse(projectFile).name);        
        
        //try find default namespace in the project file
        

        return rootNameSpace;
    }

    protected getProjectFileName(path : string) : string {
        let fs = require('fs');
        let files : string[] = fs.readdirSync(path);
        if (files) {
            for (let i=0; i<files.length; i++) {
                if (files[i].toLowerCase().endsWith(".csproj"))
                    return files[i];
            }
        }
        return "";
    }

    //find workspace root folder
    protected updateWorkspacePath() {
        if ((!vscode.workspace.workspaceFolders) || (vscode.workspace.workspaceFolders.length == 0))
            this._workspacePath = "";
        else
            this._workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    }

} 