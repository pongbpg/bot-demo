import React from 'react';
import { connect } from 'react-redux';
import { startAddProduct } from '../../actions/widget/product';
import Money from '../../selectors/money';
export class AddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            size: '',
            amount: '',
            cost: '',
            price: ''
        }
    }
    onNameChange = (e) => {
        this.setState({ name: e.target.value })
    }
    onSizeChange = (e) => {
        let size = e.target.value.replace(/\D/g, '');
        if (size.length == 6) {
            let newSize = '';
            for (let i = 0; i < size.length; i++) {
                newSize += size.charAt(i);
                if ((i + 1) % 2 == 0 && i < 5) {
                    newSize += '-';
                }
            }
            this.setState({ size: newSize })
        } else if (size.length < 6) {
            this.setState({ size })
        }
    }
    onAmountChange = (e) => {
        const amount = e.target.value.replace(/\D/g, '');
        if (!isNaN(amount)) {
            this.setState({
                amount: Number(amount)
            })
        }
    }
    onPriceChange = (e) => {
        const price = e.target.value.replace(/\D/g, '');
        if (!isNaN(price)) {
            this.setState({
                price: Number(price)
            })
        }
    }
    onCostChange = (e) => {
        const cost = e.target.value.replace(/\D/g, '');
        if (!isNaN(cost)) {
            this.setState({
                cost: Number(cost)
            })
        }
    }
    onAddClick = (e) => {
        this.props.startAddProduct({
            name: this.state.name,
            size: this.state.size,
            amount: this.state.amount == '' ? 0 : this.state.amount,
            price: this.state.price == '' ? 0 : this.state.price,
            cost: this.state.cost == '' ? 0 : this.state.cost
        }).then(() => {
            this.setState({ name: '', size: '', amount: '', cost: '', price: '' })
        })
    }
    onHandleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onAddClick();
        }
    }
    render() {
        return (
            <section className="hero">
                <div className="hero-head">
                    <div className="container">
                        <h2 className="title">เพิ่มสินค้า</h2>
                    </div>
                </div>
                <div className="hero-body">
                    {/* <div className="field is-horizontal">
                        <div className="field-body">
                            <div className="field">
                                <div className="control">
                                    <input className="input" type="text" placeholder="ชื่อสินค้า"
                                        value={this.state.name}
                                        onKeyPress={this.onHandleKeyPress}
                                        onChange={this.onNameChange} />
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="columns">
                        <div className="column is-10">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input className="input" type="text" placeholder="ชื่อสินค้า"
                                            value={this.state.name}
                                            onKeyPress={this.onHandleKeyPress}
                                            onChange={this.onNameChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column is-2">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input className="input" type="text" placeholder="ขนาด"
                                            value={this.state.size}
                                            onKeyPress={this.onHandleKeyPress}
                                            onChange={this.onSizeChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="columns">
                        <div className="column is-3">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input className="input" type="text" placeholder="COST"
                                            value={this.state.cost == '' ? '' : Money(this.state.cost, 0)}
                                            onKeyPress={this.onHandleKeyPress}
                                            onChange={this.onCostChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column is-3">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input className="input" type="text" placeholder="ราคา"
                                            value={this.state.price == '' ? '' : Money(this.state.price, 0)}
                                            onKeyPress={this.onHandleKeyPress}
                                            onChange={this.onPriceChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column is-3">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input className="input" type="text" placeholder="จำนวน"
                                            value={this.state.amount == '' ? '' : Money(this.state.amount, 0)}
                                            onKeyPress={this.onHandleKeyPress}
                                            onChange={this.onAmountChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column is-3">
                            <div className="field-body">
                                <div className="field">
                                    <p className="control">
                                        <button className={`button is-success is-fullwidth ${this.state.isLoading ? 'is-loading' : ''}`}
                                            onClick={this.onAddClick}>
                                            เพิ่ม</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="field is-grouped">
                        <p className="control is-expanded">
                            <input className="input is-large" type="text" placeholder="ชื่อสินค้า"
                                value={this.state.name}
                                onChange={this.onNameChange} />

                        </p>
                        <p>
                            <input className="input is-large" type="text" placeholder="ต้นทุน"
                                value={this.state.cost}
                                onChange={this.onCostChange} />
                        </p>
                        <p>
                            <input className="input is-large" type="text" placeholder="จำนวน"
                                value={this.state.amount}
                                onChange={this.onAmountChange} />
                        </p>

                        <p className="control">
                            <button className={`button is-success is-large is-rounded ${this.state.isLoading ? 'is-loading' : ''}`}
                                onClick={this.onAddClick}>
                                เพิ่ม</button>
                        </p>
                    </div> */}
                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
});
const mapDispatchToProps = (dispatch, props) => ({
    startAddProduct: (product) => dispatch(startAddProduct(product)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);