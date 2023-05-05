import axios from "axios";
import axiosClient from "./axios";

export const uploadImage = (base64) => {
  return axiosClient
    .post("image/sendImageAndGetLink", {
      image: base64,
    })
    .then((res) => {
      return res.data;
    });
};

export const getAreaByAreaId = async (MaKhuVuc) => {
  return axiosClient
    .post(`area/getAreaByAreaId`, {
      MaKhuVuc,
    })
    .then((res) => {
      return res.data;
    });
};

export const getRoomByAreaId = async (MaKhuVuc) => {
  return axiosClient
    .post(`room/getRoomByAreaId`, {
      MaKhuVuc,
    })
    .then((res) => {
      return res.data;
    });
};

export const getRoomByRoomId = async (MaPhong) => {
  return axiosClient
    .post(`room/getRoomByRoomId`, {
      MaPhong,
    })
    .then((res) => {
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
export const getAllInvoice = async () => {
  return axiosClient.get(`invoice/getAllInvoice`).then((res) => {
    return res.data;
  });
};

export const addNewArea = async (area) => {
  return axiosClient.post(`area/addArea`, area).then((res) => {
    return res.data;
  });
};

export const addNewDish = async (tableData) => {
  return axiosClient.post(`menu/addMenu`, tableData).then((res) => {
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

export const updateTable = async (table) => {
  return axiosClient.post(`table/updateTable`, table).then((res) => {
    return res.data;
  });
};

export const updateDish = async (dish) => {
  return axiosClient.post(`menu/updateMenu`, dish).then((res) => {
    return res.data;
  });
};

export const updateCustomer = async (cusInfo) => {
  return axiosClient.post(`customer/updateCustomer`, cusInfo).then((res) => {
    return res.data;
  });
};

export const updateAccount = async (cusInfo) => {
  return axiosClient.post(`customer/updateCustomer`, cusInfo).then((res) => {
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

export const getUserByAccessToken = async (AccessToken) => {
  return axiosClient
    .post(`account/getAccountCustomerByAccessToken`, {
      AccessToken,
    })
    .then((res) => {
      return res.data;
    });
};

export const getTableByTableId = async (MaBan) => {
  return axiosClient
    .post(`table/getTableByTableId`, {
      MaBan,
    })
    .then((res) => {
      return res.data;
    });
};

export const getTableByRoomId = async (MaPhong) => {
  return axiosClient
    .post(`table/getTableByRoomId`, {
      MaPhong,
    })
    .then((res) => {
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

export const deleteTableById = async (id) => {
  return axiosClient.post(`table/deleteTable`, id).then((res) => {
    return res.data;
  });
};

export const deleteDishById = async (id) => {
  return axiosClient.post(`menu/deleteMenu`, id).then((res) => {
    return res.data;
  });
};

export const getAllRoom = async () => {
  return axiosClient.get(`room/getAllRoom`).then((res) => {
    return res.data;
  });
};

export const getCustomerByUserId = async (id) => {
  return axiosClient
    .post(`customer/getCustomerByUserId`, {
      MaTaiKhoan: id,
    })
    .then((res) => {
      return res.data;
    });
};

export const getOrderByUser = async (id) => {
  return axiosClient
    .post(`order/getOrderByUser`, {
      MaKhachHang: id,
    })
    .then((res) => {
      return res.data;
    });
};

export const getOrderDetailByOrder = async (id) => {
  return axiosClient
    .post(`order/getOrderDetailByOrder`, {
      MaPhieuDat: id,
    })
    .then((res) => {
      return res.data;
    });
};

export const getOneMenu = async (id) => {
  return axiosClient.get(`menu/getOneMenu/${id}`).then((res) => {
    return res.data;
  });
};

export const getOrderById = async (id) => {
  return axiosClient
    .post(`order/getOrderById`, {
      id,
    })
    .then((res) => {
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

export const getInvoiceByDate = async (data) => {
  return axiosClient.post(`invoice/getInvoiceFromDateToDate`, data).then((res) => {
    return res.data;
  });
};

export const getDishByDate = async (data) => {
  return axiosClient.post(`invoice/getQuantityMenuFromDateToDate`, data).then((res) => {
    return res.data;
  });
};

export const getMenuByAll = async (filter) => {
  return axiosClient.post(`menu/getMenuByAll`, filter).then((res) => {
    return res.data;
  });
};

export const getAreaByAll = async (filter) => {
  return axiosClient.post(`area/getAreaByAll`, filter).then((res) => {
    return res.data;
  });
};

export const getRoomByAll = async (filter) => {
  return axiosClient.post(`room/getRoomByAll`, filter).then((res) => {
    return res.data;
  });
};

export const getTableByAll = async (filter) => {
  return axiosClient.post(`table/getTableByAll`, filter).then((res) => {
    return res.data;
  });
};

export const verifyOTP = async (value) => {
  return axiosClient.post(`account/verifyOtp`, value).then((res) => {
    return res.data;
  });
};

export const resendOTP = async (value) => {
  return axiosClient.post(`account/sendOtp`, value).then((res) => {
    return res.data;
  });
};

export const signUp = async (value) => {
  return axiosClient.post(`account/signUp`, value).then((res) => {
    return res.data;
  });
};

export const signIn = async (value) => {
  return axiosClient.post(`account/signIn`, value).then((res) => {
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
  return axiosClient
    .post(`order/changeStatus`, {
      id,
      TrangThai,
    })
    .then((res) => {
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
    .post(`table/getTableMatchTimeAndSeat`, {
      SoNguoi,
      ThoiGianBatDau,
      LoaiPhieuDat,
    })
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
    .post(`room/getRoomMatchTimeAndSeat`, {
      SoNguoi,
      ThoiGianBatDau,
      LoaiPhieuDat,
      MaLoaiPhong,
    })
    .then((res) => {
      return res.data;
    });
};

export const getTypeOfRoomById = async (MaLoai) => {
  return axiosClient
    .post(`typeOfRoom/getTypeOfRoomById`, {
      MaLoai,
    })
    .then((res) => {
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
  MaNhanVien,
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
      MaNhanVien,
    })
    .then((res) => {
      return res.data;
    });
};

export const addInvoice = async ({
  MaPhieuDat,
  MaNhanVien,
  MaKhachHang,
  HoTen,
  SoDienThoai,
  LoaiHoaDon,
  TrangThai,
  ThoiGianBatDau,
  ListThucDon,
  ListPhong,
  ListBan,
}) => {
  return axiosClient
    .post(`invoice/addInvoice`, {
      MaPhieuDat,
      MaNhanVien,
      MaKhachHang,
      HoTen,
      SoDienThoai,
      LoaiHoaDon,
      TrangThai,
      ThoiGianBatDau,
      ListThucDon,
      ListPhong,
      ListBan,
    })
    .then((res) => {
      return res.data;
    });
};

export const getInvoiceByAll = async ({
  MaPhieuDat,
  MaNhanVien,
  MaKhachHang,
  HoTen,
  SoDienThoai,
  LoaiHoaDon,
  TrangThai,
  ThoiGianBatDau,
}) => {
  return axiosClient
    .post(`invoice/getInvoiceByAll`, {
      MaPhieuDat,
      MaNhanVien,
      MaKhachHang,
      HoTen,
      SoDienThoai,
      LoaiHoaDon,
      TrangThai,
      ThoiGianBatDau,
    })
    .then((res) => {
      return res.data;
    });
};

export const getEmployeeByUserId = async (id) => {
  return axiosClient
    .post(`employee/getEmployeeByUserId`, {
      MaTaiKhoan: id,
    })
    .then((res) => {
      return res.data;
    });
};

export const getInvoiceById = async (id) => {
  return axiosClient
    .post(`invoice/getInvoiceById`, {
      id,
    })
    .then((res) => {
      return res.data;
    });
};

export const updateInvoice = async ({
  id,
  MaPhieuDat,
  MaNhanVien,
  MaKhachHang,
  HoTen,
  SoDienThoai,
  LoaiHoaDon,
  TrangThai,
  ThoiGianBatDau,
  ListThucDon,
  ListPhong,
  ListBan,
}) => {
  return axiosClient
    .post(`invoice/updateInvoice`, {
      id,
      MaPhieuDat,
      MaNhanVien,
      MaKhachHang,
      HoTen,
      SoDienThoai,
      LoaiHoaDon,
      TrangThai,
      ThoiGianBatDau,
      ListThucDon,
      ListPhong,
      ListBan,
    })
    .then((res) => {
      return res.data;
    });
};

export const updateManyRoom = async ({ ids, TrangThai }) => {
  return axiosClient
    .post(`room/updateManyRoom`, {
      ids,
      TrangThai,
    })
    .then((res) => {
      return res.data;
    });
};
export const updateManyTable = async ({ ids, TrangThai }) => {
  return axiosClient
    .post(`table/updateManyTable`, {
      ids,
      TrangThai,
    })
    .then((res) => {
      return res.data;
    });
};
export const addPost = async ({
  TieuDe,
  NoiDung,
  AnhNen,
  MaNhanVien,
  MaLoai,
  NoiBat,
  ThuTuBaiViet,
  HienThi,
}) => {
  return axiosClient
    .post(`post/addPost`, {
      TieuDe,
      NoiDung,
      AnhNen,
      MaNhanVien,
      MaLoai,
      NoiBat,
      ThuTuBaiViet,
      HienThi,
    })
    .then((res) => {
      return res.data;
    });
};
export const updatePost = async ({
  id,
  TieuDe,
  NoiDung,
  AnhNen,
  HienThi,
  MaLoai,
  NoiBat,
  ThuTuBaiViet,
}) => {
  return axiosClient
    .post(`post/updatePost`, {
      id,
      TieuDe,
      NoiDung,
      AnhNen,
      HienThi,
      MaLoai,
      NoiBat,
      ThuTuBaiViet,
    })
    .then((res) => {
      return res.data;
    });
};
export const deletePost = async ({ id }) => {
  return axiosClient
    .post(`post/deletePost`, {
      id,
    })
    .then((res) => {
      return res.data;
    });
};
export const getAllPost = async ({ HienThi }) => {
  return axiosClient
    .post(`post/getAllPost`, {
      HienThi,
    })
    .then((res) => {
      return res.data;
    });
};
export const getPostById = async ({ id }) => {
  return axiosClient
    .post(`post/getPostById`, {
      id,
    })
    .then((res) => {
      return res.data;
    });
};
export const getPostByTypeId = async ({ MaLoai, HienThi }) => {
  return axiosClient
    .post(`post/getPostByTypeId`, {
      MaLoai,
      HienThi,
    })
    .then((res) => {
      return res.data;
    });
};

export const addTypePost = async ({ TenLoai }) => {
  return axiosClient
    .post(`post/addTypePost`, {
      TenLoai,
    })
    .then((res) => {
      return res.data;
    });
};
export const updateTypePost = async ({ id, TenLoai }) => {
  return axiosClient
    .post(`post/updateTypePost`, {
      id,
      TenLoai,
    })
    .then((res) => {
      return res.data;
    });
};
export const deleteTypePost = async ({ id }) => {
  return axiosClient
    .post(`post/deleteTypePost`, {
      id,
    })
    .then((res) => {
      return res.data;
    });
};
export const getAllTypePost = async () => {
  return axiosClient.post(`post/getAllTypePost`).then((res) => {
    return res.data;
  });
};
export const getTypePostById = async ({ id }) => {
  return axiosClient
    .post(`post/getTypePostById`, {
      id,
    })
    .then((res) => {
      return res.data;
    });
};
