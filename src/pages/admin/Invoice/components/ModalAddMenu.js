import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { updateInvoice , getMenuByAll } from "utils/api";
import { convertToVND } from "utils/utils";
import { enqueueSnackbar } from "notistack";
import CustomDropDown from "./CustomDropDown";


const AllMenu = 'ALL_MENU'


function ModalAddMenu({setIsModalAddMenu ,getInvoice, invoiceId ,setLoading , listThucDon , setListThucDon , isSave}) {
    const [data, setData] = useState([])
    const [dataUse , setDataUse] =useState([])
    const [selectedItem,setSelectedItem] = useState("")

    useEffect(() => {
        setDataUse(listThucDon)
        
    },[])
    useEffect(() => {
        getData(selectedItem)
    },[selectedItem])



    const getData = async (selectedItem)=>{
        setLoading(true)
        let filter = {} 
        if(selectedItem != AllMenu){
            filter = {MaLoai: selectedItem}
        }
        let result = await getMenuByAll(filter)

        if(result && result.data){
            setLoading(false)
            setData(result.data)
        }
        else{
            setLoading(false)
            setData([])

        }
    }


    const handleSave= async ()=>{
        if(isSave){
            let result = await updateInvoice({id:invoiceId, ListThucDon: dataUse });
            if (result.success) {
                enqueueSnackbar("Cập nhật món ăn cho hóa đơn thành công", {
                    variant: "success",
                    });
                getInvoice(invoiceId)
                setIsModalAddMenu(false)
            }else{
                enqueueSnackbar("Cập nhật món ăn cho hóa đơn thất bại", {
                    variant: "error",
                    });
            }
        }else{
            setIsModalAddMenu(false)
            setListThucDon(dataUse)
            enqueueSnackbar("Cập nhật món ăn cho đơn đặt thành công", {
                variant: "success",
                });
        }
        
      

        
    }


    const handleAdd = (item , quantity)=>{
        if(!dataUse?.some((itm)=>
            item._id == itm.MaThucDon._id

        ))
        setDataUse([...dataUse, {MaThucDon: item
            , SoLuong : quantity
        }])
    }

    
    


    return ( 

        <ModalStyle>
            <div className="modal-add-over">
                <div className="modal-add">
                    <div className="modal-add-header">
                        <h2>Thêm món ăn</h2>
                        <div className="close" onClick={()=>setIsModalAddMenu(false)}>&times;</div>
                    </div>
                    <div className="modal-add-body">
                        <div className="modal-col-70">
                            <div className="title-dropdown">
                                <h5>Món ăn</h5>
                               
                                    <CustomDropDown
                                        setSelectedItem = {setSelectedItem}
                                        selectedItem={selectedItem}
                                        setLoading= {setLoading}
                                        allMenu = {AllMenu}
                                    />
                       
                            </div>
                            <ul>
                               
                            {
                               data && data?.map((item, idx)=>{
                                    return (
                                        <li key={idx}>
                                            <MenuItem
                                                item = {item}
                                                handleAdd={handleAdd}
                                            />
                                            
                                        </li>
                                    )
                                })
                                
                                }
                            </ul>
                        </div>
                        <div className="modal-col-30">
                            <div className="flex-d">
                                <h5>Món ăn đã đặt</h5>
                                <strong>{dataUse?.length}</strong>
                            </div>
                            <ul>
                            {
                                    dataUse ? dataUse.map((item,index)=>{
                                        return (
                                            <li key={index} className="item">
                                                <div className="box-content">
                                                    <div className="img-menu">
                                                        <img src={item.MaThucDon.HinhAnh} style={{width: 100, height: 100}}/>
                                                    </div>
                                                    <div className="box-menu">
                                                        <div className="name-menu">
                                                            {item.MaThucDon.TenMon}
                                                        </div>
                                                        <div>
                                                            {convertToVND(item.MaThucDon.GiaMon)}
                                                        </div>
                                                    </div>
                                                </div>
                                               
                    
                                                <div className="btn-group">
                                                    <div>
                                                        <span>Số lượng:</span>
                                                        {" "}{item.SoLuong}
                                                    </div>
                                                    <button className="btn-order cancel"
                                                        onClick={()=>{
                                                            setDataUse(dataUse?.filter((itm)=>
                                                            item.MaThucDon._id != itm.MaThucDon._id
                                                        ))
                                                        }}
                                                    >Gỡ</button>
                                                </div>
                                                <div className="clear"></div>
                                            </li>
                                        )
                                    }) : "Chưa gán phòng"
                                }
                                
                            </ul>
                            <button className="btn-order info bottom-position"
                                onClick={handleSave}
                            >Lưu</button>
                        </div>


                    </div>
                </div>
            </div>
        </ModalStyle>
    );
}

const autoScroll = ()=>{
    
    const ul = document.querySelector('.modal-col-30 ul')
    ul.scrollTop = ul.scrollHeight;


}

function MenuItem({item, handleAdd}) {
    const [quantity, setQuantity] = useState(1);
  
    const handleQuantityChange = (event) => {
      setQuantity(parseInt(event.target.value));
    };
  
    return (
      <div>
        <div className="item">
            <div className="box-content">
                <div className="img-menu">
                    <img src={item.HinhAnh} style={{width: 100, height: 100}}/>
                </div>
                <div className="box-menu">
                    <div className="name-menu">
                        {item.TenMon}
                    </div>
                    <div>
                        {convertToVND(item.GiaMon)}
                    </div>
                </div>
            </div>

            <div className="btn-group">
                <input type="number" min={1} defaultValue={1} value={quantity} onChange={handleQuantityChange} />
                <button className="btn-order handle"
                        onClick={async()=>{
                            await handleAdd(item, quantity)
                            autoScroll()

                        }}
                                                >Thêm</button>
            </div>
            <div className="clear"></div>
        </div>
      
      </div>
    );
  }


const ModalStyle = styled.div`
    .modal-add-over{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;

        .modal-add{
            padding: 10px;
            width: 90%;
            height: 90%;
            border-radius: 10px;
            background-color: #fff;
            z-index: 1001;
            .modal-add-header{
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #000;
                h2{
                    font-size: 22px;
                    font-weight: 500;
                }

                .close{
                    font-size: 35px;
                    color: #000;
                    cursor: pointer;
                }
            }
        }

        .modal-add-body{
            padding: 10px 0 0 0 ;
            display: flex;
            height: inherit;


            .modal-col-70{
                width: calc(70% - 10px);
                min-width: calc(70% - 10px);
                margin-right: 10px;
                height: 100%;
                overflow-y : auto;

                ::-webkit-scrollbar {
                    display: none;
                }

                .title-dropdown{
                    display: flex;
                    width: 100%;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;

                    .dropdown-menu{
                        width: 300px;
                        height: 70px;
                    }
                }





                ul{
                    list-style-type: none;
                    padding : 0;
                    
                    margin: 0 -5px;
                    display: flex;
                    flex-wrap: wrap;

                    li{
                        padding: 0 5px;
                        width: 50%;
                        min-width:50%;
                        max-width:50%;
                        margin-bottom: 10px;
                        .item{
                            width: 100%;
                            background-color: #f3f3f3;
                            border-radius : 10px;
                            padding : 10px;


                            .box-content{
                                display : flex;
                                

                                .box-menu{
                                    flex : 1;
                                    padding-left : 10px;

                                    .name-menu{
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                        display: -webkit-box;
                                        -webkit-line-clamp: 3; 
                                        -webkit-box-orient: vertical;
                                        line-height: 20px;
                                        margin-bottom: 5px;
                                    }

                                }
                                .img-menu{
                                    

                                    img{
                                        border-radius : 5px;
                                        object-fit : contain;
                                    }
                                }
                            }

                            
                        }
                    }
                }
            }
            .modal-col-30{
                width: 30%;
                min-width: 30%;
                height: 100%;
                position: relative;


                .flex-d{
                    display: flex;
                    align-items:center;
                    justify-content: space-between;
                }

                ul{
                    list-style-type: none;
                    padding : 0;
                    height : 85%;
                    overflow-y : auto;
                    scroll-behavior: smooth;

                    ::-webkit-scrollbar {
                        display: none;
                    }
                    li{
                        margin-bottom: 10px;
                        display: block;


                        &.item{
                            width: 100%;
                            background-color: #f3f3f3;
                            border-radius : 10px;
                            padding : 10px;


                            .box-content{
                                display : flex;
                                

                                .box-menu{
                                    flex : 1;
                                    padding-left : 10px;

                                    .name-menu{
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                        display: -webkit-box;
                                        -webkit-line-clamp: 3; 
                                        -webkit-box-orient: vertical;
                                        line-height: 20px;
                                        margin-bottom: 5px;
                                    }

                                }
                                .img-menu{
                                    

                                    img{
                                        border-radius : 5px;
                                        object-fit : contain;
                                    }
                                }
                            }

                            
                        }
                    }
                }
                .bottom-position{
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }
            }
        }
        .modal-add-footer{
            text-align : right;
        }
        .btn-group{
            float: right;
            justify-content: flex-end;

            input{
                width: 50px;
                border-radius: 10px;
                border: 1px solid;
            }
            
            .btn-order{

            }
        }
        .clear{
            clear: both;
        }
        .btn-order{
            border: none;
            outline: none;
            padding: 5px 10px;
            color: #fff;
            font-weight: bold;
            border-radius: 10px;
            margin: 0 5px;
            margin-left: 10px;
            :hover {
              opacity: 0.8;
            }
    
            &.handle{
                background-color: #007bff;
            }
            &.success{
              background-color: #28a745;
              
            }
            &.cancel{
              background-color: #dc3545;
            }
            &.fail{
                background-color: #6c757d;
              }
            &.info{
                background-color: #17a2b8;
            }
          }
    }
    

`
export default ModalAddMenu;