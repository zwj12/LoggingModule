import React, { Component } from 'react';
import './Logging.css';
import LoggingMessage from './LoggingMessage';

class ReactLoggingMessage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            // <li key={this.props.index}>
            //     {this.props.loggingMessage.toString()}
            // </li>
            <tr>
                <td>{this.props.index}</td>
                <td>{this.props.loggingMessage.robName}</td>
                <td>{this.props.loggingMessage.createTime.toLocaleString()}</td>
                <td>{this.props.loggingMessage.level}</td>
                <td>{this.props.loggingMessage.loggingName}</td>
                <td>{this.props.loggingMessage.message}</td>
            </tr>
        );
    }
}

class ReactLoggingMessageList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const listItems = this.props.loggingMessageList.map((loggingMessage, index) =>
            <ReactLoggingMessage loggingMessage={loggingMessage} index={index} />
        );

        return (
            <table>
                <caption>日志：</caption>
                <tr>
                    <th>序号</th>
                    <th>机器人</th>
                    <th className="logging-date">时间</th>
                    <th>级别</th>
                    <th>类别</th>
                    <th className="logging-message">内容</th>
                </tr>
                {listItems}
            </table>
        );
    }
}

export { ReactLoggingMessage }
export default ReactLoggingMessageList;