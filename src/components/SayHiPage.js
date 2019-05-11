import React from 'react';
import { connect } from 'react-redux';
import Money from '../selectors/money';
import { startListSayhis, startSaveSayhi } from '../actions/sayhis';
import moment from 'moment';
moment.locale('th');
export class SayHiPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sayhis: props.sayhis || [],
            auth: props.auth,
            id: 0,
            fb: 0,
            line: 0,
            action: false,
            months: [
                { id: 1, name: 'มกราคม' }, { id: 2, name: 'กุมภาพันธ์' }, { id: 3, name: 'มีนาคม' }, { id: 4, name: 'เมษายน' },
                { id: 5, name: 'พฤษภาคม' }, { id: 6, name: 'มิถุนายน' }, { id: 7, name: 'กรกฎาคม' }, { id: 8, name: 'สิงหาคม' },
                { id: 9, name: 'กันยายน' }, { id: 10, name: 'ตุลาคม' }, { id: 11, name: 'พฤศจิกายน' }, { id: 12, name: 'ธันวาคม' }
            ],
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            years: listYears(),
            isLoading: '',
            pages: props.pages || [],
            page: props.pages[0].id
        }
        function listYears() {
            let years = [new Date().getFullYear(), new Date().getFullYear() - 1];
            // const thisYear = new Date().getFullYear();
            // const LastYear = thisYear - 1;
            // for (var i = thisYear; i >= LastYear; i--) {
            //     years.push(i)
            // }
            return years;
        }
        this.props.startListSayhis(new Date().getFullYear(), new Date().getMonth() + 1, props.pages[0].id)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.stock != this.state.stock) {
            this.setState({ stock: nextProps.stock });
        }
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.sayhis != this.state.sayhis) {
            this.setState({ sayhis: nextProps.sayhis });
        }
        if (nextProps.pages != this.state.pages) {
            this.setState({ pages: nextProps.pages });
        }
    }
    onFbChange = (e) => {
        const fb = e.target.value.replace(/\D/g, '');
        if (!isNaN(fb)) {
            this.setState({
                fb: Number(fb)
            })
        }
    }
    onLineChange = (e) => {
        const line = e.target.value.replace(/\D/g, '');
        if (!isNaN(line)) {
            this.setState({
                line: Number(line)
            })
        }
    }
    onActionClick = (action, id) => {
        if (action) {
            const data = this.state.sayhis.find(f => f.day == id) || { fb: 0, line: 0 }
            this.setState({ fb: data.fb, line: data.line })
        }
        this.setState({
            id,
            action
        })
    }
    handleSelectAll = (e) => {
        e.target.select()
    }
    onMonthChange = (e) => {
        const month = Number(e.target.value);
        this.setState({ month })
        this.props.startListSayhis(this.state.year, month, this.state.page)
        this.onActionClick(false, 0)
    }
    onYearChange = (e) => {
        const year = Number(e.target.value);
        this.setState({ year })
        this.props.startListSayhis(year, this.state.month, this.state.page)
        this.onActionClick(false, 0)
    }
    onPageChange = (e) => {
        this.setState({
            page: e.target.value
        })
        this.props.startListSayhis(this.state.year, this.state.month, e.target.value)
        this.onActionClick(false, 0)
    }
    onAmountSave = (action) => {
        this.setState({ isLoading: 'is-loading' })
        let sayhi = this.state.sayhis.find(f => f.day == this.state.id);
        sayhi.fb = this.state.fb;
        sayhi.line = this.state.line;
        this.props.startSaveSayhi(sayhi)
            .then((x) => {
                this.setState({ isLoading: '', id: 0, fb: 0, line: 0 })
            })
    }
    render() {
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">ยอดทักเพจ: {this.state.page}</h2>
                    </div>
                </div>
                <div className="columns is-mobile is-centered">
                    <div className="column is-three-fifths">
                        <div className="level">
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <div className="control">
                                        <select className="select is-info is-medium"
                                            onChange={this.onPageChange}
                                            value={this.state.page}>
                                            {this.state.pages.map(page => {
                                                return <option key={page.id}
                                                    value={page.id}>{page.id + ':' + page.admin}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <div className="control">
                                        <select className="select is-info is-medium"
                                            onChange={this.onMonthChange}
                                            value={this.state.month}>
                                            {this.state.months.map(m => {
                                                return (<option key={m.id} value={m.id}>{m.name}</option>)
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <div className="control">
                                        <select className="select is-info is-medium"
                                            onChange={this.onYearChange}
                                            value={this.state.year}>
                                            {this.state.years.map(y => {
                                                return (<option key={y} value={y}>{y}</option>)
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-body">
                    <div className="columns is-centered">
                        <div className="column is-two-thirds">
                            <table className="table is-fullwidth is-striped is-narrow">
                                <thead>
                                    <tr>
                                        <th className="has-text-right">วันที่</th>
                                        <th className="has-text-left"></th>
                                        <th className="has-text-right has-text-info">Facebook</th>
                                        <th className="has-text-right has-text-success">Line</th>
                                        <th className="has-text-centered" width="20%">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.sayhis.map((sh, i) => {
                                        const color = (sh.id ? 'dark' : 'danger')
                                        return <tr key={sh.day} >
                                            <td className={`has-text-right has-text-weight-semibold`}>{sh.day}</td>
                                            <td className={`has-text-left has-text-${color}`}>{moment(sh.date).format('dddd')}</td>
                                            {(this.state.id !== sh.day) && (<td className="has-text-right">{Money(sh.fb, 0)}</td>)}
                                            {(this.state.id !== sh.day) && (<td className="has-text-right">{Money(sh.line, 0)}</td>)}
                                            {(this.state.id !== sh.day) && (
                                                <td className="has-text-centered">
                                                    <button
                                                        className="button"
                                                        onClick={() => { this.onActionClick(true, sh.day) }}>
                                                        แก้ไข
                                        </button>
                                                </td>
                                            )}
                                            {(this.state.id === sh.day) && (
                                                <td className="has-text-right">
                                                    <div className="field has-addons has-addons-right">
                                                        <div className="control">
                                                            <input type="text" name={this.state.id}
                                                                className="input is-rounded has-text-right"
                                                                onFocus={this.handleSelectAll}
                                                                value={Money(this.state.fb, 0)}
                                                                onChange={this.onFbChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            {(this.state.id === sh.day) && (
                                                <td className="has-text-right">
                                                    <div className="field has-addons has-addons-right">
                                                        <div className="control">
                                                            <input type="text" name={this.state.id}
                                                                className="input is-rounded has-text-right"
                                                                onFocus={this.handleSelectAll}
                                                                value={Money(this.state.line, 0)}
                                                                onChange={this.onLineChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            {(this.state.id === sh.day) && (
                                                <td className="has-text-centered">
                                                    <div className="field is-grouped">
                                                        <div className="control">
                                                            <button className={`button is-success ${this.state.isLoading}`}
                                                                onClick={this.onAmountSave}>บันทึก</button>
                                                        </div>
                                                        <div className="control">
                                                            <button className={`button is-default ${this.state.isLoading}`}
                                                                onClick={() => { this.onActionClick(false, 0) }}>ปิด</button>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>;
                                    })}
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
    sayhis: state.sayhis,
    pages: state.pages// selectPages(state.pages, state.auth)
});
const mapDispatchToProps = (dispatch, props) => ({
    startListSayhis: (year, month, page) => dispatch(startListSayhis(year, month, page)),
    startSaveSayhi: (sayhi) => dispatch(startSaveSayhi(sayhi))
});
export default connect(mapStateToProps, mapDispatchToProps)(SayHiPage);