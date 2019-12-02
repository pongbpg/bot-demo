import React from 'react';
import { connect } from 'react-redux';
export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth
    }
    console.log('home')
  }


  render() {
    return (
      <div className="hero-body">
        <div className="columns">
          <div className="column is-12">
            Home Page
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
