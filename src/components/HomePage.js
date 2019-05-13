import React from 'react';
import { connect } from 'react-redux';
import StockWidget from './widget/StockPage';
import AddProduct from './widget/AddProduct';
export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth
    }
  }


  render() {
    return (
      <div className="hero-body">
        <div className="columns">
          <div className="column is-12">
            {this.state.auth.role == 'owner' && (<AddProduct />)}
            <StockWidget />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
