import React, { useEffect, useState } from "react";
import { Page, Text, Image, Document, StyleSheet, View } from "@react-pdf/renderer";
import PropTypes from "prop-types";
import { convertDate, convertInterDate } from "pages/admin/Order/OrderAdmin";
import { convertToVND, removeVietnameseTones } from "utils/utils";
import { getEmployeeById } from "utils/api";

const styles = StyleSheet.create({
  body: {
    padding: "10px",
    fontSize: "13px",
  },
  viewFlex: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: "13px",
    justifyContent: "space-between",
  },
  title: {
    alignItems: "center",
    fontSize: "35px",
  },
  viewFlexTitle: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: "13px",
    margin: "12px 0 8px 0",
    justifyContent: "space-between",
  },
  viewFlexTitleRight: {
    textAlign: "right",
    flexDirection: "row",
    fontSize: "13px",
    margin: "12px 0 8px 0",
    justifyContent: "space-between",
  },
  normalText: {
    marginBottom: "4px",
  },
  columnDish: {
    width: "20%",
  },
  columnDishLong: {
    width: "40%",
  },
  columnDish33: {
    width: "33%",
  },
  logo: {
    width: "60px",
    height: "60px",
  },
  topInforRight: {
    marginLeft: "auto",
  },
  topResName: {
    fontSize: "25px",
  },
});

const PDFDeposit = ({ orderDetail }) => {
  const [staff, setStaff] = useState(null);

  const sumRoomPrice = () => {
    let sum = 0;
    if (orderDetail?.LoaiHoaDon !== 0) {
      sum =
        orderDetail?.LoaiHoaDon === 1
          ? orderDetail?.ListPhong?.length * 100000
          : orderDetail?.ListPhong?.length * 300000;
    }
    return sum;
  };
  useEffect(() => {
    const loadInfor = async () => {
      try {
        const data = await getEmployeeById(orderDetail?.MaNhanVien);
        if (data?.data) {
          setStaff(data.data);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    };
    loadInfor();
  }, []);

  console.log(orderDetail);

  const totalDishPrice = (dishes) => {
    let sum = 0;
    if (dishes?.length) {
      dishes.forEach((dish) => {
        sum += dish?.MaThucDon?.GiaMon * dish?.SoLuong;
      });
    }
    return sum;
  };

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.viewFlex}>
          <View>
            <Image style={styles.logo} src="/images/logo.png" />
          </View>
          <View>
            <Text style={styles.topResName}>Evergreen Garden</Text>
          </View>
        </View>
        <View style={styles.normalText}>
          <View style={styles.viewFlex}>
            <Text style={styles.normalText}>thong tin lien he</Text>
            <Text>Thoi gian xuat: {convertInterDate(new Date())}</Text>
          </View>
          <View style={styles.viewFlex}>
            <Text style={styles.normalText}>so dien thoai: 0906778443 </Text>
            <Text>
              Thoi gian bat dau:{" "}
              {convertInterDate(new Date(orderDetail?.MaPhieuDat?.ThoiGianBatDau))}
            </Text>
          </View>
          <View style={styles.viewFlex}>
            <Text style={styles.normalText}>email: evergreengarden@gmail.com</Text>
            <Text>
              Ten khach hang:{" "}
              {orderDetail?.MaPhieuDat?.HoTen &&
                removeVietnameseTones(orderDetail?.MaPhieuDat?.HoTen)}
            </Text>
          </View>
          <View style={styles.viewFlex}>
            <Text style={styles.normalText}>website: evergreengarden.com</Text>
            <Text>So Dien Thoai: {orderDetail?.MaPhieuDat?.SoDienThoai}</Text>
          </View>
          <View style={styles.viewFlex}>
            <Text style={styles.normalText}>
              Ten nhan vien:{" "}
              {orderDetail?.MaPhieuDat?.MaNhanVien?.TenNhanVien &&
                removeVietnameseTones(orderDetail?.MaPhieuDat?.MaNhanVien?.TenNhanVien)}
            </Text>
            <Text>
              Hinh thuc dat:{" "}
              {orderDetail?.LoaiPhieuDat === 0
                ? "Dat ban"
                : orderDetail?.LoaiPhieuDat === 1
                ? "Dat phong thuong"
                : " Dat phong VIP"}
            </Text>
          </View>
        </View>
        <View style={styles.title}>
          <Text>PHIEU XAC NHAN DAT COC</Text>
        </View>
        {/* <View style={styles.normalText}>
          <Text>Thoi gian xuat: {convertInterDate(new Date())}</Text>
        </View> */}
        {/* <View style={styles.normalText}>
          <Text>
            Thoi gian bat dau: {convertInterDate(new Date(orderDetail?.MaPhieuDat?.ThoiGianBatDau))}
          </Text>
        </View> */}
        {/* <View style={styles.normalText}>
          <Text>
            Ten khach hang:{" "}
            {orderDetail?.MaPhieuDat?.HoTen &&
              removeVietnameseTones(orderDetail?.MaPhieuDat?.HoTen)}
          </Text>
        </View> */}
        {/* <View style={styles.normalText}>
          <Text>So Dien Thoai: {orderDetail?.MaPhieuDat?.SoDienThoai}</Text>
        </View> */}
        {/* <View style={styles.normalText}>
          <Text>
            Hinh thuc dat:{" "}
            {orderDetail?.LoaiPhieuDat === 0
              ? "Dat ban"
              : orderDetail?.LoaiPhieuDat === 1
              ? "Dat phong thuong"
              : " Dat phong VIP"}
          </Text>
        </View> */}
        <View style={styles.viewFlexTitle}>
          <Text style={styles.columnDishLong}>Ten Mon</Text>
          <Text style={styles.columnDish}> So Luong</Text>
          <Text style={styles.columnDish}> Don Gia</Text>
          <Text style={styles.columnDish}> Tong Tien</Text>
        </View>
        {orderDetail?.ListThucDon?.map((dish) => {
          return (
            <View key={dish._id} style={styles.viewFlex}>
              <Text style={styles.columnDishLong}>
                {dish?.MaThucDon?.TenMon && removeVietnameseTones(dish?.MaThucDon?.TenMon)}
              </Text>
              <Text style={styles.columnDish}> {dish?.SoLuong}</Text>
              <Text style={styles.columnDish}> {dish?.MaThucDon?.GiaMon}</Text>
              <Text style={styles.columnDish}> {dish?.MaThucDon?.GiaMon * dish?.SoLuong}</Text>
            </View>
          );
        })}
        <View>
          <Text style={styles.viewFlexTitleRight}>
            Tong tien mon an: {convertToVND(totalDishPrice(orderDetail?.ListThucDon)) + "vnd"}
          </Text>
          <Text style={styles.viewFlexTitleRight}>
            So tien coc mon an:{" "}
            {convertToVND((totalDishPrice(orderDetail?.ListThucDon) * 30) / 100) + "vnd"}
          </Text>
          <Text style={styles.viewFlexTitleRight}>
            So tien da tra:{" "}
            {convertToVND((totalDishPrice(orderDetail?.ListThucDon) * 30) / 100) + "vnd"}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

PDFDeposit.propTypes = {};

export default PDFDeposit;
