import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigation } from "react-router-dom";
import styled from "styled-components";
import { colors, kinds } from "variables";
import axiosClient from "utils/axios";
import ReactPaginate from "react-paginate";
import { CaretLeft, CaretRight, CartPlus } from "react-bootstrap-icons";
import Search from "components/Search";
import BookingModal from "components/Modal/BookingModal";
import Cart from "components/Cart/Cart";
import { useDispatch, useSelector } from "react-redux";
import { addToCartById, reloadTotalMoney, setTotalMoney } from "store/cart/cartSlice";
import { useAuthContext } from "utils/context/AuthContext";
import { useFormStateContext } from "utils/context/FormStateContext";
import { getAllDish, getAllTypeOfDish, getMenuByAll } from "utils/api";
import { convertToVND } from "utils/utils";
import DishViewDetails from "components/Dish/DishViewDetails";
const DishesStyles = styled.div`
  padding-top: 54px;
  .top__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${colors.light_gray_1};
    padding: 0px 40px 0px 30px;
  }
  .main__container {
    padding: 0px 40px;
    display: flex;
    column-gap: 14px;
    background-color: ${colors.light_gray_1};

    .left__container {
      width: 300px;
      background-color: white;
      height: 800px;
      overflow-y: auto;
      ::-webkit-scrollbar {
        width: 10px;
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
      .all__type {
        padding: 10px 10px 10px 20px;
        text-decoration: underline;
        cursor: pointer;
        user-select: none;
        &.active {
          color: ${colors.gold_1};
        }
      }
      .filter__kind {
        padding: 0 20px 20px 20px;
        column-count: 2;
        column-gap: 10px;
        .kind__container {
          margin-bottom: 10px;
          border: solid 2px ${colors.gray_1};
          padding: 4px;
          :hover {
            border: solid 2px ${colors.gold_1};
            transition: all ease 150ms;
          }
          &.active {
            border: solid 2px ${colors.gold_1};
            transition: all ease 150ms;
          }
          .kind__item {
            position: relative;
            cursor: pointer;
            user-select: none;
            :hover {
              .kind__item--name {
                color: ${colors.gold_1};
                transition: all ease 150ms;
              }
            }
            .kind__image {
              width: 100%;
              height: 60px;
              object-fit: cover;
            }
            .kind__item--name {
              position: absolute;
              text-align: center;
              color: white;
              bottom: 0;
              left: 0;
              right: 0;
              z-index: 1;
            }
            .overlay {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              top: 0;
              background-color: rgba(0, 0, 0, 0.3);
            }
          }
        }
      }
    }
    .right__container {
      padding: 20px;
      flex: 1;
      background-color: white;
      /* height: 800px; */
      /* overflow-y: auto; */
      /* ::-webkit-scrollbar {
        width: 10px;
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
      } */
      .dishes__container {
        display: flex;
        flex-wrap: wrap;
        .dish {
          user-select: none;
          width: 25%;
          min-width: 200px;
          .dish__container {
            position: relative;
            padding: 10px;
            :hover {
              transform: translateY(-6px);
              transition: all ease 150ms;
            }
            .img__container {
              overflow: hidden;
              position: relative;
              .img {
                object-fit: cover;
                height: 180px;
                width: 100%;
              }
              .overlay {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 0px;
                box-shadow: 0px 0px 60px 35px black;
              }
              ::before {
                content: "";
                position: absolute;
                top: 0;
                width: 100%;
                height: 0px;
                box-shadow: 0px 0px 35px 10px black;
              }
              .add__container {
                z-index: 2;
                padding: 6px;
                background-color: ${colors.orange_2};
                position: absolute;
                top: 0px;
                right: 0px;
                transition: all ease 150ms;
                :hover {
                  background-color: ${colors.orange_2_hover};
                }
                .icon__add {
                  color: white;
                }
              }
            }
            .dish__name {
              width: calc(100% - 20px);
              padding: 2px;
              color: white;
              position: absolute;
              bottom: 10px;
              left: 10px;
              text-align: center;
            }
            .dish__price {
              z-index: 1;
              width: calc(100% - 20px);
              padding: 2px;
              color: white;
              position: absolute;
              top: 10px;
              left: 10px;
              font-size: 14px;
              /* text-align: center; */
            }
          }
        }
      }
      .pagination__container {
        user-select: none;
        .pagination__list {
          background-color: ${colors.orange_1};
          padding: 8px;
          margin-left: 10px;
          margin-right: 10px;
          display: flex;
          justify-content: center;
          align-items: center;

          > li {
            margin: 0 2px;
            border-radius: 4px;
            list-style-type: none;
            color: white;
            font-weight: 500;
            /* display: flex;
            align-items: center; */
            &.selected {
              background-color: ${colors.light_gray_1};
              color: ${colors.orange_1};
            }

            > a {
              display: flex;
              justify-content: center;
              transition: all ease 150ms;
              align-items: center;
              height: 40px;
              width: 34px;
              display: inline-block;
              display: flex;
              align-items: center;
              :hover {
                border-radius: 4px;
                background-color: ${colors.light_gray_1};
                color: ${colors.gold_1};
              }
            }
            &.disabled {
              color: gray;
              a {
                background-color: ${colors.orange_1};
                color: ${colors.gray_1};
                :hover {
                  background-color: ${colors.orange_1};
                  color: ${colors.gray_1};
                }
              }
            }
          }
        }
      }
    }
  }
`;
const itemsPerPage = 8;
const Dishes = (props) => {
  const [showForm, setShowForm] = useState(false);
  const handleCloseForm = () => setShowForm(false);
  const [dishes, setDishes] = useState();
  const [dishTypes, setDishTypes] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const [isViewingDish, setIsViewingDish] = useState(null);
  const [filter, setFilter] = useState({
    search: "",
    kindOfDish: "",
  });
  const { cartItems, totalMoney } = useSelector((state) => state.cart);
  // const [total, setTotal] = useState(0);
  const { user, updateAuthUser } = useAuthContext();
  const { openSignIn, setOpenSignIn, openSignUp, setOpenSignUp } = useFormStateContext();
  const endOffset = itemOffset + itemsPerPage;
  // useEffect(() => {
  let currentItems = [];
  let pageCount = 0;
  if (dishes && dishes?.length > 0) {
    currentItems = dishes.slice(itemOffset, endOffset);
    pageCount = Math.ceil(dishes.length / itemsPerPage);
  }
  // });
  const handleShowModal = () => {
    setShowForm(true);
  };
  useEffect(() => {
    (async () => {
      try {
        // {TenMon,GiaMon , DonViTinh , MoTa , MaLoai }
        const result = await getMenuByAll({ TenMon: filter.search, MaLoai: filter.kindOfDish });
        if (result?.data) {
          setDishes(result.data);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    })();
  }, [filter]);
  useEffect(() => {
    // console.log(cartItems);
    // if (cartItems && cartItems.length > 0) {
    //   console.log("running useEffect");
    //   let sum = 0;
    //   cartItems.forEach((item) => {
    //     sum += item.GiaMon * item.SoLuong;
    //     setTotalMoney(sum);
    //   });
    // }
    dispatch(reloadTotalMoney());
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const result = await getAllTypeOfDish();
        if (result?.data) {
          setDishTypes(result?.data || []);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    })();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const result = await getAllDish();
        if (result?.data) {
          setDishes(result?.data || []);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    })();
  }, []);

  const handleAddToCart = (e, id) => {
    e.preventDefault();
    dispatch(addToCartById(id)).then((data) => {});
    if (isViewingDish) {
      setIsViewingDish(null);
    }
  };

  const hanleClickOnDish = (e, dish) => {
    e.preventDefault();
    setIsViewingDish(dish);
  };

  const handleCloseView = () => {
    setIsViewingDish(null);
  };

  const handleTypeSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleClickSearch = (e) => {
    setItemOffset(0);
    setFilter((oldVal) => {
      return { ...oldVal, search };
    });
  };
  const handleClickKind = (id) => {
    setItemOffset(0);
    setFilter((oldVal) => {
      return { ...oldVal, search: "", kindOfDish: id };
    });
    setSearch("");
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % dishes.length;
    setItemOffset(newOffset);
  };
  const onPageActive = (number) => {
    const newOffset = (number.selected * itemsPerPage) % dishes.length;
    setItemOffset(newOffset);
  };
  return (
    <DishesStyles>
      {showForm && (
        <BookingModal cartItems={cartItems} handleCloseForm={handleCloseForm}></BookingModal>
      )}
      {isViewingDish && (
        <DishViewDetails
          addToCart={handleAddToCart}
          dish={isViewingDish}
          handleClose={handleCloseView}
        ></DishViewDetails>
      )}
      <div className="top__actions">
        <Search
          value={search}
          onClickSearch={handleClickSearch}
          onChange={handleTypeSearch}
          placeholder="Tìm Kiếm"
        ></Search>
      </div>
      <div className="main__container">
        <Cart total={totalMoney} cartList={cartItems} handleShowModal={handleShowModal}></Cart>
        <div className="left__container">
          <div
            className={`all__type ${filter?.kindOfDish || "active"}`}
            onClick={() => handleClickKind("")}
          >
            Tất cả
          </div>
          <div className="filter__kind">
            {dishTypes.map((kind) => {
              return (
                <div
                  onClick={() => handleClickKind(kind?._id)}
                  key={kind?._id}
                  className={`kind__container ${filter?.kindOfDish === kind?._id ? "active" : ""}`}
                >
                  <div className="kind__item">
                    <img src={kind?.HinhAnh} className="kind__image" alt="" />
                    <div className="kind__item--name">{kind?.TenLoai}</div>
                    <div className="overlay"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="right__container">
          <div className="dishes__container">
            {currentItems?.map((dish) => {
              return (
                <Link
                  onClick={(e) => hanleClickOnDish(e, dish)}
                  to={`/dish/${dish?._id}`}
                  key={dish?._id}
                  className="dish"
                >
                  <div className="dish__container">
                    <div className="img__container">
                      <img src={dish?.HinhAnh} className="img" alt={dish?.name} />
                      <div className="overlay"></div>
                      <div
                        className="add__container"
                        onClick={(e) => handleAddToCart(e, dish?._id)}
                      >
                        <CartPlus className="icon__add"></CartPlus>
                      </div>
                    </div>
                    <div className="dish__name">{dish?.TenMon}</div>
                    <div className="dish__price">{convertToVND(dish?.GiaMon)}</div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="pagination__container">
            {dishes?.length > 0 && (
              <ReactPaginate
                onPageActive={onPageActive}
                onPageChange={handlePageClick}
                className="pagination__list"
                breakLabel="..."
                previousLabel={<CaretLeft></CaretLeft>}
                pageRangeDisplayed={3}
                nextLabel={<CaretRight></CaretRight>}
                pageCount={pageCount}
                renderOnZeroPageCount={null}
              />
            )}
          </div>
        </div>
      </div>
    </DishesStyles>
  );
};

Dishes.propTypes = {};

export default Dishes;
