import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "components/Button/Button";
import { colors } from "variables";
import Search from "components/Search";
import DropdownManage from "components/Dopdown/ButtonDropDown";
import axiosClient from "utils/axios";
import AreaUpdateForm from "components/Area/AreaUpdateForm";
import { confirmAlert } from "react-confirm-alert";
import { deleteAreaById, getAllArea, getAreaByAll } from "utils/api";
import { enqueueSnackbar } from "notistack";
import Input from "components/Input/Input";
import * as yup from "yup";
import { useForm } from "react-hook-form";
const AreaSearchStyles = styled.div`
  padding-top: 54px;
  .top__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
    .filter__container {
      padding-bottom: 30px;
      .filter__row {
        display: flex;
        .filter__value {
          display: flex;
          column-gap: 20px;
          margin-top: 12px;
          align-items: center;
          &.button__container {
            margin-left: auto;
          }
          .filter__value__label {
            text-align: right;
            display: block;
            width: 120px;
            min-width: 120px;
          }
          .filter__value__input {
          }
        }
      }
    }
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
const AreaSearch = (props) => {
  const [areas, setAreas] = useState();
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [mode, setMode] = useState({ mode: 0, id: null }); // 0: noneOfBoth, 1: update. 2: add
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid, isLoading, isSubmitting },
  } = useForm({
    defaultValues: {
      id: "",
      name: "",
      numberOfPeople: 1,
    },
  });
  useEffect(() => {
    fetchAreas();
  }, [mode]);
  const fetchAreas = async () => {
    try {
      let result;
      if (!getValues("id") && !getValues("name") && !getValues("numberOfPeople")) {
        result = await getAllArea();
      } else {
        result = await getAreaByAll({
          MaKhuVuc: getValues("id"),
          TenKhuVuc: getValues("name"),
          SoNguoiToiDa: getValues("numberOfPeople"),
          MoTa: "",
          ViTriCuThe: "",
        });
      }
      if (result?.data) {
        setAreas(result.data);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };
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
        await deleteAreaById({ id });
        setMode({ ...mode });
        enqueueSnackbar("Đã xóa khu vực", {
          variant: "success",
        });
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Lỗi!. Không thể xóa khu vực", {
          variant: "error",
        });
      }
    };
    confirmAlert({
      title: "Xác nhận",
      message: "Bạn có muốn xóa khu vực đã chọn không",
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
  const submitSearch = () => {
    fetchAreas();
  };
  const handleClearFilter = () => {
    setValue("id", "");
    setValue("name", "");
    setValue("numberOfPeople", 1);
    fetchAreas();
  };
  return (
    <AreaSearchStyles>
      <div className="top__actions">
        <form className="filter__container" onSubmit={handleSubmit(submitSearch)}>
          <div className="filter__row">
            <div className="filter__value">
              <label className="filter__value__label">Mã</label>
              <Input
                className="filter__value__input"
                placeHolder="Mã"
                name="id"
                {...register("id")}
              ></Input>
            </div>
            <div className="filter__value">
              <label className="filter__value__label">Tên khu vực</label>
              <Input
                className="filter__value__input"
                placeHolder="Tên khu vực"
                name="name"
                {...register("name")}
              ></Input>
            </div>
          </div>
          <div className="filter__row">
            <div className="filter__value">
              <label className="filter__value__label">Số người tối đa</label>
              <Input
                type="number"
                max="1000"
                min="1"
                className="filter__value__input"
                placeHolder="Số người tối đa"
                name="numberOfPeople"
                {...register("numberOfPeople")}
              ></Input>
            </div>
            <div className="filter__value button__container">
              <Button
                bgColor={colors.orange_1}
                bgHover={colors.orange_1_hover}
                borderRadius="5px"
                padding="4px 20px"
                width="100px"
                type="button"
                onClick={handleClearFilter}
              >
                <div>Xóa</div>
              </Button>
              <Button
                type="submit"
                bgColor={colors.green_1}
                bgHover={colors.green_1_hover}
                borderRadius="5px"
                padding="4px 20px"
                width="100px"
              >
                <div>Tìm</div>
              </Button>
            </div>
          </div>
        </form>
      </div>
      <table className="main__table table table-striped">
        <thead className="table__head--container">
          <tr className="table__row">
            <th className="table__head item__id" scope="col">
              Mã Khu Vực
            </th>
            <th className="table__head" scope="col">
              Tên Khu Vực
            </th>
            <th className="table__head" scope="col">
              Số Người Tối Đa
            </th>
            <th className="table__head" scope="col">
              Vị Trí Cụ Thể
            </th>
            <th className="table__head" scope="col">
              Mô Tả
            </th>
            <th className="table__head" scope="col">
              Hình Ảnh
            </th>
          </tr>
        </thead>
        <tbody className="table__body">
          {areas?.map((area) => {
            return (
              <tr className="table__row" key={area?._id}>
                <td className="table__data item__id">{area.MaKhuVuc}</td>
                <td className="table__data">{area?.TenKhuVuc}</td>
                <td className="table__data">{area?.SoNguoiToiDa}</td>
                <td className="table__data">{area?.ViTriCuThe}</td>
                <td className="table__data">{area?.MoTa}</td>
                <td className="table__data data__image">
                  <div className="img__container">
                    <img className="data__img" src={area?.HinhAnh} alt={area?.TenKhuVuc} />
                  </div>
                </td>
                <td className="table__data">
                  <Button
                    // to={`/admin/area/update/${area?._id}`}
                    borderRadius="8px"
                    padding="4px 8px"
                    onClick={() => handleOpenUpdate(area?._id)}
                    className="button button__update"
                    bgHover={colors.orange_1_hover}
                    bgColor={colors.orange_1}
                  >
                    <div>
                      <span className="text">Sửa</span>
                      <i className="icon__item fa-solid fa-pen-to-square"></i>
                    </div>
                  </Button>
                  <Button
                    borderRadius="8px"
                    padding="4px 8px"
                    className="button button__remove"
                    bgHover={colors.red_1_hover}
                    bgColor={colors.red_1}
                    onClick={() => handleDelete(area?._id)}
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
        <AreaUpdateForm
          setMode={setMode}
          mode={mode}
          handleCloseForm={handleCloseUpdateForm}
        ></AreaUpdateForm>
      )}
    </AreaSearchStyles>
  );
};

AreaSearch.propTypes = {};

export default AreaSearch;
