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
    marginBottom: "6px",
  },
  columnDishLong: {
    width: "40%",
    marginBottom: "6px",
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

const PDFInvoiceStatistic = ({ invoice: invoices = [], dishPrice, wasPay }) => {
  const [staff, setStaff] = useState(null);
  const sumRoomPrice = () => {
    let sum = 0;
    if (invoices?.LoaiHoaDon !== 0) {
      sum =
        invoices?.LoaiHoaDon === 1
          ? invoices?.ListPhong?.length * 100000
          : invoices?.ListPhong?.length * 300000;
    }
    return sum;
  };
  useEffect(() => {
    const loadInfor = async () => {
      try {
        const data = await getEmployeeById(invoices?.MaNhanVien);
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

  const calculateSumStatics = (invoice) => {
    let sum = 0;
    const { LoaiHoaDon, ListThucDon, ListBan, ListPhong } = invoice;
    sum += calculateMoney(LoaiHoaDon, ListThucDon, ListBan, ListPhong);
    return sum;
  };

  const calculateMoney = (bookingType, dishes, tables, rooms) => {
    let sum = 0;
    if (dishes?.length) {
      sum += sumDishes(dishes);
    }
    if (bookingType === 1) {
      // normal
      sum += 100000 * rooms.length;
    } else if (bookingType === 2) {
      // VIP
      sum += 300000 * rooms.length;
    }
    return sum;
  };

  const sumDishes = (dishes) => {
    let sum = 0;
    if (dishes?.length) {
      dishes.forEach((dish) => {
        const { MaThucDon, SoLuong } = dish;
        sum += MaThucDon.GiaMon * SoLuong;
      });
    }
    return sum;
  };
  const sumDishesAllInvoices = () => {
    let sum = 0;
    if (invoices?.length) {
      invoices.forEach((invoice) => {
        sum += sumDishes(invoice?.ListThucDon);
      });
    }
    return sum;
  };
  const sumRoomsAllInvoices = () => {
    let sum = 0;
    if (invoices?.length > 0) {
      invoices.forEach((invoice) => {
        if (invoice?.ListPhong?.length > 0) {
          invoice?.ListPhong?.forEach((room) => {
            if (invoice?.LoaiHoaDon === 1) {
              sum += 100000;
            } else if (invoice?.LoaiHoaDon === 2) {
              sum += 300000;
            }
          });
        }
      });
    }
    // setSumRooms(sum);
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
          <Text>Thoi gian xuat: {convertInterDate(new Date())}</Text>
        </View>
        <View style={styles.viewFlexTitle}>
          <Text style={styles.columnDish}>Ten nhan vien</Text>
          <Text style={styles.columnDish}> Loai hoa don</Text>
          <Text style={styles.columnDishLong}> Thoi gian lap</Text>
          <Text style={styles.columnDish}> tong tien</Text>
        </View>
        {invoices?.map((invoice) => {
          return (
            <View key={invoice._id} style={styles.viewFlex}>
              <Text style={styles.columnDish}>
                {invoice?.MaNhanVien?.TenNhanVien &&
                  removeVietnameseTones(invoice?.MaNhanVien?.TenNhanVien)}
              </Text>
              <Text style={styles.columnDish}>
                {invoice?.LoaiHoaDon === 0
                  ? "Dat ban"
                  : invoice?.LoaiHoaDon === 1
                  ? "Dat phong thuong"
                  : "Dat phong VIP"}
              </Text>
              <Text style={styles.columnDishLong}>
                {convertInterDate(new Date(invoice?.createdAt))}
              </Text>
              <Text style={styles.columnDish}>{calculateSumStatics(invoice) + " vnd"} </Text>
            </View>
          );
        })}
        <View>
          <Text style={styles.viewFlexTitleRight}>
            Tong tien mon an: {convertToVND(sumDishesAllInvoices()) + " vnd"}
          </Text>
          <Text style={styles.viewFlexTitleRight}>
            Tong tien phong: {convertToVND(sumRoomsAllInvoices()) + " vnd"}
          </Text>
          <Text style={styles.viewFlexTitleRight}>
            Tong tien thong ke:{" "}
            {convertToVND(sumDishesAllInvoices() + sumRoomsAllInvoices()) + " vnd"}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

PDFInvoiceStatistic.propTypes = {};

export default PDFInvoiceStatistic;
