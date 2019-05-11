import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import MdMailOutline from 'react-icons/lib/md/mail-outline';
import MdAlarmOn from 'react-icons/lib/md/alarm-on';
import FaSearch from 'react-icons/lib/fa/search';
import FaHome from 'react-icons/lib/fa/home';
import FaFileTextO from 'react-icons/lib/fa/file-text-o';
import MdPanTool from 'react-icons/lib/md/pan-tool';
import MdAttachMoney from 'react-icons/lib/md/attach-money';
import MdEdit from 'react-icons/lib/md/edit';
import MdDesktopWindows from 'react-icons/lib/md/desktop-windows';
export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenu: false,
      isBurger: false,
      auth: props.auth
    };
  }
  toggleIsMenu = () => {
    this.setState(() => ({
      isMenu: !this.state.isMenu
    }))
  };
  toggleIsBurger = () => {
    this.setState(() => ({
      isBurger: !this.state.isBurger
    }))
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth != this.state.auth) {
      this.setState({ auth: nextProps.auth });
    }
  };
  render() {
    const color = { color: '#333' };
    const borderRadius = { borderRadius: '25px' }
    // console.log(this.state.isAdmin)
    const yyyymmdd = () => {
      function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
      var now = new Date();
      return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());
    }

    return (
      <div>
        <nav className="navbar is-dark">
          <div className="container">
            <div className="navbar-brand">
              <Link className="navbar-item brand-text" to="/home">JAOYING SHOP</Link>
              <div data-target="navMenu" onClick={this.toggleIsBurger}
                className={this.state.isBurger === true ? "navbar-burger burger is-active" : "navbar-burger burger"}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div id="navMenu" className={this.state.isBurger === true ? "navbar-menu is-active" : "navbar-menu"}>
              <div className="navbar-start">
                <Link className="navbar-item" to="/home">
                  <span className="icon"><FaHome /></span>หน้าแรก
                </Link>
                <Link className="navbar-item" to="/">
                  <span className="icon"><FaSearch /></span>ค้นหาพัสดุ
                </Link>
                < Link className="navbar-item" to="/cutoff">
                  <span className="icon"><MdAlarmOn /></span>ปิดรอบ
                    </Link>
                <div className="navbar-item has-dropdown is-hoverable">
                  <a className="navbar-link">Live</a>
                  <div className="navbar-dropdown">
                    <Link className="navbar-item" to="/live/edit">
                      <span className="icon"><MdEdit /></span>แก้ไข
                  </Link>
                    <a className="navbar-item" href="/live/show" target="_blank">
                      <span className="icon"><MdDesktopWindows /></span>แสดง
                  </a>
                  </div>
                </div>
                {/* <Link className="navbar-item" to="/orders">
                  <span className="icon"><MdMailOutline /></span>เลขพัสดุ
                  </Link> */}
                <Link className="navbar-item" to="/report">
                  <span className="icon"><FaFileTextO /></span>รายงาน
                  </Link>
                <a className="navbar-item is-hidden-desktop" onClick={this.props.startLogout}>
                  ออกจากระบบ
                    </a>
              </div>
              <div className="navbar-end is-hidden-touch">
                <div className={this.state.isMenu === true ? "navbar-item has-dropdown is-active" : "navbar-item has-dropdown"}>
                  <a className="navbar-link" onClick={this.toggleIsMenu}>
                    &nbsp;{this.props.auth.email}
                  </a>
                  <div className="navbar-dropdown">
                    {/* <hr className="navbar-divider" /> */}
                    <a className="navbar-item" onClick={this.props.startLogout}>
                      ออกจากระบบ
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav >
        {/* <section className="hero">
          <div className="hero-body is-marginless is-bold">
            <div className="container">
              <h1 className="title">{this.state.title}</h1>
            </div>
          </div>
        </section> */}
      </div >
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth
});
const mapDispatchToProps = (dispatch) => {
  return {
    startLogout: () => dispatch(startLogout())
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
