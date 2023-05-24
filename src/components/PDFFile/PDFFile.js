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
  title: {
    alignItems: "center",
    fontSize: "35px",
  },
  viewFlex: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: "13px",
    // columnGap: "20px",
    justifyContent: "space-between",
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

const PDFFile = ({ invoice, dishPrice, wasPay }) => {
  const [staff, setStaff] = useState(null);
  const sumRoomPrice = () => {
    let sum = 0;
    if (invoice?.LoaiHoaDon !== 0) {
      sum =
        invoice?.LoaiHoaDon === 1
          ? invoice?.ListPhong?.length * 100000
          : invoice?.ListPhong?.length * 300000;
    }
    return sum;
  };
  useEffect(() => {
    const loadInfor = async () => {
      try {
        const data = await getEmployeeById(invoice?.MaNhanVien);
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
            <Text>Thoi gian bat dau: {convertInterDate(new Date(invoice?.ThoiGianBatDau))}</Text>
          </View>
          <View style={styles.viewFlex}>
            <Text style={styles.normalText}>email: evergreengarden@gmail.com</Text>
            <Text>
              Hinh thuc dat:{" "}
              {invoice?.LoaiHoaDon === 0
                ? "Dat ban"
                : invoice?.LoaiHoaDon === 1
                ? "Dat phong thuong"
                : " Dat phong VIP"}
            </Text>
          </View>
          <View style={styles.viewFlex}>
            <Text style={styles.normalText}>website: evergreengarden.com</Text>
            <Text>Ten khach hang: {invoice?.HoTen && removeVietnameseTones(invoice?.HoTen)}</Text>
          </View>
          <View style={styles.viewFlex}>
            <Text style={styles.normalText}>
              Ten nhan vien: {staff?.TenNhanVien && removeVietnameseTones(staff?.TenNhanVien)}
            </Text>
          </View>
        </View>
        <View style={styles.title}>
          <Text>HOA DON</Text>
        </View>
        <View style={styles.normalText}></View>
        <View style={styles.viewFlexTitle}>
          <Text style={styles.columnDishLong}>Ten Mon</Text>
          <Text style={styles.columnDish}> So Luong</Text>
          <Text style={styles.columnDish}> Don Gia</Text>
          <Text style={styles.columnDish}> Tong Tien</Text>
        </View>
        {invoice?.ListThucDon?.map((dish) => {
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
            Tong tien mon an: {convertToVND(dishPrice) + "vnd"}
          </Text>
        </View>
        <View>
          <Text style={styles.viewFlexTitle}>
            {invoice?.LoaiHoaDon === 0 ? "" : "Thong tin phong"}
          </Text>
          {invoice?.LoaiHoaDon !== 0 && (
            <View style={styles.viewFlexTitle}>
              <Text style={styles.columnDishLong}>Ma Phong</Text>
              <Text style={styles.columnDish}> Ten Phong</Text>
              <Text style={styles.columnDish}> So Cho Ngoi</Text>
            </View>
          )}
          {(invoice?.LoaiHoaDon === 1 || invoice?.LoaiHoaDon === 2) &&
            invoice?.ListPhong?.map((room) => {
              return (
                <View key={room._id} style={styles.viewFlex}>
                  <Text style={styles.columnDishLong}>{room?.MaPhong}</Text>
                  <Text style={styles.columnDish}> {room?.TenPhong}</Text>
                  <Text style={styles.columnDish}> {room?.SoChoNgoiToiDa}</Text>
                </View>
              );
            })}
          {invoice?.LoaiHoaDon !== 0 && (
            <Text style={styles.viewFlexTitleRight}>
              Tong tien phong:
              {convertToVND(sumRoomPrice()) + "vnd"}
            </Text>
          )}
          {/* {invoice?.LoaiHoaDon === 0 && (
            <View style={styles.viewFlexTitle}>
              <Text style={styles.columnDish33}>So Thu Tu </Text>
              <Text style={styles.columnDish33}> So Cho Ngoi</Text>
              <Text style={styles.columnDish33}> Ma Ban</Text>
            </View>
          )}
          {invoice?.LoaiHoaDon === 0 &&
            invoice?.ListBan?.map((table) => {
              return (
                <View key={table._id} style={styles.viewFlex}>
                  <Text style={styles.columnDish33}>{table?.SoThuTuBan}</Text>
                  <Text style={styles.columnDish33}> {table?.SoChoNgoi}</Text>
                  <Text style={styles.columnDish33}> {table?.MaBan}</Text>
                </View>
              );
            })} */}
        </View>
        <View>
          {invoice?.MaPhieuDat && (
            <Text style={styles.viewFlexTitleRight}>
              So tien da dat coc: {convertToVND(wasPay) + "vnd"}
            </Text>
          )}
          <Text style={styles.viewFlexTitleRight}>
            Tong tien phai thanh toan:{convertToVND(dishPrice + sumRoomPrice() - wasPay) + "vnd"}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

PDFFile.propTypes = {};

export default PDFFile;
