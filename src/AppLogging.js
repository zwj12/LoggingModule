import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Logging from './logging';

class ReactLoggingMessage extends React.Component {
    render() {
        return (
            <div className="logging-message">
                {this.props.loggingMessage.toString()}
            </div>
        );
    }
}

class ReactLoggingMessages extends React.Component {
    renderLoggingMessage(loggingMessages) {
        return <ReactLoggingMessage loggingMessage={loggingMessages[0]} />;
    }

    render() {
        return (
            <div>
                <div>
                    {this.renderLoggingMessage(this.props.loggingMessages)}
                </div>
            </div>
        );
    }
}

class AppLogging extends Component {
    renderSquare(i) {
        return <reactTestByMichael value={i} />;
    }

    render() {
        var logging = new Logging();
        logging.getDataFromWebService("T_ROB1", new Date());
        for (var i = 0; i < logging.loggingMessages.length; i++) {
            console.log(i + ":" + logging.loggingMessages[i].toString());
        }
        const moves = logging.loggingMessages.map((step, move) => {
            return (
              <li>
                {step.toString()}
              </li>
            );
          });
        return (
            <div className="logging-messages">
                <ReactLoggingMessages loggingMessages={logging.loggingMessages} />;
                <ol>{moves}</ol>
            </div>
        );
    }
}

export default AppLogging;
