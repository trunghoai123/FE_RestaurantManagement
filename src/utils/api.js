import axios from "axios";
import axiosClient from "./axios";

export const uploadImage = (base64) => {
  return axiosClient.post("image/sendImageAndGetLink", { image: base64 }).then((res) => {
    return res.data;
  });
};

export const getAreaByAreaId = async (MaKhuVuc) => {
  return axiosClient.post(`area/getAreaByAreaId`, { MaKhuVuc }).then((res) => {
    return res.data;
  });
};

export const getRoomByAreaId = async (MaKhuVuc) => {
  return axiosClient.post(`room/getRoomByAreaId`, { MaKhuVuc }).then((res) => {
    return res.data;
  });
};

export const getRoomByRoomId = async (MaPhong) => {
  return axiosClient.post(`room/getRoomByRoomId`, { MaPhong }).then((res) => {
    return res.data;
  });
};

export const getAllArea = async () => {
  return axiosClient.get(`area/getAllArea`).then((res) => {
    return res.data;
  });
};
export const getAllTable = async () => {
  return axiosClient.get(`table/getAllTable`).then((res) => {
    return res.data;
  });
};

export const addNewArea = async (area) => {
  return axiosClient.post(`area/addArea`, area).then((res) => {
    return res.data;
  });
};

export const addNewRoom = async (roomData) => {
  return axiosClient.post(`room/addRoom`, roomData).then((res) => {
    return res.data;
  });
};

export const addNewTable = async (tableData) => {
  return axiosClient.post(`table/addTable`, tableData).then((res) => {
    return res.data;
  });
};

export const updateArea = async (area) => {
  return axiosClient.post(`area/updateArea`, area).then((res) => {
    return res.data;
  });
};

export const updateRoom = async (room) => {
  return axiosClient.post(`room/updateRoom`, room).then((res) => {
    return res.data;
  });
};

export const getAreaById = async (id) => {
  return axiosClient.get(`area/getAreaById/${id}`).then((res) => {
    return res.data;
  });
};

export const getRoomById = async (id) => {
  return axiosClient.get(`room/getRoomById/${id}`).then((res) => {
    return res.data;
  });
};

export const getTableById = async (id) => {
  return axiosClient.get(`table/getTableById/${id}`).then((res) => {
    return res.data;
  });
};

export const getTableByTableId = async (MaBan) => {
  return axiosClient.post(`table/getTableByTableId`, { MaBan }).then((res) => {
    return res.data;
  });
};

export const getTableByRoomId = async (MaPhong) => {
  return axiosClient.post(`table/getTableByRoomId`, { MaPhong }).then((res) => {
    return res.data;
  });
};

export const deleteAreaById = async (id) => {
  return axiosClient.post(`area/deleteArea`, id).then((res) => {
    return res.data;
  });
};

export const deleteRoomById = async (id) => {
  return axiosClient.post(`room/deleteRoom`, id).then((res) => {
    return res.data;
  });
};

export const getAllRoom = async () => {
  return axiosClient.get(`room/getAllRoom`).then((res) => {
    return res.data;
  });
};

export const getCustomerByUserId = async (id) => {
  return axiosClient.post(`customer/getCustomerByUserId`, { MaTaiKhoan: id }).then((res) => {
    return res.data;
  });
};

export const getOrderByUser = async (id) => {
  return axiosClient.post(`order/getOrderByUser`, { MaKhachHang: id }).then((res) => {
    return res.data;
  });
};

export const getOrderDetailByOrder = async (id) => {
  return axiosClient.post(`order/getOrderDetailByOrder`, { MaPhieuDat: id }).then((res) => {
    return res.data;
  });
};

export const getOneMenu = async (id) => {
  return axiosClient.get(`menu/getOneMenu/${id}`).then((res) => {
    return res.data;
  });
};

export const getOrderById = async (id) => {
  return axiosClient.post(`order/getOrderById`, { id }).then((res) => {
    return res.data;
  });
};

export const getAllDish = async () => {
  return axiosClient.get(`menu/getAllMenu`).then((res) => {
    return res.data;
  });
  // const res = await axiosClient.get(`menu/getAllMenu`);
  // return res.data;
};

export const getAllTypeOfDish = async () => {
  return axiosClient.get(`typeOfMenu/getAllTypeOfMenu`).then((res) => {
    return res.data;
  });
};

export const getAllTypeOfRoom = async () => {
  return axiosClient.get(`typeOfRoom/getAllTypeOfRoom`).then((res) => {
    return res.data;
  });
};

export const getMenuByAll = async (filter) => {
  return axiosClient.post(`menu/getMenuByAll`, filter).then((res) => {
    return res.data;
  });
};

// export const getMenuByTypeId = async (id) => {
//   return axiosClient.get(`menu/getMenuByTypeMenuId`, { MaLoai: id }).then((res) => {
//     return res.data;
//   });
// };

//Order Admin
export const getOrderByAll = async ({
  LoaiPhieuDat,
  TrangThai,
  SoLuongNguoiTrenBanOrPhong,
  SoLuongBanOrPhong,
  ThoiGianBatDau,
  GhiChu,
  HoTen,
  Email,
  SoDienThoai,
  MaNhanVien,
  MaKhachHang,
}) => {
  return axiosClient
    .post(`order/getOrderByAll`, {
      LoaiPhieuDat,
      TrangThai,
      SoLuongNguoiTrenBanOrPhong,
      SoLuongBanOrPhong,
      ThoiGianBatDau,
      GhiChu,
      HoTen,
      Email,
      SoDienThoai,
      MaNhanVien,
      MaKhachHang,
    })
    .then((res) => {
      return res.data;
    });
};

export const changeStatus = async (id, TrangThai) => {
  return axiosClient.post(`order/changeStatus`, { id, TrangThai }).then((res) => {
    return res.data;
  });
};

export const updateOrder = async ({
  id,
  LoaiPhieuDat,
  TrangThai,
  SoLuongNguoiTrenBanOrPhong,
  SoLuongBanOrPhong,
  ThoiGianBatDau,
  MaKhachHang,
  ListThucDon,
  ListPhong,
  ListBan,
  HoTen,
  Email,
  SoDienThoai,
  GhiChu,
}) => {
  return axiosClient
    .post(`order/updateOrder`, {
      id,
      LoaiPhieuDat,
      TrangThai,
      SoLuongNguoiTrenBanOrPhong,
      SoLuongBanOrPhong,
      ThoiGianBatDau,
      MaKhachHang,
      ListThucDon,
      ListPhong,
      ListBan,
      HoTen,
      Email,
      SoDienThoai,
      GhiChu,
    })
    .then((res) => {
      return res.data;
    });
};

export const getTableMatchTimeAndSeat = async ({ SoNguoi, ThoiGianBatDau, LoaiPhieuDat }) => {
  return axiosClient
    .post(`table/getTableMatchTimeAndSeat`, { SoNguoi, ThoiGianBatDau, LoaiPhieuDat })
    .then((res) => {
      return res.data;
    });
};

export const getRoomMatchTimeAndSeat = async ({
  SoNguoi,
  ThoiGianBatDau,
  LoaiPhieuDat,
  MaLoaiPhong,
}) => {
  return axiosClient
    .post(`room/getRoomMatchTimeAndSeat`, { SoNguoi, ThoiGianBatDau, LoaiPhieuDat, MaLoaiPhong })
    .then((res) => {
      return res.data;
    });
};

export const getTypeOfRoomById = async (MaLoai) => {
  return axiosClient.post(`typeOfRoom/getTypeOfRoomById`, { MaLoai }).then((res) => {
    return res.data;
  });
};

export const addOrder = async ({
  LoaiPhieuDat,
  TrangThai,
  SoLuongNguoiTrenBanOrPhong,
  SoLuongBanOrPhong,
  ThoiGianBatDau,
  MaKhachHang,
  ListThucDon,
  ListPhong,
  ListBan,
  HoTen,
  Email,
  SoDienThoai,
  GhiChu,
}) => {
  return axiosClient
    .post(`order/addOrder`, {
      LoaiPhieuDat,
      TrangThai,
      SoLuongNguoiTrenBanOrPhong,
      SoLuongBanOrPhong,
      ThoiGianBatDau,
      MaKhachHang,
      ListThucDon,
      ListPhong,
      ListBan,
      HoTen,
      Email,
      SoDienThoai,
      GhiChu,
    })
    .then((res) => {
      return res.data;
    });
};
