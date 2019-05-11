import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startLoginLocal, login } from '../actions/auth';
export class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            reqUser: '',
            reqPwd: '',
            msgErr: '',
            isLoading: ''
        }
    }
    onHandleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onLoginClick();
        }
    }
    onUsernameChange = (e) => {
        const username = e.target.value;
        this.setState(() => ({
            username
        }));
    }
    onPasswordChange = (e) => {
        const password = e.target.value;
        this.setState(() => ({
            password
        }));
    }
    onLoginClick = (e) => {
        if (this.state.username == '') {
            this.inputUser.focus();
            this.setState(() => ({
                reqUser: 'is-danger',
                reqPwd: ''
            }))
        } else if (this.state.password == '') {
            this.inputPwd.focus();
            this.setState(() => ({
                reqUser: '',
                reqPwd: 'is-danger'
            }))
        } else {
            this.setState({ isLoading: 'is-loading' })
            this.props.startLoginLocal(this.state.username, this.state.password)
                .then((res) => {
                    if (res.code) {
                        this.setState(() => ({
                            reqUser: 'is-danger',
                            reqPwd: 'is-danger',
                            isLoading: ''
                        }));
                    } else {
                        this.props.login({ uid: res.uid, email: res.email })
                    }
                });
        }
    }
    render() {
        return (
            <div className="hero is-dark is-fullheight">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <div className="column is-6 is-offset-3">
                            <h3 className="title has-text-white">JAOYING OFFICE</h3>
                            <p className="subtitle has-text-white">สำหรับเจ้าหน้าที่</p>
                            <div className="box">
                                <div className="field">
                                    <div className="control">
                                        <input className={`input is-medium ${this.state.reqUser}`}
                                            type="text"
                                            placeholder="Username"
                                            autoFocus
                                            value={this.state.username}
                                            onChange={this.onUsernameChange}
                                            onKeyPress={this.onHandleKeyPress}
                                            ref={input => this.inputUser = input} />
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <input className={`input is-medium ${this.state.reqPwd}`}
                                            type="password"
                                            placeholder="Password"
                                            value={this.state.password}
                                            onChange={this.onPasswordChange}
                                            onKeyPress={this.onHandleKeyPress}
                                            ref={input => this.inputPwd = input} />
                                    </div>
                                </div>
                                <div className="field">
                                    <a
                                        className={`button is-block is-info ${this.state.isLoading}`}
                                        onClick={this.onLoginClick}
                                    >เข้าสู่ระบบ</a>
                                </div>
                            </div>
                            <div>
                                <Link className="button is-text is-inverted" to="/">
                                    <span className="has-text-link">ตรวจสอบเลขพัสดุสำหรับลูกค้า</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => ({
    startLoginLocal: (username, password) => dispatch(startLoginLocal(username, password)),
    login: (auth) => dispatch(login(auth))
});

export default connect(undefined, mapDispatchToProps)(LoginPage);