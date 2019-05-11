import React from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import Money from '../selectors/money';
import { startListCosts, startSaveCost } from '../actions/costs';
import ListCosts from '../selectors/costs';
import moment from 'moment';
moment.locale('th');
export class CostPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            costs: ListCosts(props.costs || [], props.pages || [], moment().format('YYYYMMDD')),
            auth: props.auth,
            id: '',
            fb: 0,
            line: 0,
            delivery: 0,
            action: false,
            date: moment(),
            isLoading: '',
            pages: props.pages || []
        }
        this.props.startListCosts(moment().format('YYYYMMDD'));
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.costs != this.state.costs) {
            this.setState({ costs: ListCosts(nextProps.costs, this.state.pages, moment(this.state.date).format('YYYYMMDD')) });
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
    onDeliveryChange = (e) => {
        const delivery = e.target.value.replace(/\D/g, '');
        if (!isNaN(delivery)) {
            this.setState({
                delivery: Number(delivery)
            })
        }
    }
    onActionClick = (action, id) => {
        if (action) {
            const data = this.state.costs.find(f => f.page == id) || { fb: 0, line: 0, delivery: 0 }
            this.setState({ fb: data.fb, line: data.line, delivery: data.delivery })
        }
        this.setState({
            id,
            action
        })
    }
    handleSelectAll = (e) => {
        e.target.select()
    }
    onDateChange = (date) => {
        this.setState({ date })
        this.props.startListCosts(moment(date).format('YYYYMMDD'))
        this.onActionClick(false, 0)
    }
    onAmountSave = (action) => {
        this.setState({ isLoading: 'is-loading' })
        let cost = this.state.costs.find(f => f.page == this.state.id);
        cost.fb = this.state.fb;
        cost.line = this.state.line;
        cost.delivery = this.state.delivery;
        // console.log(cost)
        this.props.startSaveCost(cost)
            .then((x) => {
                this.setState({ isLoading: '', id: '', fb: 0, line: 0, delivery: 0 })
            })
    }
    render() {
        // console.log(this.state.costs)
        // console.log(this.state.date)
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">ค่าใช้จ่ายวันที่: {moment(this.state.date).format('LL')}</h2>
                    </div>
                </div>
                <div className="columns is-mobile is-centered">
                    <div className="column is-three-fifths">
                        <div className="level">
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <label className="label">วันที่</label>
                                    <div className="control">
                                        <DatePicker
                                            className="input has-text-centered"
                                            dateFormat="DD/MM/YYYY"
                                            placeholderText="เลือกวันที่"
                                            selected={this.state.date}
                                            onChange={this.onDateChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-body">
                    <div className="columns is-centered">
                        <div className="column is-four-fifths">
                            <table className="table is-fullwidth is-striped is-narrow">
                                <thead>
                                    <tr>
                                        <th className="has-text-centered">ลำดับ</th>
                                        <th className="has-text-left">เพจ</th>
                                        <th className="has-text-right has-text-info">Facebook</th>
                                        <th className="has-text-right has-text-success">Line</th>
                                        <th className="has-text-right has-text-danger">ค่าขนส่ง</th>
                                        <th className="has-text-centered" width="20%">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.costs.map((cost, i) => {
                                        return (
                                            <tr key={cost.page}>
                                                <td className="has-text-centered">{++i}</td>
                                                <td className="has-text-left">{`${cost.page} ${cost.admin}`}</td>
                                                {(this.state.id !== cost.page) && (<td className="has-text-right">{Money(cost.fb, 0)}</td>)}
                                                {(this.state.id !== cost.page) && (<td className="has-text-right">{Money(cost.line, 0)}</td>)}
                                                {(this.state.id !== cost.page) && (<td className="has-text-right">{Money(cost.delivery, 0)}</td>)}
                                                {(this.state.id !== cost.page) && (
                                                    <td className="has-text-centered">
                                                        <button
                                                            className="button"
                                                            onClick={() => { this.onActionClick(true, cost.page) }}>
                                                            แก้ไข</button>
                                                    </td>
                                                )}
                                                {(this.state.id === cost.page) && (
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
                                                {(this.state.id === cost.page) && (
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
                                                {(this.state.id === cost.page) && (
                                                    <td className="has-text-right">
                                                        <div className="field has-addons has-addons-right">
                                                            <div className="control">
                                                                <input type="text" name={this.state.id}
                                                                    className="input is-rounded has-text-right"
                                                                    onFocus={this.handleSelectAll}
                                                                    value={Money(this.state.delivery, 0)}
                                                                    onChange={this.onDeliveryChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                                {(this.state.id === cost.page) && (
                                                    <td className="has-text-centered">
                                                        <div className="field is-grouped">
                                                            <div className="control">
                                                                <button className={`button is-success ${this.state.isLoading}`}
                                                                    onClick={this.onAmountSave}>บันทึก</button>
                                                            </div>
                                                            <div className="control">
                                                                <button className={`button is-default ${this.state.isLoading}`}
                                                                    onClick={() => { this.onActionClick(false, '') }}>ปิด</button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        )
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
    costs: state.costs,
    pages: state.pages
});
const mapDispatchToProps = (dispatch, props) => ({
    startListCosts: (date) => dispatch(startListCosts(date)),
    startSaveCost: (cost) => dispatch(startSaveCost(cost))
});
export default connect(mapStateToProps, mapDispatchToProps)(CostPage);