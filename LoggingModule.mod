MODULE LoggingModule
    !*****************************************************
    !Module Name: LoggingModule
    !Version:     1.0
    !Description: This module imitates the functions and interfaces of Python logging module
    !Date:        2019-1-20
    !Author:      Michael
    !*****************************************************

    !*****************************************************
    !This module supports five levels: DEBUG(10), INFO(20), WARNING(30), ERRORING(40), CRITICAL(50)
    !When a logging method is called on a logger, the logger compares its own level with
    !the level associated with the method call. If the logger's level is higher than the method call's, no logging
    !message is actually generated. This is the basic mechanism controlling the verbosity of logging output.
    !The default logging level is WARNING
    !*****************************************************

    !The default logging level is WARNING which numeric value is equal to 30
    !We recommand that set the FileHandlerLevel to 10, so that all the log messages will be writen to a log file
    LOCAL VAR num FileHandlerLevel:=30;
    LOCAL VAR num TPHandlerLevel:=30;

    !Logging files are stored in "Home:/Logging"
    !The format of file name is "year-month-day_TaskName.log"
    LOCAL PERS string strFileHandlerFileName:="Logging/2019-01-20_T_ROB1.log";
    LOCAL CONST string strFileHandlerDirectory:="Logging";
    LOCAL VAR iodev iodevFileHandlerFile;

    !A handler Procedure which writes formatted logging records to disk files.
    !The maximum length of strMsg is 80.
    !The FileHandler will open a logging file automatically, and keep the opened status until you close it.
    !Normally, we don't need to close logging file.
    !At Program Stop and moved PP to Main, any open file or serial channel in the program task will be closed
    !and the I/O descriptor in the variable of type iodev will be reset.
    !An exception to the rule is variables that are installed shared in the system of type global VAR or LOCAL VAR.
    !Such file or serial channel belonging to the whole system will still be open.
    LOCAL PROC FileHandler(num numHandlerLevel,string strMsg\string LoggerName\switch CloseFile)
        VAR string strFileHandlerLevel:="WARNING";
        VAR string strLoggerName:="root";
        IF numHandlerLevel>=FileHandlerLevel THEN
            TEST numHandlerLevel
            CASE 10:
                strFileHandlerLevel:="DEBUG";
            CASE 20:
                strFileHandlerLevel:="INFO";
            CASE 40:
                strFileHandlerLevel:="ERRORING";
            CASE 50:
                strFileHandlerLevel:="CRITICAL";
            DEFAULT:
                strFileHandlerLevel:="WARNING";
            ENDTEST
            !The standard date and time stamp format is "year-month-day hours:minutes:seconds", for example, "2016-06-14 22:00:00".
            !The length of date and time stamp string is 19.        
            IF Present(LoggerName) THEN
                strLoggerName:=LoggerName;
            ENDIF
            Write iodevFileHandlerFile,CDate()+" "+CTime()+":"+strFileHandlerLevel+":"+strLoggerName+":"\NoNewLine;
            Write iodevFileHandlerFile,strMsg;
            IF Present(CloseFile) THEN
                Close iodevFileHandlerFile;
            ENDIF
        ENDIF
    ERROR
        IF ERRNO=ERR_FILEACC THEN
            IF CreateDir("HOME:",strFileHandlerDirectory) THEN
                TPWrite "CreateDir 'HOME:\\"+strFileHandlerDirectory+"'";
            ENDIF
            strFileHandlerFileName:=strFileHandlerDirectory+"/"+CDate()+"_"+GetTaskName()+".log";
            Close iodevFileHandlerFile;
            Open "HOME:"\File:=strFileHandlerFileName,iodevFileHandlerFile\Append;
            TPWrite "Logging file '"+strFileHandlerFileName+"' is opened";
            RETRY;
        ENDIF
    ENDPROC

    !Set the logging level of file handler.
    PROC SetFileHandlerLogLevel(\switch DEBUG|switch INFO|switch WARNING|switch ERRORING|switch CRITICAL)
        IF Present(DEBUG) THEN
            FileHandlerLevel:=10;
        ELSEIF Present(INFO) THEN
            FileHandlerLevel:=20;
        ELSEIF Present(ERRORING) THEN
            FileHandlerLevel:=40;
        ELSEIF Present(CRITICAL) THEN
            FileHandlerLevel:=50;
        ELSE
            FileHandlerLevel:=30;
        ENDIF
    ENDPROC

    !A handler Procedure which writes formatted logging records to disk files.
    !The maximum length of strMsg is 77.
    !If the length of strMsg is greater than 77, it will be truncated to 77 characters.
    LOCAL PROC TPHandler(num numHandlerLevel,string strMsg\string LoggerName)
        VAR string strTPMsg;
        IF numHandlerLevel>=TPHandlerLevel THEN
            IF StrLen(strMsg)<=77 THEN
                strTPMsg:=ValToStr(TPHandlerLevel)+":"+strMsg;
            ELSE
                strTPMsg:=ValToStr(TPHandlerLevel)+":"+StrPart(strMsg,1,77);
            ENDIF
            TPWrite strTPMsg;
        ENDIF
    ENDPROC

    !Set the logging level of teach flexpendant handler.
    PROC SetTPHandlerLogLevel(\switch DEBUG|switch INFO|switch WARNING|switch ERRORING|switch CRITICAL)
        IF Present(DEBUG) THEN
            TPHandlerLevel:=10;
        ELSEIF Present(INFO) THEN
            TPHandlerLevel:=20;
        ELSEIF Present(ERRORING) THEN
            TPHandlerLevel:=40;
        ELSEIF Present(CRITICAL) THEN
            TPHandlerLevel:=50;
        ELSE
            TPHandlerLevel:=30;
        ENDIF
    ENDPROC

    !Log a message with the integer severity 'level' on the root logger.
    !This procedure will call log handler such as TPHandle and FileHandler.
    !You can add new log handler to this procedure, for example EmailHandler, etc.
    !LoggerName is used for classifying the log messages.
    !For example, user can set the LoggerName to module name or feature purpose.
    PROC Logging(\switch DEBUG|switch INFO|switch WARNING|switch ERRORING|switch CRITICAL,string strMsg\string LoggerName\switch CloseFile)
        VAR num numHandlerLevel:=30;
        IF Present(DEBUG) THEN
            numHandlerLevel:=10;
        ELSEIF Present(INFO) THEN
            numHandlerLevel:=20;
        ELSEIF Present(ERRORING) THEN
            numHandlerLevel:=40;
        ELSEIF Present(CRITICAL) THEN
            numHandlerLevel:=50;
        ELSE
            numHandlerLevel:=30;
        ENDIF
        TPHandler numHandlerLevel,strMsg\LoggerName?LoggerName;
        FileHandler numHandlerLevel,strMsg\LoggerName?LoggerName\CloseFile?CloseFile;
    ENDPROC

    !The user must make sure the parentDirectory is existed
    FUNC bool CreateDir(string parentDirectory,string dirName)
        VAR dir directory;
        VAR string filename;
        OpenDir directory,parentDirectory;
        WHILE ReadDir(directory,filename) DO
            IF StrMap(dirName,STR_LOWER,STR_UPPER)=StrMap(filename,STR_LOWER,STR_UPPER) THEN
                IF IsFile(parentDirectory+"\\"+dirName\Directory) THEN
                    CloseDir directory;
                    RETURN FALSE;
                ELSE
                    TPWrite "There is a file named '"+dirName+"' in directory '"+parentDirectory+"'";
                    TPWrite "Try to delete it...";
                    RemoveFile parentDirectory+"\\"+dirName;
                    TPWrite "File '"+dirName+"' is deleted";
                ENDIF
            ENDIF
        ENDWHILE
        CloseDir directory;
        MakeDir parentDirectory+"/"+dirName;
        RETURN TRUE;

    ERROR
        IF ERRNO=ERR_FILEACC THEN
            TPWrite "The "+parentDirectory+" points to a non-existing directory or the directory cannot be created.";
            RAISE ERR_FILEACC;
        ENDIF

    ENDFUNC

    !User can use this for testing
    !%"LoggingModule:LoggingTest"%;
    LOCAL PROC LoggingTest()
        SetTPHandlerLogLevel\WARNING;
        SetFileHandlerLogLevel\DEBUG;
        Logging\DEBUG,"This is a DEBUG logging message."\LoggerName:="LoggingModule";
        Logging\INFO,"This is a INFO logging message."\LoggerName:="LoggingTest";
        Logging\WARNING,"This is a WARNING logging message.";
        Logging\ERRORING,"This is a ERRORING logging message.";
        Logging\CRITICAL,"This is a CRITICAL logging message.";
        Logging\CRITICAL,"This is a CRITICAL logging message.This is a CRITICAL logging message.This is 80"\CloseFile;
    ENDPROC

ENDMODULE