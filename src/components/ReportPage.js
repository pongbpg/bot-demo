import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import selectPages from '../selectors/pages';
import moment from 'moment';
moment.locale('th');
export class ReportPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment(),
            endDate: moment(),
            uid: props.auth.uid,
            sum: 'daily',
            auth: props.auth,
            pages: props.pages,
            page: (['owner', 'stock'].indexOf(props.auth.role) > -1 ? 'ALL' : props.pages[0].id)
        }
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
    }
    handleStartChange(date) {
        this.setState({
            startDate: date
        });
    }
    handleEndChange(date) {
        this.setState({
            endDate: date
        });
    }
    onSumChange = (e) => {
        this.setState({ sum: e.target.value })
    }
    handlePageChange = (e) => {
        this.setState({
            page: e.target.value
        })
        console.log(e.target.value)
    }
    render() {
        // console.log('pages', this.state.pages)
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">รายงาน</h1>

                    </div>
                </div>
                <div className="columns is-mobile is-centered">
                    <div className="column is-half">
                        <div className="level">
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <label className="label">เลือกวันที่</label>
                                    <DatePicker
                                        className="input has-text-centered"
                                        dateFormat="DD/MM/YYYY"
                                        placeholderText="เลือกวันที่"
                                        selected={this.state.startDate}
                                        onChange={this.handleStartChange}
                                    />
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <label className="label">ถึงวันที่</label>
                                    <DatePicker
                                        className="input has-text-centered"
                                        dateFormat="DD/MM/YYYY"
                                        placeholderText="เลือกวันที่"
                                        selected={this.state.endDate}
                                        onChange={this.handleEndChange}
                                    />
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <label className="label">ยอดรวม</label>
                                    <div className="select">
                                        <select selected={this.state.sum} onChange={this.onSumChange}>
                                            <option value="daily">รายวัน</option>
                                            <option value="all">ทั้งหมด</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="columns is-mobile is-centered">
                    <div className="column">
                        <table className="table is-bordered is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <th className="has-text-centered">ลำดับ</th>
                                    <th className="has-text-centered">รายงาน</th>
                                    <th className="has-text-centered">พิมพ์</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="has-text-centered">1</td>
                                    <td className="has-text-centered">รายชื่อแพ็คของ (วันที่เริ่ม)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/jaoying/delivery?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=pdf`}
                                                    target="_blank">
                                                    PDF
                                        </a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/jaoying/delivery?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=excel`}
                                                    target="_blank">
                                                    EXCEL
                                        </a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="has-text-centered">2</td>
                                    <td className="has-text-centered">ลำดับซอง (วันที่เริ่ม)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/jaoying/delivery?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=pdf&detail=show`}
                                                    target="_blank">
                                                    PDF
                                        </a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/jaoying/delivery?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=excel&detail=show`}
                                                    target="_blank">
                                                    EXCEL
                                        </a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                < tr >
                                    <td className="has-text-centered">3</td>
                                    <td className="has-text-centered">STATEMENTการโอนแต่ละธนาคาร (วันที่เริ่ม-ถึงวันที่)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/jaoying/dailyStatement?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=pdf`}
                                                    target="_blank">
                                                    PDF</a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/jaoying/dailyStatement?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=excel`}
                                                    target="_blank">
                                                    EXCEL</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                < tr >
                                    <td className="has-text-centered">4</td>
                                    <td className="has-text-centered">STATEMENT กวง (วันที่เริ่ม-ถึงวันที่)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/jaoying/dailyStatement?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=pdf&order=id`}
                                                    target="_blank">
                                                    PDF</a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/jaoying/dailyStatement?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=excel&order=id`}
                                                    target="_blank">
                                                    EXCEL</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                < tr >
                                    <td className="has-text-centered">5</td>
                                    <td className="has-text-centered">ยอดโอนรวมแต่ละธนาคาร (วันที่เริ่ม-ถึงวันที่)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/jaoying/dailyBank?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=pdf&sum=all`}
                                                    target="_blank">
                                                    PDF</a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/jaoying/dailyBank?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=excel&sum=all`}
                                                    target="_blank">
                                                    EXCEL</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </section>
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    pages: state.pages//selectPages(state.pages, state.auth)
});
const mapDispatchToProps = (dispatch, props) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(ReportPage);