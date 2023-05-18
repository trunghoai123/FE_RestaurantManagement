import React, { useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { colors } from "../variables";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LoginForm from "components/Login/LoginForm";
import SignupForm from "components/Login/SignupForm";
import { useAuthContext } from "utils/context/AuthContext";
import { enqueueSnackbar } from "notistack";
import { useFormStateContext } from "utils/context/FormStateContext";

const HeaderStyles = styled.div`
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
    .close__icon {
      display: none;
    }
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
    .link__container {
      height: 100%;
      display: flex;
      align-items: center;
      width: 120px;
      &.mobile {
        display: none;
      }
      &.logo__container {
        left: 20px;
        top: 0px;
        position: absolute;
      }
      .navlink {
        line-height: 54px;
        width: 100%;
        height: 100%;
        font-weight: 300;
        display: flex;
        justify-content: center;
        color: white;
        text-transform: uppercase;
        text-decoration: none;
        &.image__container {
          height: 100%;
        }
        &:hover {
          color: white;
        }
        .logo__image {
          height: 100%;
        }
      }
      &.external__links {
        column-gap: 8px;
        justify-content: center;
        .link__external {
          .external__link {
            color: white;
            font-size: 18px;
            :hover {
              color: white;
            }
          }
        }
        .btn__login {
          font-size: 12px;
          cursor: pointer;
          :hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  @media screen and (max-width: 889px) {
    height: 100vh;
    width: 200px;
    left: -200px;
    transition: all ease 250ms;
    ${(props) =>
      props.display
        ? css`
            left: 0px;
          `
        : css``};
    .navbar__list {
      display: block;
      .close__icon {
        position: absolute;
        top: 0px;
        /* right: 0px; */
        width: 32px;
        right: -32px;
        height: 32px;
        font-size: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${colors.gold_1};
      }
      .profile__container {
        display: none;
        position: absolute;
        left: 40px;
        bottom: 20px;
        transform: translateY(0);
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
      .link__container {
        height: auto;
        display: flex;
        align-items: center;
        width: 120px;
        &.mobile {
          display: block;
        }
        &.logo__container {
          left: 20px;
          top: 0px;
          position: absolute;
        }
        .navlink {
          line-height: 54px;
          width: 100%;
          height: 100%;
          font-weight: 300;
          display: flex;
          justify-content: center;
          color: white;
          text-transform: uppercase;
          text-decoration: none;
          &.image__container {
            height: 100%;
          }
          &:hover {
            color: white;
          }
          .logo__image {
            display: none;
          }
        }
        &.external__links {
          column-gap: 8px;
          justify-content: center;
          .link__external {
            .external__link {
              color: white;
              font-size: 18px;
              :hover {
                color: white;
              }
            }
          }
          .btn__login {
            font-size: 12px;
            cursor: pointer;
            :hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
`;

const Header = (props) => {
  const { user, updateAuthUser } = useAuthContext();
  const navigation = useNavigate();
  const { openSignIn, setOpenSignIn, openSignUp, setOpenSignUp, navbarState, setNavbarState } =
    useFormStateContext();
  const handleLogout = () => {
    updateAuthUser(null);
    enqueueSnackbar("Đã đăng xuất", {
      variant: "success",
    });
    navigation("/");
  };
  useEffect(() => {
    if (user?.LoaiTaiKhoan === 1 || user?.LoaiTaiKhoan === 2) {
      navigation("/admin");
    }
  });
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
  return (
    <HeaderStyles display={navbarState}>
      <div className="navbar__list">
        <span className="close__icon" onClick={() => setNavbarState((oldState) => !oldState)}>
          {navbarState ? (
            <i className="fa-solid fa-xmark"></i>
          ) : (
            <i className="fa-solid fa-list-ul"></i>
          )}
        </span>
        <div className="link__container logo__container">
          <NavLink className="navlink image__container" to={"/"}>
            <img className="logo__image" src="/images/logo.png" alt="logo" />
          </NavLink>
        </div>
        <div className="link__container">
          <NavLink className="navlink" to={"/"}>
            Trang Chủ
          </NavLink>
        </div>
        <div className="link__container">
          <NavLink className="navlink" to={"dishes"}>
            Thực Đơn
          </NavLink>
        </div>
        <div className="link__container">
          <NavLink className="navlink" to={"room"}>
            Phòng
          </NavLink>
        </div>
        <div className="link__container">
          <NavLink className="navlink" to={"posts"}>
            Bài viết
          </NavLink>
        </div>
        {user && (
          <>
            <div className="link__container">
              <NavLink className="navlink" to={"orders"}>
                Phiếu Đặt
              </NavLink>
            </div>
            <div className="link__container mobile">
              <NavLink className="navlink" to={"profile"}>
                Tài khoản
              </NavLink>
            </div>
            <div className="link__container mobile">
              <span className="navlink" onClick={handleLogout}>
                Đăng xuất
              </span>
            </div>
          </>
        )}
        <div className="link__container external__links">
          <span className="link__external">
            <a className="external__link" href="/">
              <i className="fa-brands fa-square-youtube"></i>
            </a>
          </span>
          <span className="link__external">
            <a className="external__link" href="/">
              <i className="fa-brands fa-square-facebook"></i>
            </a>
          </span>
          <span className="link__external">
            <a className="external__link" href="/">
              <i className="fa-brands fa-twitter"></i>
            </a>
          </span>
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
              <img className="img__profile" src="/images/VIP_room.jpg" alt="" />
              <div className="menu__hovered">
                <div className="menu__list">
                  <Link to={"/profile"} className="menu__item">
                    Thông tin tài khoản
                  </Link>
                  <Link to={"/orders"} className="menu__item">
                    Phiếu đặt
                  </Link>
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
    </HeaderStyles>
  );
};

Header.propTypes = {};

export default Header;
