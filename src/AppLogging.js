import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './Logging.css';
import Logging from './logging';
import ReactLoggingMessageList from './ReactLoggingMessage';

class AppLogging extends Component {
    renderSquare(i) {
        return <reactTestByMichael value={i} />;
    }

    render() {
        var logging = new Logging();
        var logDate = new Date();
        logDate.setDate(28)
        logging.getDataFromWebService("T_ROB1", logDate);
        for (var i = 0; i < logging.loggingMessages.length; i++) {
            console.log(i + ":" + logging.loggingMessages[i].toString());
        }
        return (
            <div className="logging">
                <ReactLoggingMessageList loggingMessageList={logging.loggingMessages} />;
            </div>
        );
    }
}

export default AppLogging;
