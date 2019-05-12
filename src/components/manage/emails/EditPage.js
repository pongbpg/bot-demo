import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startUpdateEmail } from '../../../actions/manage/emails';
export class EditPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            email: props.email || { email: '', role: '', pages: [] },
            pages: props.pages || [],
            datas: []
        }
        if (!props.email) props.history.push('/manage/emails')
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.email != this.state.email) {
            this.setState({ email: nextProps.email });
        }
    }
    componentWillMount = () => {
        this.sliceArray(this.state.pages);
    }
    sliceArray = (pages) => {
        const rowsNo = Math.floor(Math.sqrt(pages.length));
        const rowsCount = Math.ceil(pages.length / rowsNo);
        let datas = [];
        pages = pages.sort((a, b) => a.team + a.id > b.team + b.id ? 1 : -1)
        for (var i = 0; i < pages.length; i += 4) { //i+rowsCount
            datas.push(pages.slice(i, i + 4)); //i+rowsCount
        }
        this.setState({
            pages,
            datas
        })
    }
    onRoleChange = (e) => {
        this.setState({ email: { ...this.state.email, role: e.target.value } })
    }
    onPageChange = (e) => {
        const action = e.target.checked;
        const page = e.target.name;
        let pages = this.state.email.pages
        if (action) {
            pages.push(page)
        } else {
            pages = pages.filter(f => f != page)
        }
        this.setState({ email: { ...this.state.email, pages } })
    }

    onActiveChange = (e) => {
        this.setState({ email: { ...this.state.email, active: e.target.checked } })
    }
    onSubmit = () => {
        if (confirm('คุณยืนยันที่จะบันทึกข้อมูลนี้?')) {
            this.props.startUpdateEmail(this.state.email).then(() => {
                this.props.history.push('/manage/emails')
            })

        }
    }
    render() {
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">แก้ไขข้อมูลอีเมลล์</h2>
                    </div>
                </div>
                <div className="hero-body">
                    <div className="columns is-centered">
                        <div className="column is-4">
                            <div className="field">
                                <label className="label">อีเมลล์</label>
                                <div className="control">
                                    <input className="input" type="text" disabled value={this.state.email.email} />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">ประเภท</label>
                                <div className="control">
                                    <div className="select">
                                        <select value={this.state.email.role} onChange={this.onRoleChange}>
                                            <option value="owner">ผู้ดูแล</option>
                                            <option value="admin">แอดมิน</option>
                                            <option value="stock">สต็อกสินค้า</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="field">
                                <label className={`checkbox ${this.state.email.active ? 'has-text-success' : 'has-text-danger'}`}>
                                    <input type="checkbox" checked={this.state.email.active}
                                        onChange={this.onActiveChange} /> {this.state.email.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                </label>
                            </div> */}
                        </div>

                        <div className="column is-4-offset-4">
                            <div className="field">
                                <label className="label">เพจ</label>
                                <div className="control">
                                    {
                                        this.state.datas.map((pages, key) => {
                                            return (
                                                <div key={key} className="columns">
                                                    {
                                                        pages.map((page) => {
                                                            const checked = this.state.email.pages.filter(f => f == page.id).length > 0;
                                                            return (
                                                                <div className="column is-3" key={page.id}>
                                                                    <label className="checkbox">
                                                                        <input type="checkbox" checked={checked}
                                                                            onChange={this.onPageChange}
                                                                            name={page.id} /> {page.id} ({page.team})
                                                                    </label>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="field is-grouped">
                            <div className="control">
                                <button className="button is-link" onClick={this.onSubmit}>บันทึก</button>
                            </div>
                            <div className="control">
                                <Link className="button is-text" to="/manage/emails">ย้อนกลับ</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    email: state.manage.emails.find(f => f.uid == props.match.params.uid),
    pages: state.pages
});
const mapDispatchToProps = (dispatch, props) => ({
    startUpdateEmail: (email) => dispatch(startUpdateEmail(email))
});
export default connect(mapStateToProps, mapDispatchToProps)(EditPage);