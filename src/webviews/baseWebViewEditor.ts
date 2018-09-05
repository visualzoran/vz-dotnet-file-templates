'use strict';

import * as vscode from 'vscode';

export class BaseWebViewEditor {
    protected _htmlContent : string;
    protected _extensionContext : vscode.ExtensionContext;
    protected _panel: vscode.WebviewPanel | undefined;
    protected _extensionPath : string;
    protected _documentLoaded : boolean;
    protected _title : string;

    private _disposables: vscode.Disposable[] = [];

    constructor(context : vscode.ExtensionContext, title : string) {
        //initialize variables
        this._documentLoaded = false;
        this._title = title;
        this._extensionContext = context;
        this._extensionPath = this._extensionContext.extensionPath;
        this._panel = undefined;
        //load html content
        this._htmlContent = this.loadHtmlContent();
    }

    public dispose() {
        // Clean up our resources
        if (this._panel)
            this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    public show() {
        this.createWebView();
    }

    protected getViewType() : string {
        return "BaseWebViewEditor";
    }

    protected getHtmlContentPath() : string {
        return "";
    }

    protected loadHtmlContent() : string {
        let fullExtensionPath = vscode.Uri.file(this._extensionPath).with({ scheme: 'vscode-resource' });
        let fs = require('fs');
        let filePath = this._extensionContext.asAbsolutePath(this.getHtmlContentPath());
        let content = fs.readFileSync(filePath, 'utf8');
        return content.replace(new RegExp('##EXTENSIONPATH##', 'g'), fullExtensionPath);
    }

    protected createWebView() {
        this._panel = vscode.window.createWebviewPanel(this.getViewType(), this._title, vscode.ViewColumn.Active, {
            // Enable javascript in the webview
            enableScripts: true//,

            // And restric the webview to only loading content from our extension's `media` directory.
            //localResourceRoots: [
            //    vscode.Uri.file(path.join(this._extensionPath, 'media'))
            //]
        });
        
        this.reloadWebViewContent();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            if ((this._panel) && (this._panel.visible)) {
                this.reloadWebViewContent();
            }
        }, null, this._disposables);

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(message => {
            this.processWebViewMessage(message);
        }, null, this._disposables);

    }

    protected reloadWebViewContent() {
        this._documentLoaded = false;
        if (this._panel)
            this._panel.webview.html = this._htmlContent;
    }

    protected sendMessage(message : any) {
        if (this._panel)
            this._panel.webview.postMessage(message);
    }

    protected processWebViewMessage(message : any) : boolean {
        if (message) {
            switch (message.command) {
                case 'documentLoaded':
                    this._documentLoaded = true;
                    this.onDocumentLoaded();
                    return true;
            }
        }
        
        return false;
    }

    protected onDocumentLoaded() {
    }

    public close() {
        if (this._panel)
            this._panel.dispose();
    }

}