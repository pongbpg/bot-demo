import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Money from '../../selectors/money';
moment.locale('th');
export class LiveShowPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            live: props.live,
            date: moment()
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.live != this.state.live) {
            this.setState({ live: nextProps.live });
        }
    }
    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            1000
        );
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    tick() {
        this.setState({ date: moment() })
    }
    render() {
        return (
            <div className="hero is-link is-fullheight">
                <div className="hero-head" style={{ marginTop: '50px' }}>
                    <div className="container">
                        <div className="columns">
                            <div className="column is-8">
                                <h1 className="title has-text-white" style={{ fontSize: 150 }}>รหัส {this.state.live.id}</h1>
                            </div>
                            <div className="column is-4 has-text-right" style={{ paddingTop: '25px' }}>
                                <h1 className="title has-text-white is-3">
                                    วันที่ {moment(this.state.date).format('LL')}
                                    <br />{moment(this.state.date).format('LTS')}
                                </h1>
                            </div>
                        </div>
                        <div className="columns" style={{ paddingTop: '30px' }}>
                            <div className="column is-6">
                                <h1 className="title is-2 has-text-white" style={{ fontSize: 80 }}>{this.state.live.name}</h1>
                            </div>
                            <div className="column is-6 has-text-centered">
                                <h1 className="title is-2 has-text-white" style={{ fontSize: 140 }}>฿{Money(this.state.live.price, 0)}</h1>
                            </div>
                        </div>
                        {/* <div className="columns" style={{ marginTop: '30px' }}>
                           
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    live: state.live
});
const mapDispatchToProps = (dispatch, props) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(LiveShowPage);