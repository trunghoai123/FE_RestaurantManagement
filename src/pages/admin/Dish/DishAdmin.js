import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "components/Button/Button";
import { colors } from "variables";
import DropdownManage from "components/Dopdown/ButtonDropDown";
import Search from "components/Search";
import axiosClient from "utils/axios";
import { deleteDishById, deleteRoomById, getAllDish, getAllRoom } from "utils/api";
import RoomUpdateForm from "components/Room/RoomUpdateForm";
import { confirmAlert } from "react-confirm-alert";
import { enqueueSnackbar } from "notistack";
import DishUpdateForm from "components/Dish/DishUpdateForm";
import { convertToVND } from "utils/utils";

const DishAdminStyles = styled.div`
  padding-top: 54px;
  .top__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
  }
  .main__table {
    .table__head--container {
      .table__row {
        .table__head {
        }
      }
    }
    .table__body {
      .table__row {
        .table__data {
          width: 200px;
          overflow-wrap: break-word;
          &.item__id {
            width: 100px;
            max-width: 100px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          &.data__image {
            width: 200px;
            .img__container {
              width: 100%;
              .data__img {
                margin: 0px;
                object-fit: cover;
                width: 150px;
                height: 80px;
              }
            }
          }
          .button {
            margin: 0px 0px 12px 8px;
            &.button__update {
            }
            &.button__remove {
            }
            .text {
            }
            .icon__item {
              margin-left: 6px;
            }
          }
        }
      }
    }
  }
`;

const DishAdmin = (props) => {
  const [dishs, setRoms] = useState();
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [mode, setMode] = useState({ mode: 0, id: null });
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const result = await getAllDish();
        if (result?.data) {
          setRoms(result.data);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    };
    fetchRooms();
  }, [mode]);
  const handleOpenUpdate = (id) => {
    if (id) {
      setMode({ id, mode: 1 });
    } else {
      setMode({ id: null, mode: 2 });
    }
    setOpenUpdateForm(true);
  };
  const handleOpenView = (id) => {
    if (id) {
      setMode({ id, mode: 3 });
    }
    setOpenUpdateForm(true);
  };

  const handleCloseUpdateForm = () => {
    setMode({ id: null, mode: 0 });
    setOpenUpdateForm(false);
  };
  const handleDelete = (id) => {
    const deleteArea = async (id) => {
      try {
        await deleteDishById({ id });
        setMode({ ...mode });
        enqueueSnackbar("Đã xóa món", {
          variant: "success",
        });
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Lỗi!. Không thể xóa món", {
          variant: "error",
        });
      }
    };
    confirmAlert({
      title: "Xác nhận",
      message: "Bạn có muốn xóa món đã chọn không",
      buttons: [
        {
          label: "Có",
          onClick: () => deleteArea(id),
        },
        {
          label: "Không",
          onClick: () => {},
        },
      ],
    });
  };
  return (
    <DishAdminStyles>
      <div className="top__actions">
        <Button
          borderRadius="5px"
          bgColor={colors.blue_1}
          bgHover={colors.blue_1}
          padding="4px 10px"
          to="/admin/dish/search"
        >
          Tìm kiếm
        </Button>
        {/* <Search placeHolder="Tìm Kiếm"></Search> */}
        <DropdownManage borderRadius="6px">
          <li>
            <div
              onClick={() => handleOpenUpdate(null)}
              className="dropdown-item dropdown__item"
              href="/"
            >
              Thêm Món
            </div>
          </li>
        </DropdownManage>
      </div>
      <table className="main__table table table-striped">
        <thead className="table__head--container">
          <tr className="table__row">
            <th className="table__head item__id" scope="col">
              Mã
            </th>
            {/* <th className="table__head" scope="col">
              Tên món
            </th> */}
            <th className="table__head" scope="col">
              Tên Món
            </th>
            <th className="table__head" scope="col">
              Loại
            </th>
            <th className="table__head" scope="col">
              Giá
            </th>
            <th className="table__head" scope="col">
              Đơn Vị Tính
            </th>
            <th className="table__head" scope="col">
              Hình Ảnh
            </th>
          </tr>
        </thead>
        <tbody className="table__body">
          {dishs?.map((dish) => {
            return (
              <tr className="table__row" key={dish?._id}>
                <td className="table__data item__id">{dish?._id}</td>
                <td className="table__data">{dish?.TenMon}</td>
                <td className="table__data">{dish?.MaLoai?.TenLoai}</td>
                <td className="table__data">{convertToVND(dish?.GiaMon)}</td>
                <td className="table__data">{dish?.DonViTinh}</td>
                <td className="table__data data__image">
                  <div className="img__container">
                    <img className="data__img" src={dish?.HinhAnh} alt="area-img" />
                  </div>
                </td>
                <td className="table__data">
                  <Button
                    padding="4px 8px"
                    borderRadius="7px"
                    className="button button__update"
                    bgHover={colors.orange_1_hover}
                    bgColor={colors.orange_1}
                    onClick={() => handleOpenUpdate(dish?._id)}
                  >
                    <div>
                      <span className="text">Sửa</span>
                      <i className="icon__item fa-solid fa-pen-to-square"></i>
                    </div>
                  </Button>
                  <Button
                    padding="4px 8px"
                    borderRadius="7px"
                    onClick={() => handleDelete(dish?._id)}
                    className="button button__remove"
                    bgHover={colors.red_1_hover}
                    bgColor={colors.red_1}
                  >
                    <div>
                      <span className="text">Xóa</span>
                      <i className="icon__item fa-solid fa-trash-can"></i>
                    </div>
                  </Button>
                  <Button
                    padding="4px 8px"
                    borderRadius="7px"
                    onClick={() => handleOpenView(dish?._id)}
                    className="button button__view"
                    bgHover={colors.green_1}
                    bgColor={colors.green_1_hover}
                  >
                    <div>
                      <span className="text">Xem</span>
                      <i className="icon__item fa-solid fa-eye"></i>
                    </div>
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {openUpdateForm && (
        <DishUpdateForm
          setMode={setMode}
          mode={mode}
          handleCloseForm={handleCloseUpdateForm}
        ></DishUpdateForm>
      )}
    </DishAdminStyles>
  );
};

DishAdmin.propTypes = {};

export default DishAdmin;
