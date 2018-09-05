var wizard = {
    _vscode : null,
    _data : null,
    _step : 1,

    initialize : function() {
        //initialize steps visibility
        this._step = 1;
        $("#wizardstep2").hide();

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
                this.setData(message.data);
                break;
        }
    },

    sendMessage : function(data) {
        this._vscode.postMessage(data);
    },

    setStep : function(newStep) {
        $("#wizardstep" + this._step.toString()).hide();        
        this._step = newStep;
        $("#wizardstep" + this._step.toString()).show();
        $("#prevBtn").prop("disabled", (this._step <= 1));
        $("#nextBtn").prop("disabled", (this._step == 2));
        $("#finishBtn").prop("disabled", (this._step < 2));
    },

    setData : function(data) {
        this._data = data;
        //initialize fields
        $("#fieldpagetitle").val(this._data.title);
        $("#fieldcolumns").val(this._data.columnCaptions);
        $("#fieldnoofrows").val(this._data.noOfRows);
        this.updateControls();
    },

    onFinish : function() {
        this.collectStepData();
        this.sendMessage({
            command: "finishClick",
            data: {
                title : this._data.title,
                columnCaptions : this._data.columnCaptions,
                noOfRows : this._data.noOfRows
            }
        });
    },

    onCancel : function() {
        this.sendMessage({
            command : "cancelClick"
        })
    },

    onPrev : function() {
        if (this._step > 1) {
            this.collectStepData();
            this.setStep(this._step - 1);
        }
    },

    onNext: function() {
        if (this._step < 2) {
            this.collectStepData();
            this.setStep(this._step + 1);
        }
    },

    collectStepData : function() {
        switch (this._step) {
            case 1: this.collectStep1Data();
            case 2: this.collectStep2Data();
        }
    },

    collectStep1Data : function() {
        this._data.title = $("#fieldpagetitle").val();
    },

    collectStep2Data : function() {
        this._data.columnCaptions = $("#fieldcolumns").val();
        this._data.noOfRows = $("#fieldnoofrows").val();
    }

}

$(function() {
    wizard.initialize();
});
