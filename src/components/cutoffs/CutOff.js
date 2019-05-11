import React from 'react';
import { connect } from 'react-redux';
import { startCutOff, startCutOn } from '../../actions/cutoff';
import DatePicker from 'react-datepicker';
import moment from 'moment';
moment.locale('th');
export class CutOff extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cutoff: props.cutoff,
            cutoffDate: moment()
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.cutoff != this.state.cutoff) {
            this.setState({ cutoff: nextProps.cutoff });
        }
    }
    onDateChange = (date) => {
        this.setState({
            cutoffDate: date
        });
    }
    onCutOffClick = () => {
        var r = confirm("ต้องการจะปิดรอบใช่หรือไม่?");
        if (r == true) {
            alert("ปิดรอบแล้ว!");
            this.props.startCutOff(this.state.cutoff.id)
            // this.props.history.push('/home')
        }
    }
    onCutOnClick = () => {
        var r = confirm("ต้องการจะเปิดรอบใช่หรือไม่?");
        if (r == true) {
            alert("เปิดรอบแล้ว!");
            this.props.startCutOn(moment(this.state.cutoffDate).format('YYYYMMDD'))
            // this.props.history.push('/home')
        }
    }
    render() {
        if (this.state.cutoff) {
            return (
                <section className="hero">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title">ปิดรอบสั่งซื้อ</h1>
                            {/* <h2 className="subtitle">วันที่ </h2> */}
                        </div>
                    </div>
                    <nav className="level">
                        <p className="level-item has-text-centered">
                            <button className="button is-danger is-centered is-large"
                                onClick={this.onCutOffClick}>
                                คลิกเพื่อปิดรอบ {moment(this.state.cutoff.id).format('ll')} จ้า
                        </button>
                        </p>
                    </nav>
                </section>
            )
        } else {
            return <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">เปิดรอบสั่งซื้อ</h1>
                    </div>
                </div>
                <nav className="level">
                    <div className="level-item has-text-centered">
                        <DatePicker
                            className="input has-text-centered"
                            dateFormat="DD/MM/YYYY"
                            placeholderText="เลือกวันที่"
                            selected={this.state.cutoffDate}
                            onChange={this.onDateChange}
                        />
                    </div>
                </nav>
                <nav className="level">
                    <p className="level-item has-text-centered">
                        <button className="button is-info is-centered is-large"
                            onClick={this.onCutOnClick}>
                            คลิกเพื่อเปิดรอบ {moment(this.state.cutoffDate).format('ll')} จ้า
                        </button>
                    </p>
                </nav>
            </section>
        }

    }
}
const mapStateToProps = (state, props) => ({
    // cutoffs: state.cutoffs
});
const mapDispatchToProps = (dispatch, props) => ({
    // startGetCutOff: () => dispatch(startGetCutOff()),
    startCutOff: (id) => dispatch(startCutOff(id)),
    startCutOn: (id) => dispatch(startCutOn(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CutOff);