import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Search from "components/Search";
import DropdownManage from "components/Dopdown/ButtonDropDown";
import { colors } from "variables";
import Button from "components/Button/Button";
import axiosClient from "utils/axios";
import { deleteRoomById, getAllArea, getAllTable } from "utils/api";
import { confirmAlert } from "react-confirm-alert";
import { enqueueSnackbar } from "notistack";
import TableUpdateForm from "components/Table/TableUpdateForm";

const TableAdminStyles = styled.div`
  padding-top: 54px;
  .top__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
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

const TableAdmin = (props) => {
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [mode, setMode] = useState({ mode: 0, id: null });
  const [tables, setTables] = useState();
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const result = await getAllTable();
        if (result?.data) {
          console.log(result.data);
          setTables(result.data);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    };
    fetchDishes();
  }, []);
  const handleOpenUpdate = (id) => {
    if (id) {
      setMode({ id, mode: 1 });
    } else {
      setMode({ id: null, mode: 2 });
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
        await deleteRoomById({ id });
        setMode({ ...mode });
        enqueueSnackbar("Đã xóa phòng", {
          variant: "success",
        });
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Lỗi!. Không thể xóa phòng", {
          variant: "error",
        });
      }
    };
    confirmAlert({
      title: "Xác nhận",
      message: "Bạn có muốn xóa phòng đã chọn không",
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
    <TableAdminStyles>
      <div className="top__actions">
        <Search placeHolder="Tìm Kiếm"></Search>
        <DropdownManage borderRadius="6px">
          <li>
            <div
              onClick={() => handleOpenUpdate(null)}
              className="dropdown-item dropdown__item"
              href="/"
            >
              Thêm Bàn
            </div>
          </li>
        </DropdownManage>
      </div>
      <table className="main__table table table-striped">
        <thead className="table__head--container">
          <tr className="table__row">
            <th className="table__head item__id" scope="col">
              Mã Bàn
            </th>
            <th className="table__head" scope="col">
              Số Thứ Tự
            </th>
            <th className="table__head" scope="col">
              Phòng
            </th>
            <th className="table__head" scope="col">
              Trạng thái
            </th>
            <th className="table__head" scope="col">
              Số Chỗ Ngồi
            </th>
          </tr>
        </thead>
        <tbody className="table__body">
          {tables?.map((table, index) => {
            return (
              <tr className="table__row" key={table?._id}>
                <td className="table__data item__id" title={table?.MaBan}>
                  {table?.MaBan}
                </td>
                <td className="table__data">{table?.SoThuTuBan}</td>
                <td className="table__data">{table?.MaPhong?.TenPhong}</td>
                <td className="table__data">
                  {table?.TrangThai === 0 ? "Còn trống" : "Đang dùng"}
                </td>
                <td className="table__data">{table?.SoChoNgoi}</td>
                <td className="table__data">
                  <Button
                    padding="4px 8px"
                    borderRadius="7px"
                    className="button button__update"
                    bgHover={colors.orange_1_hover}
                    bgColor={colors.orange_1}
                    onClick={() => handleOpenUpdate(table?._id)}
                  >
                    <div>
                      <span className="text">Cập Nhật</span>
                      <i className="icon__item fa-solid fa-pen-to-square"></i>
                    </div>
                  </Button>
                  <Button
                    padding="4px 8px"
                    borderRadius="7px"
                    className="button button__remove"
                    bgHover={colors.red_1_hover}
                    bgColor={colors.red_1}
                  >
                    <div>
                      <span className="text">Xóa</span>
                      <i className="icon__item fa-solid fa-trash-can"></i>
                    </div>
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {openUpdateForm && (
        <TableUpdateForm
          setMode={setMode}
          mode={mode}
          handleCloseForm={handleCloseUpdateForm}
        ></TableUpdateForm>
      )}
    </TableAdminStyles>
  );
};

TableAdmin.propTypes = {};

export default TableAdmin;
