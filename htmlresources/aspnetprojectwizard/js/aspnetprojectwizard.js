var wizard = {
    _vscode : null,
    _data : {},

    initialize : function() {
        //initialize properties
        this._vscode = acquireVsCodeApi();
       
        // Handle messages sent from the extension to the webview
        var me = this;
        window.addEventListener('message', event => {
            me.onMessage(event.data);
        });

        this.sendMessage({
            command: 'documentLoaded'
        });
        
    },

    onMessage : function(message) {     
        switch (message.command) {
            case 'setData':
                $("#title").html(this.title);
                this.setData(message.data);
                break;
        }
    },

    sendMessage : function(data) {
        this._vscode.postMessage(data);
    },

    setData : function(data) {
        this._data = data;

        //update auth methods
        wizardHelper.setElementOptionsWithCaptions("#auth", this._data.authValues);

        //initialize fields
        $("#auth").val(this._data.auth);
        $("#aadb2cinstance").val(this._data.aadb2cinstance);
        $("#susipolicyid").val(this._data.susipolicyid);
        $("#resetpasswordpolicyid").val(this._data.resetpasswordpolicyid);
        $("#editprofilepolicyid").val(this._data.editprofilepolicyid);
        $("#aadinstance").val(this._data.aadinstance);
        $("#clientid").val(this._data.clientid);
        $("#domain").val(this._data.domain);
        $("#tenantid").val(this._data.tenantid);
        $("#callbackpath").val(this._data.callbackpath);
        $("#orgreadaccess").val(this._data.orgreadaccess);
        $("#uselocaldb").val(this._data.uselocaldb);      
        $("#nohttps").val(this._data.nohttps);
        
        this.updateControls();
    },

    onFinish : function() {
        this.collectData();
        this.sendMessage({
            command: "finishClick",
            data: {
                auth : this._data.auth,
                aadb2cinstance : this._data.aadb2cinstance,
                susipolicyid : this._data.susipolicyid,
                resetpasswordpolicyid : this._data.resetpasswordpolicyid,
                editprofilepolicyid : this._data.editprofilepolicyid,
                aadinstance : this._data.aadinstance,
                clientid : this._data.clientid,
                domain : this._data.domain,
                tenantid : this._data.tenantid,
                callbackpath : this._data.callbackpath,
                orgreadaccess : this._data.orgreadaccess,
                uselocaldb : this._data.uselocaldb,
                nohttps : this._data.nohttps
            }
        });
    },

    onCancel : function() {
        this.sendMessage({
            command : "cancelClick"
        })
    },

    collectData : function() {
        this._data.auth = $("#auth").val();
        this._data.aadb2cinstance = $("#aadb2cinstance").val();
        this._data.susipolicyid = $("#susipolicyid").val();
        this._data.resetpasswordpolicyid = $("#resetpasswordpolicyid").val();
        this._data.editprofilepolicyid = $("#editprofilepolicyid").val();
        this._data.aadinstance = $("#aadinstance").val();
        this._data.clientid = $("#clientid").val();
        this._data.domain = $("#domain").val();
        this._data.tenantid = $("#tenantid").val();
        this._data.callbackpath = $("#callbackpath").val();
        this._data.orgreadaccess = $("#orgreadaccess").prop("checked");
        this._data.uselocaldb = $("#uselocaldb").prop("checked");
        this._data.nohttps = $("#nohttps").prop("checked");
    },

    onAuthTypeChanged : function() {
        this._data.auth = $("#auth").val();
        this.updateControls();
    },

    updateControls : function() {
        this.setFieldVisibility("#lnaadb2cinstance", (this._data.auth == "IndividualB2C"));
        this.setFieldVisibility("#lnsusipolicyid", (this._data.auth == "IndividualB2C"));
        this.setFieldVisibility("#lnresetpasswordpolicyid", (this._data.auth == "IndividualB2C"));
        this.setFieldVisibility("#lneditprofilepolicyid", (this._data.auth == "IndividualB2C"));
        this.setFieldVisibility("#lnaadinstance", ((this._data.auth == "SingleOrg") || (this._data.auth == "MultiOrg")));
        this.setFieldVisibility("#lnclientid", ((this._data.auth == "IndividualB2C") || (this._data.auth == "SingleOrg") || (this._data.auth == "MultiOrg")));
        this.setFieldVisibility("#lndomain", ((this._data.auth == "IndividualB2C") || (this._data.auth == "SingleOrg")));
        this.setFieldVisibility("#lntenantid", (this._data.auth == "SingleOrg"));
        this.setFieldVisibility("#lncallbackpath", ((this._data.auth == "IndividualB2C") || (this._data.auth == "SingleOrg")));
        this.setFieldVisibility("#lnorgreadaccess", ((this._data.auth == "SingleOrg") || (this._data.auth == "MultiOrg")));
        this.setFieldVisibility("#lnuselocaldb", ((this._data.auth == "Individual") || (this._data.auth == "IndividualB2C")));
        this.setFieldVisibility("#lnnohttps", 
            ((this._data.auth == "Individual") || 
            (this._data.auth == "IndividualB2C") ||
            (this._data.auth == "SingleOrg") ||
            (this._data.auth == "MultiOrg")));
    },

    setFieldVisibility(name, visible) {
        if (visible)
            $(name).show();
        else
            $(name).hide();
    }

}

$(function() {
    wizard.initialize();
});
