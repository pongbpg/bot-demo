import React from 'react';
import { connect } from 'react-redux';
import { startGetStock } from '../../actions/widget/stock';
import { startSetLive } from '../../actions/widget/live';
import moment from 'moment';
moment.locale('th');
import Money from '../../selectors/money';
export class LiveEditPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stocks: props.stocks,
            pid: '',
            price: '',
            live: props.live
        }
        this.props.startGetStock()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.stocks != this.state.stocks) {
            this.setState({ stocks: nextProps.stocks });
        }
        if (nextProps.live != this.state.live) {
            this.setState({ live: nextProps.live });
        }
    }
    onPidChange = (e) => {
        this.setState({ pid: e.target.value.replace(/\D/g, '') })
    }
    onPriceChange = (e) => {
        this.setState({ price: e.target.value.replace(/\D/g, '') })
    }
    onSubmit = () => {
        const stock = this.state.stocks.find(f => f.id === this.state.pid)
        if (stock) {
            const price = this.state.price == '' ? stock.price : Number(this.state.price.replace(/\D/g, ''))
            this.props.startSetLive({
                ...stock,
                price
            })
        } else {
            alert('ไม่มีรหัสสินค้านี้')
        }
    }
    onClear = () => {
        this.setState({ pid: '', price: '' })
        this.props.startSetLive({ id: '-', name: '-', price: '-' })
    }
    render() {
        return (
            <div className="container" style={{ paddingTop: '20px' }}>
                <section className="hero">
                    <div className="hero-head">
                        <div className="container">
                            <h2 className="title">Monitor Live</h2>
                        </div>
                    </div>
                    <div className="hero-body">
                        <div className="level">
                            <div className="level-item">
                                <div className="field">
                                    <label className="label">รหัสสินค้า</label>
                                    <div className="control">
                                        <input className="input" type="text" onChange={this.onPidChange} value={this.state.pid} />
                                    </div>
                                </div>
                            </div>
                            <div className="level-item">
                                <div className="field">
                                    <label className="label">ราคา</label>
                                    <div className="control">
                                        <input className="input" type="text" onChange={this.onPriceChange} value={this.state.price} />
                                    </div>
                                </div>
                            </div>
                            <div className="level-item">
                                <div className="field is-grouped">
                                    <div className="control">
                                        <button className="button is-link" onClick={this.onSubmit}>อัพเดท</button>
                                    </div>
                                    <div className="control">
                                        <button className="button is-text" onClick={this.onClear}>ล้าง</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="level">
                            <div className="level-item">
                                <article className="message is-info">
                                    <div className="message-header">
                                        <p>LIVE NOW:</p>
                                        {/* <button className="delete" aria-label="delete"></button> */}
                                    </div>
                                    <div className="message-body">
                                        รหัสสินค้า: {this.state.live.id}
                                        <br />
                                        ชื่อสินค้า: {this.state.live.name}
                                        <br />
                                        ราคา: {Money(this.state.live.price)}
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    stocks: state.stock,
    live: state.live
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetStock: () => dispatch(startGetStock()),
    startSetLive: (live) => dispatch(startSetLive(live))
});
export default connect(mapStateToProps, mapDispatchToProps)(LiveEditPage);