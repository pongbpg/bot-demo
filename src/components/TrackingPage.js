import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { startSearchTracking } from '../actions/search';
import FaSearch from 'react-icons/lib/fa/search';
import Money from '../selectors/money';
import moment from 'moment';
moment.locale('th');
export class TrackingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenu: false,
      isBurger: false,
      search: '',
      searchList: props.searchList,
      alert: false,
      isLoading: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.searchList != this.state.searchList) {
      this.setState({ searchList: nextProps.searchList });
    }
  }
  toggleIsMenu = () => {
    this.setState(() => ({
      isMenu: !this.state.isMenu
    }))
  }
  toggleIsBurger = () => {
    this.setState(() => ({
      isBurger: !this.state.isBurger
    }))
  }
  onSearchChange = (e) => {
    this.setState({ search: e.target.value.replace(/\s/g, '') })
  }
  onSearchClick = () => {
    if (this.state.search.length > 0) {
      this.setState({ isLoading: true })
      this.props.startSearchTracking(this.state.search)
        .then(result => {
          this.setState({ isLoading: false })
          if (result.search.length == 0) {
            this.setState({ alert: this.state.search })
          } else {
            this.setState({ alert: false })
          }
        })
    }
  }
  onAlertCloseClick = () => {
    this.setState({ alert: false })
  }
  render() {
    // console.log(this.state.searchList)
    const style = {
      // alignItems: 'center',
      backgroundImage: 'url("/images/tracking.jpg")',
      // backgroundSize: 'cover',
      // display: 'flex',
      // justifyContent: 'center',
      height: 100 + 'vh',
      width: 100 + 'vw',
    }
    return (
      // <div style={style}>
      <div className="is-fullheight" style={style}>
        <nav className="navbar">
          <div className="container">
            <div className="navbar-brand">
              <span className="navbar-item title">JAOYING SHOP</span>
              <span data-target="navbarMenu" onClick={this.toggleIsBurger}
                className={this.state.isBurger === true ? "navbar-burger burger is-active" : "navbar-burger burger"}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
            <div id="navbarMenu" className={this.state.isBurger === true ? "navbar-menu is-active" : "navbar-menu"}>
              <div className="navbar-end">
                <div className="navbar-item is-active">
                  <Link to="/home"><span className="button  is-info is-rounded is-outlined">สำหรับเจ้าหน้าที่</span></Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className="hero-body">
          <div className="container">
            <div className="columns is-hidden-mobile">
              <div className="column is-8 is-offset-2">
                {/* <h4 className="pretitol" style={{ marginBottom: 1 + 'rem' }}>CRYPTOCURRENCY INDEX FUND</h4> */}
                <h1 className="title has-text-white">ค้นหาเลขพัสดุ</h1>
                <div className="field is-grouped">
                  <p className="control has-icons-left is-expanded">
                    <input className="input is-large" type="text" placeholder="เบอร์โทรศัพท์ 10 หลัก ถ้าเป็นเบอร์บ้านเติม 0 ข้างหน้าค่ะ"
                      value={this.state.search}
                      onChange={this.onSearchChange} />
                    <span className="icon is-small is-left">
                      <FaSearch />
                    </span>
                  </p>
                  <p className="control">
                    <button className={`button is-success is-large is-rounded ${this.state.isLoading ? 'is-loading' : ''}`}
                      onClick={this.onSearchClick}>
                      ค้นหา</button>
                  </p>
                </div>
              </div>
            </div>

            <div className="columns is-hidden-tablet">
              <div className="column is-8 is-offset-2">
                {/* <h4 className="pretitol" style={{ marginBottom: 1 + 'rem' }}>CRYPTOCURRENCY INDEX FUND</h4> */}
                <h1 className="title has-text-white">ค้นหาเลขพัสดุ</h1>
                <div className="field">
                  <p className="control has-icons-left is-expanded">
                    <input className="input is-large" type="text" placeholder="รหัสสั่งซื้อ/เบอร์โทรศัพท์"
                      value={this.state.search}
                      onChange={this.onSearchChange} />
                    <span className="icon is-small is-left">
                      <FaSearch />
                    </span>
                  </p>
                </div>
                <div className="field">
                  <p className="control has-text-centered">
                    <button className={`button is-success is-large is-rounded ${this.state.isLoading ? 'is-loading' : ''}`}
                      onClick={this.onSearchClick}>
                      ค้นหา</button>
                  </p>
                </div>
              </div>
            </div>
            <div className="columns is-hidden-mobile">
              <div className="column is-10 is-offset-1">
                {this.state.searchList.length > 0 &&
                  (
                    <table className="table is-fullwidth is-striped is-narrow">
                      <thead>
                        <tr>
                          <th className="has-text-centered">รหัสสั่งซื้อ</th>
                          <th className="has-text-centered">ชื่อผู้สั่งซื้อ</th>
                          <th className="has-text-centered">เพจ</th>
                          <th className="has-text-centered">วันที่ส่งสินค้า</th>
                          <th className="has-text-right">ยอดโอน</th>
                          <th className="has-text-centered">เลขพัสดุ</th>
                          <th className="has-text-centered">ส่งโดย</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.searchList.map((order, i) => {
                          const d = order.cutoffDate.substr(0, 4) + '-' + order.cutoffDate.substr(4, 2) + '-' + order.cutoffDate.substr(6, 2);
                          return <tr key={order.id}>
                            <td className="has-text-centered">{order.id}</td>
                            <td className="has-text-centered">{order.name}</td>
                            <td className="has-text-centered">{order.page}</td>
                            <td className="has-text-centered">{moment(d).format('ll')}</td>
                            <td className="has-text-right">{Money(order.price)}</td>
                            <td className="has-text-centered">{order.tracking == '' ? (order.cutoff ? 'กำลังนำเลขพัสดุเข้าสู่ระบบ' : 'กำลังจัดเตรียมสินค้า') : order.tracking}</td>
                            <td className="has-text-centered">
                              <a href={order.expressLink + (order.expressName == 'KERRY' ? '=' + order.tracking : '')} target="_blank">
                                {!order.expressName ?
                                  (order.cutoff ? 'จัดส่งแล้ว' : 'ยังไม่ได้จัดส่ง')
                                  : 'คลิกที่นี่! ' + order.expressName}
                              </a>
                            </td>
                          </tr>;
                        })
                        }
                      </tbody>
                    </table>
                  )
                }
              </div>
            </div>
            <div className="columns is-hidden-tablet">
              <div className="column is-10 is-offset-1">
                {this.state.searchList.map((order, i) => {
                  const d = order.cutoffDate.substr(0, 4) + '-' + order.cutoffDate.substr(4, 2) + '-' + order.cutoffDate.substr(6, 2);
                  const color = (
                    order.expressName == 'KERRY' ? 'warning' : (
                      order.expressName == 'EMS' ? 'danger' : 'success'
                    )
                  )
                  return <div key={order.id} className="box content">
                    <article className="post">
                      <h3>
                        <a className={`button is-link is-${color}`} href={order.expressLink + (order.expressName == 'KERRY' ? '=' + order.tracking : '')} target="_blank">
                          {!order.expressName ?
                            (order.cutoff ? 'จัดส่งแล้ว' : 'ยังไม่ได้จัดส่ง')
                            : 'คลิกที่นี่! ' + order.expressName}
                        </a>
                        <span className="tag is-medium">{order.tracking == '' ? (order.cutoff ? 'กำลังนำเลขพัสดุเข้าสู่ระบบ' : 'กำลังจัดเตรียมสินค้า') : order.tracking}</span>
                      </h3>
                      <h4>{order.name}</h4>

                      <div className="media">
                        <div className="media-left">
                          <p className="has-text-grey-light">{order.id}</p>
                        </div>
                        <div className="media-content">
                          <div className="content">
                            <span className="has-text-grey">{moment(d).format('Do MMM YY')}</span>
                          </div>
                        </div>
                        <div className="media-right">
                          <span className="has-text-weight-bold">฿{Money(order.price, 0)}</span>
                        </div>
                      </div>
                    </article>
                  </div>;
                })}
              </div>
            </div>
            {
              this.state.alert && (
                <div className="columns">
                  <div className="column is-4 is-offset-4">
                    <div className="notification is-danger">
                      <button className="delete" onClick={this.onAlertCloseClick}></button>
                      <h2>ไม่พบข้อมูล <strong>{this.state.alert}</strong></h2>
                      กรุณาตรวจสอบรหัสสั่งซื้อ/เบอร์โทรศัพท์
                </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div >
      // </div>
    )
  }
}
const mapStateToProps = (state, props) => ({
  searchList: state.search
});
const mapDispatchToProps = (dispatch, props) => ({
  startSearchTracking: (search) => dispatch(startSearchTracking(search))
});
export default connect(mapStateToProps, mapDispatchToProps)(TrackingPage);