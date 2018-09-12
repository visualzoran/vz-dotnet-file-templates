import { AspNetCoreWizardAuthData } from "./aspNetCoreWizardAuthData";

'use strict';

export class AspNetCoreWizardData {
    authValues : AspNetCoreWizardAuthData[];
    auth : string;
    aadb2cinstance : string;
    susipolicyid : string;
    resetpasswordpolicyid : string;
    editprofilepolicyid : string;
    aadinstance : string;
    clientid : string;
    domain : string;
    tenantid : string;
    callbackpath : string;
    orgreadaccess : boolean;
    nohttps : boolean;
    uselocaldb : boolean;

    constructor() {
        this.authValues = [];
        this.auth = "None";
        this.aadb2cinstance = "";
        this.susipolicyid = "";
        this.resetpasswordpolicyid = "";
        this.editprofilepolicyid = "";
        this.aadinstance = "";
        this.clientid = "";
        this.domain = "";
        this.tenantid = "";
        this.callbackpath = "";
        this.orgreadaccess = false;
        this.nohttps = false;
        this.uselocaldb = false;
    }

    setFields(source : any) {
        this.auth = source.auth;
        this.aadb2cinstance = source.aadb2cinstance; 
        this.susipolicyid = source.susipolicyid;
        this.resetpasswordpolicyid = source.resetpasswordpolicyid;
        this.editprofilepolicyid = source.editprofilepolicyid;
        this.aadinstance = source.aadinstance;
        this.clientid = source.clientid;
        this.domain = source.domain;
        this.tenantid = source.tenantid;
        this.callbackpath = source.callbackpath;
        this.orgreadaccess = source.orgreadaccess;
        this.nohttps = source.nohttps;
        this.uselocaldb = source.uselocaldb;
    }

} 