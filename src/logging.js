/**
 *
 * @Version
 *
 * @Author Michael
 *
 * @Date 1/21/2019
 *
 * @Description
 *
 */

import LoggingMessage from './LoggingMessage.js';

class Logging {
    constructor(robName, logDate) {
        this.robName = robName || "T_ROB1";
        this.logDate = logDate || new Date();
        this.loggingMessages = new Array(0);
    }

    getDataFromWebService(robName, logDate) {
        this.robName = robName;
        this.logDate = logDate;
        var strLogFileName = this.getLogFileName();
        var messages = this.loggingMessages;
        var rwServiceResource = new XMLHttpRequest();

        rwServiceResource.open("GET", strLogFileName, false);
        rwServiceResource.send();
        if (rwServiceResource.status == 200) {
            //console.log(rwServiceResource.responseText);
            var pattLogMessage = new RegExp("^.*$", "gm");
            var result = rwServiceResource.responseText.match(pattLogMessage);
            for (var i = 0; i < result.length; i++) {
                // console.log(result[i]);             
                var logMessage = new LoggingMessage();
                if (logMessage.parse(result[i])){
                    messages[messages.length] = logMessage;
                    // console.log(logMessage.message);
                    // console.log(messages.length + ":" + logMessage.toString());
                }               
            }
        } else {
            alert("Error " + rwServiceResource.status + ": " + rwServiceResource.statusText);
        }
    }

    getDataFromWebServiceAsyc(robName, logDate) {
        this.robName = robName;
        this.logDate = logDate;
        var strLogFileName = this.getLogFileName();
        var messages = this.loggingMessages;
        var rwServiceResource = new XMLHttpRequest();

        rwServiceResource.onreadystatechange = function () {
            if (rwServiceResource.readyState === 4) {
                if (rwServiceResource.status === 200) {
                    //console.log(rwServiceResource.responseText);
                    var pattLogMessage = new RegExp("^.*$", "gm");
                    var result = rwServiceResource.responseText.match(pattLogMessage);
                    for (var i = 0; i < result.length; i++) {
                        // console.log(result[i]);             
                        var logMessage = new LoggingMessage();
                        logMessage.parse(result[i])
                        messages[messages.length - 1] = logMessage;
                        // console.log(logMessage.message);
                    }
                } else {
                    alert("Error " + rwServiceResource.status + ": " + rwServiceResource.statusText);
                }
            }
        }

        rwServiceResource.open("GET", strLogFileName, true);
        rwServiceResource.send();
    }

    getLogFileName() {
        var strYear = this.logDate.getFullYear();
        var strMonth = this.logDate.getMonth() + 1;
        var strDate = this.logDate.getDate();
        if (strMonth <= 9) {
            strMonth = "0" + strMonth;
        }
        if (strDate <= 9) {
            strDate = "0" + strDate;
        }
        var strLogFileName = "/fileservice/$home/Logging/" + strYear + "-" + strMonth + "-" + strDate + "_" + this.robName + ".log"
        console.log(strLogFileName);
        return strLogFileName;
    }
}

export default Logging;
