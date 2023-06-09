import React, { useContext, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LoginForm from "components/Login/LoginForm";
import SignupForm from "components/Login/SignupForm";
import { useDispatch } from "react-redux";
import { useAuthContext } from "utils/context/AuthContext";
import { enqueueSnackbar } from "notistack";
import { useFormStateContext } from "utils/context/FormStateContext";
import { colors } from "variables";
import NavbarItem from "components/Navbar/NavbarItem";

const AdminHeaderStyles = styled.div`
  position: fixed;
  width: 100%;
  z-index: 111;
  height: 54px;
  font-size: 15px;
  background-color: ${colors.gold_1};
  user-select: none;
  .navbar__list {
    position: relative;
    height: 100%;
    display: flex;
    justify-content: center;
    color: white;
    .profile__container {
      position: absolute;
      right: 40px;
      top: 50%;
      transform: translateY(-50%);
      .img__container {
        width: 44px;
        position: relative;
        padding-bottom: 5px;
        .img__profile {
          width: 100%;
          border: 2px solid whiteSmoke;
          aspect-ratio: 1/1;
          object-fit: cover;
          border-radius: 50%;
          cursor: pointer;
          position: relative;
        }
        .menu__hovered {
          transition: all ease 150ms;
          background-color: white;
          color: black;
          display: none;
          position: absolute;
          top: 100%;
          right: 0%;
          width: 160px;
          box-shadow: 3px 3px 5px 1px rgba(0, 0, 0, 0.6);
          .menu__list {
            .menu__item {
              text-decoration: none;
              color: black;
              display: block;
              padding: 10px;
              cursor: pointer;
              :hover {
                background-color: lightGray;
              }
            }
          }
        }
        :hover {
          .menu__hovered {
            display: block;
          }
        }
      }
    }
    .list__link__container {
      background-color: ${(props) => colors.gold_1_blur};
      position: absolute;
      left: 0px;
      height: 100vh;
      width: 250px;
      transition: all ease 300ms;
      /* overflow-y: auto; */
      &.hidden {
        left: -250px;
      }
      .icon__toggle__container {
        position: absolute;
        top: 0px;
        right: -54px;
        font-size: 20px;
        width: 54px;
        height: 54px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        background-color: ${(props) => colors.gold_1};
        :hover {
          background-color: ${(props) => colors.gold_1_blur};
        }
      }
      .nav__list__container {
        height: 100%;
        width: 100%;
        overflow: auto;

        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: lightgrey;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: #888;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      }
    }
  }
`;

const adminNavbarItems = [
  {
    title: "Nhân viên",
    id: 1,
    subNavs: [
      {
        id: 1,
        title: "Tạo phiếu đặt",
        to: "order/add",
      },
      {
        id: 2,
        title: "Tạo hóa đơn",
        to: "invoice/add",
      },
      {
        id: 3,
        title: "Quản lý nhân viên",
        to: "employee",
      },
    ],
  },
  {
    title: "Khu vực",
    id: 2,
    subNavs: [
      {
        id: 1,
        title: "Tìm kiếm",
        to: "area/search",
      },
      {
        id: 2,
        title: "Cập nhật",
        to: "area/update",
      },
    ],
  },
  {
    title: "Phòng",
    id: 3,
    subNavs: [
      {
        id: 1,
        title: "Tìm kiếm",
        to: "room/search",
      },
      {
        id: 2,
        title: "Cập nhật",
        to: "room/update",
      },
    ],
  },
  {
    title: "Bàn",
    id: 4,
    subNavs: [
      {
        id: 1,
        title: "Tìm kiếm",
        to: "table/search",
      },
      {
        id: 2,
        title: "Cập nhật",
        to: "table/update",
      },
    ],
  },
  {
    title: "Thực đơn",
    id: 5,
    subNavs: [
      {
        id: 1,
        title: "Tìm kiếm",
        to: "dish/search",
      },
      {
        id: 2,
        title: "Cập nhật",
        to: "dish/update",
      },
      {
        id: 3,
        title: "Thống kê món bán chạy",
        to: "dish/statistic",
      },
    ],
  },
  {
    title: "Phiếu đặt",
    id: 6,
    subNavs: [
      {
        id: 1,
        title: "Tìm kiếm",
        to: "order/search",
      },
      {
        id: 2,
        title: "Cập nhật",
        to: "order/update",
      },
    ],
  },
  {
    title: "Hóa Đơn",
    id: 7,
    subNavs: [
      {
        id: 1,
        title: "Tìm kiếm",
        to: "invoice/search",
      },
      {
        id: 2,
        title: "Cập nhật",
        to: "invoice/update",
      },
      {
        id: 3,
        title: "Thống kê doanh thu",
        to: "invoice/statistic",
      },
    ],
  },
  {
    title: "Bài viết",
    id: 8,
    subNavs: [
      {
        id: 1,
        title: "Quản lý loại bài viết",
        to: "post/manage-type-post",
      },
      {
        id: 2,
        title: "Quản lý bài viết",
        to: "post/manage-post",
      },
    ],
  },
  // {
  //   title: "Tài Khoản",
  //   subNavs: [],
  // },
];

const AdminHeader = (props) => {
  const { user, updateAuthUser } = useAuthContext();
  const {
    openSignIn,
    setOpenSignIn,
    openSignUp,
    setOpenSignUp,
    adminNavbarState,
    setAdminNavbarState,
  } = useFormStateContext();
  // const navigation = useNavigate();
  const handleLogout = () => {
    updateAuthUser(null);
    enqueueSnackbar("Đã đăng xuất", {
      variant: "success",
    });
    // navigation("/");
    window.location.href = "/";
  };
  const handleToggleAdminNavbar = () => {
    setAdminNavbarState((oldState) => {
      return { ...oldState, isOpen: !oldState.isOpen };
    });
  };
  const handleSignIn = () => {
    setOpenSignIn(true);
  };
  const handleCloseLoginForm = () => {
    setOpenSignIn(false);
  };
  const handleSignup = () => {
    setOpenSignUp(true);
  };
  const handleCloseSignupForm = () => {
    setOpenSignUp(false);
  };
  console.log(user);
  return (
    <AdminHeaderStyles>
      <div className="navbar__list">
        <div className={`list__link__container ${adminNavbarState?.isOpen ? "" : "hidden"}`}>
          <div className="icon__toggle__container" onClick={handleToggleAdminNavbar}>
            {adminNavbarState?.isOpen ? (
              <i className="fa-solid fa-xmark"></i>
            ) : (
              <i className="fa-solid fa-list-ul"></i>
            )}
          </div>
          <div className="nav__list__container">
            {adminNavbarItems.map((navItem) => {
              return <NavbarItem key={navItem?.id} navItem={navItem}></NavbarItem>;
            })}
          </div>
          {/* <div className="link__container menu__list">
            <span className="navlink" to={"/admin/area"}>
              Khu vực
              <div className="down__icon__container">
                <i className="fa-solid fa-caret-down"></i>
              </div>
            </span>
            <div className="sublinks__container">
              <NavLink className="sublink">Tìm kiếm</NavLink>
              <NavLink className="sublink">Cập nhật</NavLink>
            </div>
          </div>
          <div className="link__container">
            <span className="navlink" to={"/admin/room"}>
              Phòng
            </span>
          </div>
          <div className="link__container">
            <span className="navlink" to={"/admin/table"}>
              Bàn
            </span>
          </div>
          <div className="link__container">
            <span className="navlink" to={"/admin/booking"}>
              Đặt Bàn
            </span>
          </div>
          <div className="link__container">
            <span className="navlink" to={"/admin/blog"}>
              Tài khoản
            </span>
          </div> */}
        </div>
        <div className="profile__container">
          {!user && (
            <div className="link__container external__links">
              <span className="btn__login" onClick={handleSignup}>
                Đăng ký
              </span>
              <span className="btn__login" onClick={handleSignIn}>
                Đăng nhập
              </span>
            </div>
          )}
          {user && (
            <div className="img__container">
              <img className="img__profile" src={user?.HinhAnh} alt="" />
              <div className="menu__hovered">
                <div className="menu__list">
                  {/* <Link to={"/profile"} className="menu__item">
                    Thông tin tài khoản
                  </Link>
                     <Link to={"/"} className="menu__item">
                    Phiếu đặt
                  </Link> */}
                  <span onClick={handleLogout} className="menu__item">
                    Đăng xuất
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {openSignIn && <LoginForm handleCloseForm={handleCloseLoginForm}></LoginForm>}
      {openSignUp && <SignupForm handleCloseForm={handleCloseSignupForm}></SignupForm>}
    </AdminHeaderStyles>
  );
};

AdminHeader.propTypes = {};

export default AdminHeader;
