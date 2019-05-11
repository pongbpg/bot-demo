import React from 'react';
import { connect } from 'react-redux';
import { startGetCutOff } from '../../actions/cutoff';
import CutOff from './CutOff';
import Lists from './Lists';
import moment from 'moment';
moment.locale('th');
export class CutOffPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cutoffs: props.cutoffs,
        }
        this.props.startGetCutOff()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.cutoffs != this.state.cutoffs) {
            this.setState({ cutoffs: nextProps.cutoffs });
        }
    }
    render() {
        const cutoff = this.state.cutoffs.find(f => f.cutoff === false);
        return (
            <div className="container">
                <div className="column">
                    <CutOff cutoff={cutoff} />
                </div>
                <div className="column">
                    <Lists cutoffs={this.state.cutoffs} />
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    cutoffs: state.cutoffs
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetCutOff: () => dispatch(startGetCutOff()),
    // startCutOff: () => dispatch(startCutOff())
});
export default connect(mapStateToProps, mapDispatchToProps)(CutOffPage);