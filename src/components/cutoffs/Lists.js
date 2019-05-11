import React from 'react';
import { connect } from 'react-redux';
import { startUploadTracks } from '../../actions/upload';
import readXlsxFile from 'read-excel-file'
import moment from 'moment';
moment.locale('th');
export class CutOff extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cutoffs: props.cutoffs,
            cutoffDate: '',
            tracks: []
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.cutoffs != this.state.cutoffs) {
            this.setState({ cutoffs: nextProps.cutoffs });
        }
    }
    onFileChange = (e) => {
        this.setState({ cutoffDate: e.target.id })
        // console.log(e.target.id);
        // console.log(e.target.files[0])
        readXlsxFile(e.target.files[0])
            .then((rows) => {
                let tracks = [];
                const colTack = rows[0].findIndex(f => f == 'Tracking No') || 1;
                const colTel = rows[0].findIndex(f => f == 'Recipient Mobile') || 4;
                if (rows.length > 0) {
                    for (var row in rows) {
                        // console.log(row, rows[row][colTack], rows[row][colTack].length)
                        if (rows[row][colTack] != null)
                            if (rows[row][colTack].length == 13 && !isNaN(rows[row][colTel])) {
                                tracks.push({
                                    tracking: rows[row][colTack],
                                    tel: add0(rows[row][colTel])
                                })
                            }
                    }
                }
                function add0(tel) {
                    tel = tel.toString();
                    const len = 10 - tel.length;
                    let t = '';
                    for (var i = 0; i < len; i++) {
                        t += '0'
                    }
                    return t + tel
                }
                console.log(tracks)
                this.setState({ tracks })
            })
            .catch((errors) => {
                console.log('upload file', errors)
                alert('ไฟล์ที่อัพไม่ถูกต้อง กรุณาตรวจสอบต้องเป็น Excel เท่านั้น!')
                this.setState({ cutoffDate: '' })
            })
    }
    onCancelClick = (e) => {
        this.setState({ cutoffDate: '' })
    }
    onUploadClick = (e) => {
        if (this.state.cutoffDate != '' && this.state.tracks.length > 0) {
            this.props.startUploadTracks(this.state.cutoffDate, this.state.tracks)
                .then(() => {
                    alert('อัพโหลดเรียบร้อย^^')
                })
        }
    }
    render() {
        return (
            <table className="table is-fullwidth is-striped is-narrow">
                <thead>
                    <tr>
                        <th className="has-text-centered">ลำดับ</th>
                        <th className="has-text-left">รอบ</th>
                        <th className="has-text-centered">สถานะ</th>
                        <th className="has-text-centered">ยอดขาย</th>
                        <th className="has-text-centered">เลขพัสดุ</th>
                        <th className="has-text-centered">สถานะอัพโหลด</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.cutoffs.sort((a, b) => a.id > b.id ? -1 : 1).map((ct, i) => {
                        return <tr key={ct.id}>
                            <td className="has-text-centered">{++i}</td>
                            <td className="has-text-left">{moment(ct.id).format('ll')}</td>
                            <td className="has-text-centered">{ct.cutoff ? 'ปิดรอบแล้ว' : 'ยังไม่ปิดรอบ'}</td>
                            <td className="has-text-centered">
                                <a className="button is-primary is-centered is-small"
                                    href={`http://yaumjai.com:3000/api/jaoying/cutoffSale?cutoffDate=${moment(ct.id).format('YYYYMMDD')}&file=pdf`}
                                    target="_blank">
                                    PDF
                                </a>
                            </td>
                            {ct.cutoff ? (
                                <td className="has-text-centered">
                                    {this.state.cutoffDate !== ct.id
                                        ? <input type="file" onChange={this.onFileChange} id={ct.id} />
                                        : <div className="field is-grouped is-grouped-centered">
                                            <div className="control">
                                                <button className="button is-link" onClick={this.onUploadClick}>อัพโหลด</button>
                                            </div>
                                            <div className="control">
                                                <button className="button is-text" onClick={this.onCancelClick}>ยกเลิก</button>
                                            </div>
                                        </div>
                                    }
                                </td>
                            ) : <td className="has-text-centered">ปิดรอบก่อนถึงจะอัพไฟล์ได้</td>
                            }
                            <td className="has-text-centered">{ct.tracking ? 'อัพแล้ว' : 'ยังไม่ได้อัพ'}</td>
                        </tr>;
                    })}
                </tbody>
            </table>

        )

    }
}
const mapStateToProps = (state, props) => ({
    // cutoffs: state.cutoffs
});
const mapDispatchToProps = (dispatch, props) => ({
    startUploadTracks: (cutoffDate, tracks) => dispatch(startUploadTracks(cutoffDate, tracks)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CutOff);