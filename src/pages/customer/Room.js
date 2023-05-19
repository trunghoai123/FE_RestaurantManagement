import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "../../variables";
import { Link } from "react-router-dom";

const RoomStyles = styled.div`
  padding: 54px 0px 0px 0px;
  .main__image {
    height: 400px;
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("https://luxurypalace.vn/wp-content/uploads/2019/12/1I7A5559-scaled.jpg");
    position: relative;
    .overlay {
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      background-color: rgba(0, 0, 0, 0.4);
    }
    .heading__title {
      bottom: 50%;
      left: 50%;
      transform: translateX(-50%);
      position: absolute;
      text-align: center;
      color: white;
      font-size: 30px;
      font-weight: 500;
      letter-spacing: 2px;
    }
  }
  .main__section {
    padding: 40px;
    .lobbies {
      display: flex;
      column-gap: 50px;
      .lobby__selection {
        .lobby__option {
          width: 250px;
          text-align: center;
          padding: 16px 0px 16px 0px;
          border: 2px solid ${colors.gold_1};
          margin-bottom: 10px;
          user-select: none;
          cursor: pointer;
          :hover {
            background-color: ${colors.gold_1};
            color: white;
            transition: all ease 300ms;
          }
          &.active {
            background-color: ${colors.gold_1};
            color: white;
            transition: all ease 300ms;
          }
        }
      }
      .lobby__slides {
        flex: 1;
        .lobby__item {
          height: 500px;
          .lobby__image {
            height: 100%;
            width: 100%;
            .lobby__img {
              max-height: 100%;
              object-fit: cover;
              width: 100%;
            }
          }
        }
      }
    }
    .lobby__details {
      padding: 40px;
      .lobby__name {
        font-size: 28px;
        color: ${colors.gold_1};
        margin-bottom: 20px;
      }
    }
    .button__container {
      display: flex;
      justify-content: center;
      .btn__room {
        text-decoration: none;
        color: black;
        padding: 8px 80px;
        cursor: pointer;
        background-color: white;
        border: 2px solid ${colors.gold_1};
        :hover {
          transition: all ease 150ms;
          background-color: ${colors.gold_1};
          color: white;
        }
      }
    }
  }
  @media screen and (max-width: 889px) {
    padding: 0px 0px 0px 0px;
    .main__image {
      height: 400px;
      width: 100%;
      position: relative;
      .overlay {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background-color: rgba(0, 0, 0, 0.4);
      }
      .heading__title {
        bottom: 50%;
        left: 50%;
        transform: translateX(-50%);
        position: absolute;
        text-align: center;
        color: white;
        font-size: 30px;
        font-weight: 500;
        letter-spacing: 2px;
      }
    }
    .main__section {
      padding: 40px;
      .lobbies {
        display: block;
        column-gap: 50px;
        .lobby__selection {
          display: flex;
          .lobby__option {
            width: 250px;
            text-align: center;
            padding: 16px 0px 16px 0px;
            border: 2px solid ${colors.gold_1};
            margin-bottom: 10px;
            user-select: none;
            cursor: pointer;
            :hover {
              background-color: ${colors.gold_1};
              color: white;
              transition: all ease 300ms;
            }
            &.active {
              background-color: ${colors.gold_1};
              color: white;
              transition: all ease 300ms;
            }
          }
        }
        .lobby__slides {
          flex: 1;
          .lobby__item {
            height: 500px;
            .lobby__image {
              height: 100%;
              width: 100%;
              .lobby__img {
                max-height: 100%;
                object-fit: cover;
                width: 100%;
              }
            }
          }
        }
      }
      .lobby__details {
        padding: 40px;
        .lobby__name {
          font-size: 28px;
          color: ${colors.gold_1};
          margin-bottom: 20px;
        }
      }
      .button__container {
        display: flex;
        justify-content: center;
        .btn__room {
          text-decoration: none;
          color: black;
          padding: 8px 80px;
          cursor: pointer;
          background-color: white;
          border: 2px solid ${colors.gold_1};
          :hover {
            transition: all ease 150ms;
            background-color: ${colors.gold_1};
            color: white;
          }
        }
      }
    }
  }
`;
const Room = (props) => {
  const [selection, setSelection] = useState(0);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <RoomStyles>
      <div className="main__image">
        <div className="overlay"></div>
        <div className="heading__title">PHÒNG</div>
      </div>
      <div className="main__section">
        <div className="lobbies">
          <div className="lobby__selection">
            <div
              className={`lobby__option ${selection === 0 ? "active" : ""}`}
              onClick={() => setSelection(0)}
            >
              Phòng VIP
            </div>
            <div
              className={`lobby__option ${selection === 1 ? "active" : ""}`}
              onClick={() => setSelection(1)}
            >
              Phòng Thường
            </div>
            <div
              className={`lobby__option ${selection === 2 ? "active" : ""}`}
              onClick={() => setSelection(2)}
            >
              Phòng Ăn
            </div>
          </div>
          <div className="lobby__slides">
            <div className="lobby__item">
              <div className="lobby__image">
                <img
                  className="lobby__img"
                  src={
                    selection === 0
                      ? "/images/VIP_room.jpg"
                      : selection === 1
                      ? "/images/normal_room_1.jpg"
                      : "/images/eating_room.jpg"
                  }
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        {selection === 0 ? (
          <div className="lobby__details">
            <div className="lobby__name">PHÒNG VIP</div>
            Phòng VIP được trang bị đầy đủ các tiện nghi, giúp khách hàng có những trải nghiệm sang
            trọng và riêng tư nhất mà không phải lo người xung quanh, phòng được bày trí cực kỳ sang
            trọng theo phong cách châu âu, có thể bày trí theo yêu cầu của khách hàng. có các phòng
            kích thước từ nhỏ đến lớn cho khách hàng lựa chọn.
          </div>
        ) : selection === 1 ? (
          <div className="lobby__details">
            <div className="lobby__name">PHÒNG THƯỜNG</div>
            Phòn được trang bị đầy đủ các tiện nghi, giúp khách hàng có những trải nghiệm sang trọng
            và riêng tư nhất mà không phải lo người xung quanh, phòng được bày trí cực kỳ sang trọng
            theo phong cách châu âu. có các phòng kích thước từ nhỏ đến lớn cho khách hàng lựa chọn.
          </div>
        ) : (
          <div className="lobby__details">
            <div className="lobby__name">PHÒNG ĂN</div>
            Phòng ăn rộng rãi, thoáng mắt với không gian mở, giúp khách hàng có những trải nghiệm
            vui vẻ nhất, phòng được bày trí đẹp đẽ, thoáng mát và không kém phần lịch sự trọng theo
            phong cách châu âu. .
          </div>
        )}
        <div className="button__container">
          <Link to={"/dishes"} className="btn__room">
            ĐẶT BÀN NGAY
          </Link>
        </div>
      </div>
    </RoomStyles>
  );
};

Room.propTypes = {};

export default Room;
