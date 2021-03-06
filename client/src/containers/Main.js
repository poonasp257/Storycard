import React, { Component } from 'react';
import styled from 'styled-components';
import { Toolkit, Board, Icon, ArrowButton } from 'components';

import { connect } from 'react-redux';
import { openAlert } from 'modules/popup';
import { getStatusRequest, logoutRequest } from 'modules/authentication';
import { getItemsRequest, updateItems } from 'modules/item';

import io from 'socket.io-client';

const Container = styled.div`
    margin: 45px auto;
`;

const Header = styled.div`
    position: fixed;
    margin-left: 220px;
    z-index: 1;
`;

const Button = styled.div`  
    display: inline-block;   
    margin: 3px; 
    padding: 3px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    color: #fefae7;
    background-color: #e83c18;
    :hover {
        color: #e83c18;
        background-color: #fefae7;
    }
`;

const Name = styled.span`    
    margin-left: 5px;
    margin-right: 10px;   
    vertical-align: top;
    font-size: 18px;
    font-family: 'Space Mono', monospace;
`;

class Main extends Component {
    constructor(props) {
        super(props);

        this.socket = io.connect('http://localhost:9090');
    }

    handleLogin = () => {
        function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length === 2) return parts.pop().split(";").shift();
        }

        return new Promise((resolve, reject) => {
            let loginData = getCookie('key');
            if (typeof loginData === "undefined") {
                window.location.href = "/signin";
                reject(false);
            }

            loginData = JSON.parse(atob(loginData));
            if (!loginData.isLoggedIn) {
                window.location.href = "/signin";
                reject(false);
            }

            this.props.getStatusRequest().then(
                (error) => {
                    if (!this.props.status.auth.get('valid')) {
                        loginData = {
                            isLoggedIn: false,
                            username: ''
                        };
                        document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                        this.props.openAlert({ 
                            title: "Storycard", 
                            message: error,
                            closeEvent: () => window.location.href = "/signin"
                        });
                        reject(false);
                    }

                    resolve(true);
                }
            );
        });
    }

    handleLogout = () => {
        this.props.logoutRequest().then(
            () => {
                document.cookie = '';
                window.location.href = "/signin";
            }
        );
    }
    
    componentDidMount() {
        this.handleLogin().then(
            (success) => {
                if (!success) return;

                this.props.getItemsRequest();
                this.props.updateItems(this.socket);
            }
        );
    }

    componentWillUnmount() {
        this.socket.removeAllListeners();
    }

    render() {
        return (
            <Container>
                <Header>
                    <ArrowButton to="/" size="24px"/>
                    <Button onClick={this.handleLogout}>
                        <Icon type="person" size="24px"/>
                        <Name>Logout</Name>
                    </Button>
                </Header>
                <Toolkit/>
                <Board/>
            </Container>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        status: {
            auth: state.authentication.get('status'),
            items: state.item.getIn(['info', 'status'])
        }
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
        logoutRequest: () => {
            return dispatch(logoutRequest());
        },
        getItemsRequest: () => {
            return dispatch(getItemsRequest());
        },
        updateItems: (socket) => dispatch(updateItems(socket)),
        openAlert: (option) => dispatch(openAlert(option))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);