import React from 'react';
import { connect } from 'react-redux';
import { startGetEmails, startUpdateEmail, startResetPassword, startPushEmail } from '../../../actions/manage/emails';
import MdAddCircle from 'react-icons/lib/md/add-circle';
export class EmailsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            emails: props.emails || [],
            newEmail: '',
            checkEmail: true
        }
        this.props.startGetEmails();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.emails != this.state.emails) {
            this.setState({ emails: nextProps.emails });
        }
    }
    onEditClick = (e) => {
        this.props.history.push('/manage/email/' + e.target.value)
    }
    onResetClick = (e) => {
        const email = e.target.value.toString();
        if (confirm('คุณต้องการยืนยันที่จะรีเซ็ตรหัสผ่านอีเมลล์นี้?')) {
            this.props.startResetPassword(email)
                .then(() => {
                    alert('รีเซ็ตรหัสผ่านเรียบร้อย กรุณาตรวจสอบอีเมลล์')
                })
        }

    }
    onNewChange = (e) => {
        const newEmail = e.target.value.replace(/\s/g, '');
        let checkEmail = true;
        if (this.validateEmail(newEmail)) {
            checkEmail = false;
        }
        this.setState({ newEmail, checkEmail })
    }
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    onNewClick = () => {
        const email = this.state.newEmail;
        const password = Math.floor(100000 + Math.random() * 900000).toString();
        if (this.state.emails.find(f => f.email == email)) {
            alert(email + ' มีใช้งานแล้ว!')
            return;
        }
        if (confirm('ต้องการเพิ่ม ' + email + ' ใช่หรือไม่?')) {
            // this.props.startCreateUser(email, password)
            //     .then(() => {

            //     })

            var cors_api_url = '/api/auth/create';
            fetch(cors_api_url, {
                body: JSON.stringify({ email, password }),
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, same-origin, *omit
                headers: {
                    'user-agent': 'Mozilla/4.0 MDN Example',
                    'content-type': 'application/json'
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
                redirect: 'follow', // manual, *follow, error
                referrer: 'no-referrer', // *client, no-referrer
            })
                .then(results => results.json())
                .then(data => {
                    this.props.startPushEmail({ email, uid: data.uid, pages: [], disabled: false, role: 'admin' })
                        .then(() => {
                            alert('เพิ่มผู้ใช้งานเรียบร้อย!\nUsername: ' + email + '\nPassword: ' + password)
                            this.props.history.push('/manage/email/' + data.uid)
                        })
                })
        }
    }
    onDisabledClick = (e) => {
        if (confirm('คุณต้องการยืนยันที่ปิดใช้งานอีเมลล์นี้?')) {
            const uid = e.target.name;
            const disabled = !JSON.parse(e.target.value);
            var cors_api_url = '/api/auth/disabled';
            fetch(cors_api_url, {
                body: JSON.stringify({ uid, disabled }),
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, same-origin, *omit
                headers: {
                    'user-agent': 'Mozilla/4.0 MDN Example',
                    'content-type': 'application/json'
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
                redirect: 'follow', // manual, *follow, error
                referrer: 'no-referrer', // *client, no-referrer
            })
                .then(results => results.json())
                .then(data => {
                    this.props.startUpdateEmail({ uid, disabled })
                })
        }
    }
    render() {
        return (
            <section className="hero">
                {/* <div className="hero-body"> */}

                {/* </div> */}
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">รายชื่อผู้ใช้งาน</h2>
                    </div>
                    <div className="column is-4 is-offset-8">
                        <div className="field has-addons ">
                            <div className="control is-expanded">
                                <input className="input" type="text" value={this.state.newEmail} placeholder="Enter Email Address"
                                    onChange={this.onNewChange} />
                            </div>
                            <div className="control">
                                <a className="button is-info" disabled={this.state.checkEmail} onClick={this.onNewClick}><MdAddCircle /> ผู้ใช้งาน</a>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <table className="table is-fullwidth is-striped is-narrow">
                                <thead>
                                    <tr>
                                        <th className="has-text-centered">ลำดับ</th>
                                        <th className="has-text-left">อีเมลล์</th>
                                        <th className="has-text-centered">ประเภท</th>
                                        <th className="has-text-centered">เพจ</th>
                                        <th className="has-text-centered" >จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.emails.length > 0 ?
                                        this.state.emails
                                            .map((email, index) => {
                                                return (<tr key={email.uid}>
                                                    <td className={`has-text-centered ${email.disabled ? 'has-text-grey-light' : ''}`}>{index + 1}</td>
                                                    <td className={email.disabled ? 'has-text-grey-light' : ''}>{email.email}</td>
                                                    <td className={`has-text-centered ${email.disabled ? 'has-text-grey-light' : ''}`}>{email.role}</td>
                                                    <td className={`has-text-centered ${email.disabled ? 'has-text-grey-light' : ''}`}>{email.pages.join()}</td>
                                                    <td className="has-text-centered">
                                                        <button className="button"
                                                            value={email.uid}
                                                            onClick={this.onEditClick}>
                                                            แก้ไข</button>
                                                        &nbsp;
                                                        <button className="button"
                                                            value={email.email}
                                                            onClick={this.onResetClick}>
                                                            รีเซ็ต</button>
                                                        &nbsp;
                                                        <button className={`button is-outlined ${email.disabled ? 'is-info' : 'is-danger'}`}
                                                            name={email.uid}
                                                            value={email.disabled}
                                                            onClick={this.onDisabledClick}>
                                                            {email.disabled ? 'เปิด' : 'ปิด'}ใช้งาน</button>
                                                    </td>
                                                </tr>)
                                            }) : (
                                            <tr><td className="has-text-centered" colSpan={5}>กำลังโหลดข้อมูล...</td></tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    emails: state.manage.emails
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetEmails: () => dispatch(startGetEmails()),
    startUpdateEmail: (email) => dispatch(startUpdateEmail(email)),
    startResetPassword: (email) => dispatch(startResetPassword(email)),
    startPushEmail: (email) => dispatch(startPushEmail(email))
});
export default connect(mapStateToProps, mapDispatchToProps)(EmailsPage);