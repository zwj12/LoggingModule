/**
 *
 * @Version
 *
 * @Author Michael
 *
 * @Date 1/25/2019
 *
 * @Description for ABB robot
 *
 */

class LoggingMessage{
    constructor(robName, createTime, level, loggingName, message){
        this.robName = robName || "T_ROB1";
        this.createTime = createTime || new Date();
        this.level = level || 30;		
        this.loggingName = loggingName || "root";	
        this.message = message || "";
    }

    //parse format: 2019-01-21 12:33:39:WARNING:root:EBARAInitialize of T_POS1
    //levels: DEBUG(10), INFO(20), WARNING(30), ERRORING(40), CRITICAL(50)
    parse (strLogging) {
        var numStartIndex=0;		
        var numStopIndex=0;	

        if(strLogging.length<20){
            return false;
        }
        
        this.createTime = new Date(strLogging.substring(0,19));
            
        numStartIndex=20;	
        numStopIndex=strLogging.indexOf(":",numStartIndex);		
        var strlevel=strLogging.substring(numStartIndex,numStopIndex);
        switch(strlevel)
        {
            case "DEBUG":
                this.level = 10;
                break;
            case "INFO":
                this.level = 20;
                break;
            case "ERRORING":
                this.level = 40;
                break;
            case "CRITICAL":
                this.level = 50;
                break;
            default:
                this.level = 30;
        }
        
        numStartIndex=numStopIndex+1;	
        numStopIndex=strLogging.indexOf(":",numStartIndex);		
        this.loggingName=strLogging.substring(numStartIndex,numStopIndex);
                
        numStartIndex=numStopIndex+1;	
        this.message=strLogging.substring(numStartIndex);
        return true;
    }

    //string format: 2019-01-21 12:33:39:WARNING:root:EBARAInitialize of T_POS1
    toString () {	
        var strYear = this.createTime.getFullYear();
        var strMonth = this.createTime.getMonth() + 1;
        var strDate = this.createTime.getDate();
        var strHour = this.createTime.getHours();
        var strMinute = this.createTime.getMinutes();
        var strSecond = this.createTime.getSeconds();
        if (strMonth <= 9) {
            strMonth = "0" + strMonth;
        }
        if (strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (strHour <= 9) {
            strHour = "0" + strHour;
        }
        if (strMinute <= 9) {
            strMinute = "0" + strMinute;
        }
        if (strSecond <= 9) {
            strSecond = "0" + strSecond;
        }
        var strLogging=strYear + "-" + strMonth + "-" + strDate + " " + strHour + ":" + strMinute + ":" + strSecond;
        var strlevel="WARNING";
        switch(this.level)
        {
            case 10:
                strlevel = "DEBUG";
                break;
            case 20:
                strlevel = "INFO";
                break;
            case 40:
                strlevel = "ERRORING";
                break;
            case 50:
                strlevel = "CRITICAL";
                break;
            default:
                strlevel = "WARNING";
        }
        strLogging = strLogging + ":" + strlevel + ":" + this.loggingName + ":" + this.message;
        return strLogging;	        
    }
 
}

export default LoggingMessage;
