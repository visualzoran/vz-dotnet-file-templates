'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as vzFileTemplates from 'vz-file-templates';
import { ProjectItemWizardPage } from "./projectItemWizardPage";
import { MyHtmlWizardData } from './myHtmlWizardData';

export class MyHtmlWizardPage extends ProjectItemWizardPage {
    protected _data : MyHtmlWizardData;

    constructor(context : vscode.ExtensionContext, template : vzFileTemplates.IProjectItemTemplate, settings : vzFileTemplates.IProjectItemTemplateRunSettings) {
        super(context, "My Html Wizard", template, settings);
        this._data = new MyHtmlWizardData();
    }

    protected getHtmlContentPath() : string {
        return path.join('htmlresources', 'myhtmlwizard', 'myhtmlwizard.html');
    }

    protected getViewType() : string {
        return "vz.MyHtmlWizardDemoPage";
    }

    //initialize wizard
    protected onDocumentLoaded() {
        //send data to the web view
        this.sendMessage({
            command : 'setData',
            data : this._data
        });
    }

    protected finishWizard(data : any) : boolean {
        //build parameters
        this._data.title = data.title;
        this._data.columnCaptions = data.columnCaptions;
        this._data.noOfRows = data.noOfRows;

        //build html document
        let htmlText = 
            '  <div class="title">' + this._data.title + "</div>\n" +
            '  <table>\n';
        
        let columns : string[] = this._data.columnCaptions.split(',');
        let columnText = "";
        let tableRow = "";
        for (let i=0; i<columns.length;i++) {
            columnText = columnText + '      <td>' + columns[i] + '</td>\n';
            tableRow = tableRow + "<td></td>";
        }
        htmlText = htmlText + '    <tr>\n' + columnText + '    </tr>\n';

        for (let j=0; j<this._data.noOfRows; j++) {
            htmlText = htmlText +
                '    <tr class="row' + j.toString() + '">' + tableRow + '</tr>\n';
        }

        htmlText = htmlText + '  </table>\n';
        htmlText = '<html>\n<body>\n' + htmlText + '</body>\n</html>\n';

        this._templateRunSettings.setTextReplacement("$htmlcontent$", htmlText);
        
        //build css content
        let cssText = "";

        for (let j=0; j<this._data.noOfRows; j++) {
            let color = 5 + (j % 5);
            let colorText = color.toString() + '0';
            colorText = '#' + colorText + colorText + colorText;

            cssText = cssText +
                '.row' + j.toString() + ' {\n' +
                '  background: ' + colorText + ';\n' +
                '}\n';
        }

        this._templateRunSettings.setTextReplacement("$csscontent$", cssText);

        //run template
        this._template.run(this._templateRunSettings);

        return true;
    }


}