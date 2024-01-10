<script setup>
import { ref, onMounted, computed, toRefs, reactive, watch } from 'vue';
import router from '../router';


const tableData1 = ref([]);
const tableData2 = ref([]);
const tableData3 = ref([]);
const tableData4 = ref([]);
const sortTable = ref([]);
const sortTable2 = ref([]);

const isAdmin = ref(true);
const getData = () => {
  // const IDdata = new URLSearchParams();
  // IDdata.append('id', localStorage.getItem("fakeID").toString());
  fetch("https://db.explosion.tw/is_admin", {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => response.json())
    .then(data => {
      // 處理響應數據
      if (data['result'] === 0)
        isAdmin.value = false;
    })
    .catch(error => {
      // 處理錯誤
      console.error('Error:', error);
    });
  fetch("https://db.explosion.tw/show_track_order", {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => response.json())
    .then(data => {
      // 處理響應數據
      for (var i = 0; i < data.length; i++) {
        const newRow = {
          supplierId: data[i]['supplierId'],
          supplierName: data[i]['supplierName'],
          idNumber: data[i]['idNumber'],
          customerName: data[i]['customerName'],
          unit: data[i]['unit'],
          productName: data[i]['productName'],
          unitPrice: data[i]['unitPrice'],
          quantity: data[i]['quantity'],
          orderDate: data[i]['orderDate'],
          estSubDate: data[i]['estSubDate'],
          actSubDate: data[i]['actSubDate'],
          isEditing: false,
          isMoreOP: false,
          originalData: {},
        };
        // 將新的 row 添加到 tableData1 中
        tableData1.value.push(newRow);
      }
    })
    .catch(error => {
      // 處理錯誤
      console.error('Error:', error);
    });
  fetch("https://db.explosion.tw/show_restock", {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => response.json())
    .then(data => {
      for (var i = 0; i < data.length; i++) {
        const newRow = {
          supplierId: data[i]['supplierId'],
          supplierName: data[i]['supplierName'],
          responsible: data[i]['responsible'],
          productName: data[i]['productName'],
          location: data[i]['location'],
          specification: data[i]['specification'],
          unitPrice: data[i]['unitPrice'],
          unit: data[i]['unit'],
          quantity: data[i]['quantity'],
          totalAmount: data[i]['totalAmount'],
          purchaseDate: data[i]['purchaseDate'],
          isEditing: false,
          isMoreOP: false,
          originalData: {},
        };
        // 將新的 row 添加到 tableData1 中
        tableData2.value.push(newRow);
        sortTable2.value.push(newRow);

      }

    })
    .catch(error => {
      // 處理錯誤
      console.error('Error:', error);
    });
  fetch("https://db.explosion.tw/show_accounts_receivable", {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => response.json())
    .then(data => {
      // 處理響應數據
      for (var i = 0; i < data.length; i++) {
        const newRow = {
          idNumber: data[i]['idNumber'],
          customerName: data[i]['customerName'],
          phoneNumber: data[i]['phoneNumber'],
          address: data[i]['address'],
          age: data[i]['age'],
          occupation: data[i]['occupation'],
          amount: data[i]['amount'],
          pendingAmount: data[i]['pendingAmount'],
          dueDate: data[i]['dueDate'],
          status: data[i]['status'],
          isEditing: false,
          isMoreOP: false,
          originalData: {},
        };
        tableData3.value.push(newRow);
      }
      
    })
    .catch(error => {
      // 處理錯誤
      console.error('Error:', error);
    });
  fetch("https://db.explosion.tw/show_cutomer_info", {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => response.json())
    .then(data => {
      // 處理響應數據
      for (var i = 0; i < data.length; i++) {
        const newRow = {
          idNumber: data[i]['idNumber'],
          customerName: data[i]['customerName'],
          phoneNumber: data[i]['phoneNumber'],
          address: data[i]['address'],
          age: data[i]['age'],
          occupation: data[i]['occupation'],
          registrationDate: data[i]['registrationDate'],
          imageSrc: data[i]['imageSrc'],
          status: data[i]['status'],
          permission: data[i]['permission'],
          isEditing: false,
          isMoreOP: false,
          originalData: {},
        };
        tableData4.value.push(newRow);
        sortTable.value.push(newRow);
      }
    })
    .catch(error => {
      // 處理錯誤
      console.error('Error:', error);
    });

}
getData();
const exit = () => {
  localStorage.clear();
  router.replace('/');
};
const orderHistory = ref(true)
const supplierSetting = ref(true)
const customerSetting = ref(true)
const handleFileChange = (event) => {
  
  tableData4.value[tableData4.value.length - 1]['imageSrc'] = event.target.files[0]
  
};


const normalStatusCount = computed(() => {
  return tableData4.value.filter(item => item.status === '正常').length;
});

const stoppedStatusCount = computed(() => {
  return tableData4.value.filter(item => item.status === '停用').length;
});

const averageAge = computed(() => {
  const totalAge = tableData4.value.reduce((sum, item) => sum + parseInt(item.age), 0);
  return totalAge / tableData4.value.length;
});
const filterType4 = ref('week'); // 初始选择为年

const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1); // 月份是 1 到 12
const selectedWeek = ref(1); // 假设周数从 1 开始

// 获取数据中的所有年份
const uniqueYears = computed(() => {
  return Array.from(new Set(tableData1.value.map(item => getYearFromDate(item.orderDate))));
});

// 辅助函数，从日期字符串中获取年份
const getYearFromDate = (dateString) => {
  const dateObject = new Date(dateString);
  return dateObject.getFullYear();
};
// 获取所有的月份
const months = computed(() => {
  return Array.from({ length: 12 }, (_, index) => index + 1);
});

// 获取指定年月的总周数
const getWeeksInMonth = (year, month) => {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  const firstDayWeekNum = firstDayOfMonth.getDay(); // 获取第一天是星期几
  const lastDayWeekNum = lastDayOfMonth.getDay(); // 获取最后一天是星期几

  const daysInMonth = lastDayOfMonth.getDate(); // 获取月份总天数
  const daysInFirstWeek = 7 - firstDayWeekNum; // 获取第一周剩余天数

  // 计算总周数
  let totalWeeks = 1;

  for (let i = daysInFirstWeek + 1; i <= daysInMonth; i += 7) {
    totalWeeks++;
  }

  return totalWeeks;
};

// 获取所有的周数
const weeks = computed(() => {
  return Array.from({ length: getWeeksInMonth(selectedYear.value, selectedMonth.value) }, (_, index) => index + 1);
});
const totalCostForIdNumber2 = (idNumber) => {
  const filteredData = tableData2.value.filter(item => {
    const itemYear = getYearFromDate(item.purchaseDate);
    const itemMonth = new Date(item.purchaseDate).getMonth() + 1;
    const itemWeek = getWeekFromDate(itemYear, itemMonth, new Date(item.purchaseDate).getDate());

    switch (filterType4.value) {
      case 'year':
        return itemYear === selectedYear.value && item.productName === idNumber;
      case 'month':
        return itemYear === selectedYear.value && itemMonth === selectedMonth.value && item.productName === idNumber;
      case 'week':
        return itemYear === selectedYear.value && itemMonth === selectedMonth.value && itemWeek === selectedWeek.value && item.productName === idNumber;
      default:
        return item.productName === idNumber;
    }
  });

  return filteredData.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
};
const totalCostForIdNumber4 = (idNumber) => {
  const filteredData = tableData1.value.filter(item => {
    const itemYear = getYearFromDate(item.orderDate);
    const itemMonth = new Date(item.orderDate).getMonth() + 1;
    const itemWeek = getWeekFromDate(itemYear, itemMonth, new Date(item.orderDate).getDate());

    switch (filterType4.value) {
      case 'year':
        return itemYear === selectedYear.value && item.idNumber === idNumber;
      case 'month':
        return itemYear === selectedYear.value && itemMonth === selectedMonth.value && item.idNumber === idNumber;
      case 'week':
        return itemYear === selectedYear.value && itemMonth === selectedMonth.value && itemWeek === selectedWeek.value && item.idNumber === idNumber;
      default:
        return item.idNumber === idNumber;
    }
  });

  return filteredData.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
};

// 辅助函数，从日期获取该日期在月中的周数
const getWeekFromDate = (year, month, day) => {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const dayOfWeek = new Date(year, month - 1, day).getDay();
  const offset = (dayOfWeek + 7 - firstDayOfMonth.getDay()) % 7;

  return Math.ceil((day + offset) / 7);
};
const totalAllCosts2 = computed(() => {
  const allIdNumbers = Array.from(new Set(tableData2.value.map(item => item.productName)));
  return parseFloat(allIdNumbers.reduce((total, productName) => total + totalCostForIdNumber2(productName), 0).toFixed(2));
});
const totalAllCosts4 = computed(() => {
  const allIdNumbers = Array.from(new Set(tableData1.value.map(item => item.idNumber)));
  sortTableData();
  return allIdNumbers.reduce((total, idNumber) => total + totalCostForIdNumber4(idNumber), 0);
});
const createEditFunctions = (tableData) => {
  const startMore = (index) => {
    tableData.value[index].isMoreOP = true;
  };
  const startEditing = (index) => {

    tableData.value[index].originalData = { ...tableData.value[index] };
    tableData.value[index].isEditing = true;
    tableData.value[index].isMoreOP = false;
  };

  const saveChanges = async (index, apiEndpoint) => {

    tableData.value[index].isMoreOP = false;
    // Exclude isEditing and originalData from the payload
    const { isEditing, originalData, isMoreOP, ...dataToSend } = tableData.value[index];
    tableData.value[index].isEditing = false;
    tableData.value[index].originalData = { ...dataToSend };
    
    if (tableData == tableData4) {
      let Index = tableData3.value.findIndex(item => item.idNumber === originalData.idNumber);
      if (Index != -1) {
        tableData3.value[Index].idNumber = tableData.value[index].idNumber
        tableData3.value[Index].customerName = tableData.value[index].customerName
        tableData3.value[Index].phoneNumber = tableData.value[index].phoneNumber
        tableData3.value[Index].address = tableData.value[index].address
        tableData3.value[Index].age = tableData.value[index].age
        tableData3.value[Index].occupation = tableData.value[index].occupation
        tableData3.value[Index].status = tableData.value[index].status
      }
      Index = tableData1.value.findIndex(item => item.idNumber === originalData.idNumber);

      if (Index != -1) {
        tableData1.value[Index].idNumber = tableData.value[index].idNumber
        tableData1.value[Index].customerName = tableData.value[index].customerName
      }
      Index = sortTable.value.findIndex(item => item.idNumber === originalData.idNumber);
      if (Index != -1) {
        sortTable.value[Index].idNumber = tableData.value[index].idNumber
        sortTable.value[Index].customerName = tableData.value[index].customerName
        sortTable.value[Index].phoneNumber = tableData.value[index].phoneNumber
        sortTable.value[Index].address = tableData.value[index].address
        sortTable.value[Index].age = tableData.value[index].age
        sortTable.value[Index].occupation = tableData.value[index].occupation
        sortTable.value[Index].status = tableData.value[index].status
      }

    }
    else if (tableData == tableData3) {
      let choose = (originalData.idNumber == undefined)
      let idNumber;
      if (choose)
        idNumber = tableData.value[index].idNumber
      else
        idNumber = originalData.idNumber
      let Index = tableData4.value.findIndex(item => item.idNumber === idNumber);
      tableData4.value[Index].phoneNumber = tableData.value[index].phoneNumber
      tableData4.value[Index].address = tableData.value[index].address
      Index = sortTable.value.findIndex(item => item.idNumber === idNumber);
      sortTable.value[Index].phoneNumber = tableData.value[index].phoneNumber
      sortTable.value[Index].address = tableData.value[index].address
      Index = tableData1.value.findIndex(item => item.idNumber === idNumber);
      tableData1.value[Index].idNumber = tableData.value[index].idNumber
      tableData1.value[Index].customerName = tableData.value[index].customerName

    }
    
    const formData = new URLSearchParams();

    for (const key in dataToSend) {
      formData.append(key, dataToSend[key]);
    }
    
    // Make an HTTP request to your backend API with the specified endpoint
    fetch(`https://db.explosion.tw/` + apiEndpoint.toString(), {
      method: 'POST',
      credentials: 'include',
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded',
      //   // Add any other headers your API requires
      // },
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          // Handle errors
          console.error('Save failed:', response.status, response.statusText);
          throw new Error('Save failed');
        }
      })
      .then(data => {
        
      })
      .catch(error => {
        console.error('Network error:', error.message);
      });

  };
  const createChanges = async (index, apiEndpoint) => {
    tableData.value[index].isMoreOP = false;
    // Exclude isEditing and originalData from the payload
    const { isEditing, originalData, isMoreOP, ...dataToSend } = tableData.value[index];
    tableData.value[index].isEditing = false;
    tableData.value[index].originalData = { ...dataToSend };
    
    
    if (tableData == tableData3) {
      const idNumber = tableData.value[index].idNumber
      

      let Index = tableData4.value.findIndex(item => item.idNumber === idNumber);
      if (Index > 0) {
        tableData3.value[index].customerName = tableData4.value[Index].customerName
        tableData3.value[index].age = tableData4.value[index].age
        tableData3.value[index].occupation = tableData4.value[index].occupation
        tableData3.value[index].status = tableData4.value[index].status
      }
    }
    const formData = new FormData();
    let t4 = 0;
    for (const key in dataToSend) {
      
      // 如果是文件类型，使用 'imageSrc' 作为字段名
      if (key === 'imageSrc') {
        t4 = 1
        formData.append('imageSrc', dataToSend[key]);
      } else {
        // 其他属性直接添加
        formData.append(key, dataToSend[key]);
      }
    }
    // Make an HTTP request to your backend API with the specified endpoint
    fetch(`https://db.explosion.tw/` + apiEndpoint.toString(), {
      method: 'POST',
      credentials: 'include',
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded',
      //   // Add any other headers your API requires
      // },
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          if (t4 == 1) {
            tableData.value[index].imageSrc = "https://db.explosion.tw/get_customer_photo/" + (index).toString()
          }

          return response.json();
        } else {
          // Handle errors
          console.error('Save failed:', response.status, response.statusText);
          throw new Error('Save failed');
        }
      })
      .then(data => {
        // 在這裡處理資料
        

      })
      .catch(error => {
        console.error('Network error:', error.message);
      });

  };
  const cancelEditing = (index) => {
    Object.assign(tableData.value[index], tableData.value[index].originalData);
    tableData.value[index].isMoreOP = false;
    tableData.value[index].isEditing = false;
  };
  const confirmDelete = (index) => {
    // 判斷是否確認刪除
    tableData.value[index].isMoreOP = false;
    const isConfirmed = window.confirm('確定要刪除該行?');
    if (isConfirmed) {
      // 在這裡加入相應的處理邏輯，例如刪除對應的行
      tableData.value.splice(index, 1);
    }
  };
  const closeMoreOP = () => {
    tableData.value.forEach(item => {
      item.isMoreOP = false;
    });
  };
  return { startEditing, saveChanges, cancelEditing, confirmDelete, startMore, closeMoreOP, createChanges };
};

const {
  startEditing,
  saveChanges,
  cancelEditing,
  confirmDelete,
  startMore,
  closeMoreOP,
  createChanges
} = createEditFunctions(tableData1);

const {
  startEditing: startEditing2,
  saveChanges: saveChanges2,
  cancelEditing: cancelEditing2,
  confirmDelete: confirmDelete2,
  startMore: startMore2,
  closeMoreOP: closeMoreOP2,
  createChanges: createChanges2
} = createEditFunctions(tableData2);

const {
  startEditing: startEditing3,
  saveChanges: saveChanges3,
  cancelEditing: cancelEditing3,
  confirmDelete: confirmDelete3,
  startMore: startMore3,
  closeMoreOP: closeMoreOP3,
  createChanges: createChanges3
} = createEditFunctions(tableData3);

const {
  startEditing: startEditing4,
  saveChanges: saveChanges4,
  cancelEditing: cancelEditing4,
  confirmDelete: confirmDelete4,
  startMore: startMore4,
  closeMoreOP: closeMoreOP4,
  createChanges: createChanges4
} = createEditFunctions(tableData4);
const addList1 = () => {
  const newRow = {
    supplierId: '',
    supplierName: '',
    idNumber: '',
    customerName: '',
    unit: '',
    productName: '',
    unitPrice: '',
    quantity: '',
    orderDate: '',
    estSubDate: '',
    actSubDate: '',
    isEditing: true,
    isMoreOP: false,
    originalData: {},
  };
  // 將新的 row 添加到 tableData1 中
  tableData1.value.push(newRow);
};
const addList2 = () => {
  const newRow = {
    supplierId: '',
    supplierName: '',
    responsible: '',
    productName: '',
    location: '',
    specification: '',
    unitPrice: '',
    unit: '',
    quantity: '',
    purchaseDate: '--',
    isEditing: true,
    isMoreOP: false,
    originalData: {},
  };
  // 將新的 row 添加到 tableData1 中
  tableData2.value.push(newRow);
};
const addList3 = () => {
  const newRow = {
    idNumber: '',
    customerName: '',
    amount: '',
    pendingAmount: '',
    dueDate: '--',
    status: '',
    isEditing: true,
    isMoreOP: true,
    originalData: {},
  };
  // 將新的 row 添加到 tableData1 中
  tableData3.value.push(newRow);
};
const addList4 = () => {
  const newRow = {
    idNumber: '',
    customerName: '',
    phoneNumber: '',
    address: '',
    age: '',
    occupation: '',
    registrationDate: '--',
    imageSrc: '',
    status: '',
    permission: '',
    isEditing: true,
    isMoreOP: true,
    originalData: {},
  };
  // 將新的 row 添加到 tableData1 中
  tableData4.value.push(newRow);
};
const totalAllCosts = ref(0)
totalAllCosts.value = 0;

function filterOrders(table, filterArray, eq) {
  for (var i = 0; i < filterArray.length; i++) {
    filterArray[i] = filterArray[i].val().toUpperCase();
  }
  totalAllCosts.value = 0;

  $("#" + table + " tbody tr").each(function () {
    var showRow = true;
    for (var i = 0; i < eq.length; i++) {
      showRow = showRow && ($(this).find("td:eq(" + eq[i] + ")").text().toUpperCase().indexOf(filterArray[i]) > -1)
    }

    if (showRow) {
      $(this).show();
      if (table == "orderDetails2_2") {
        // Accumulate the total cost only for visible rows
        var price = parseFloat($(this).find("td:eq(8)").text());
        if (!isNaN(price)) {
          totalAllCosts.value += price;
        }
      }
    } else {
      $(this).hide();
    }
  });
}
// 排序相关的状态
const sortColumn = ref('totalCost');
const sortOrder = ref('desc'); // 默认降序排序

// 切换排序顺序
const toggleSortOrder = (column) => {
  if (sortColumn.value === column) {
    // 如果点击的是当前排序的列，切换排序方式
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
  } else {
    // 如果点击的是新的列，设置为默认的降序排序
    sortColumn.value = column;
    sortOrder.value = 'desc';
  }

  // 调用排序函数
  sortTableData();
};

const look_sum = () => {
  filterOrders("orderDetails2_2", [$("#supplierIdFilter7"), $("#supplierNameFilter7"), $("#productNameFilter7"), $("#dayFilter7")], [0, 1, 2, 9]);

}
const sortTableData = () => {
sortTable.value.forEach((row) => {
// 计算并存储totalCost
row.totalCost = totalCostForIdNumber4(row.idNumber);
});

sortTable.value.sort((a, b) => {
const aValue = a[sortColumn.value];
const bValue = b[sortColumn.value];

if (sortOrder.value === 'asc') {
return aValue - bValue;
} else {
return bValue - aValue;
}
});
};
// 获取排序图标
const sortIcon = (column) => {
  if (column === sortColumn.value) {
    return sortOrder.value === 'desc' ? '▼' : '▲';
  }
  return '';
};
onMounted(function () {
  // loginData();


  $("#supplierIdFilter1 , #supplierNameFilter1, #snFilter1, #userNameFilter1").on("input", function () {
    filterOrders("orderDetails1", [$("#supplierIdFilter1"), $("#supplierNameFilter1"), $("#snFilter1"), $("#userNameFilter1")], [0, 1, 2, 3]);
  });
  $("#supplierIdFilter2 , #supplierNameFilter2, #productNameFilter2").on("input", function () {
    filterOrders("orderDetails2", [$("#supplierIdFilter2"), $("#supplierNameFilter2"), $("#productNameFilter2")], [0, 2, 3]);
  });
  $("#snFilter3 , #userNameFilter3").on("input", function () {
    filterOrders("orderDetails3", [$("#snFilter3"), $("#userNameFilter3")], [0, 1]);
  });
  $("#snFilter4 , #userNameFilter4").on("input", function () {
    filterOrders("orderDetails4", [$("#snFilter4"), $("#userNameFilter4")], [0, 1]);
  });
  $("#snFilter5").on("input", function () {
    filterOrders("orderDetails1_1", [$("#snFilter5")], [0]);
  });
  $("#snFilter6 , #userNameFilter6").on("input", function () {
    filterOrders("orderDetails4_2", [$("#snFilter6"), $("#userNameFilter6")], [0, 1]);
  });
  $("#supplierIdFilter7 , #supplierNameFilter7, #productNameFilter7, #dayFilter7").on("input", function () {
    filterOrders("orderDetails2_2", [$("#supplierIdFilter7"), $("#supplierNameFilter7"), $("#productNameFilter7"), $("#dayFilter7")], [0, 1, 2, 9]);
  });
  // filterOrders("orderDetails2_2", [$("#supplierIdFilter7"), $("#supplierNameFilter7"), $("#productNameFilter7")], [0, 1, 2]);

  function setColors(primary, secondary) {
    $("#ot, #sc, #Supplier-settings-btn, #user-settings-btn").css("color", secondary);
    $(primary).css("color", "#111111");
  }
  setColors("#ot", "#a4a4a4");
  function animateLeft(distance) {
    $('.diff-op').animate({ left: distance }, 500);
  }

  $("#ot").on("click", function () {
    animateLeft("0%");
    setColors("#ot", "#a4a4a4");
  });
  $("#Supplier-settings-btn").on("click", function () {
    animateLeft("-100%");
    setColors("#Supplier-settings-btn", "#a4a4a4");
  });
  $("#sc").on("click", function () {
    animateLeft("-200%");
    setColors("#sc", "#a4a4a4");
  });
  $("#user-settings-btn").on("click", function () {
    animateLeft("-300%");
    setColors("#user-settings-btn", "#a4a4a4");
  });
});
</script>
<template>
  <body>
    <header>
      <div id="home" class="home">
        <span class="material-symbols-outlined food-bank">food_bank</span>
        <span>XO生鮮</span>

      </div>
      <button class="logout-btn" v-on:click="exit">
        <span class="material-symbols-outlined food-bank">logout</span>
        <span>登出</span>
      </button>
    </header>
    <br />
    <div class="top-btn-op">
      <button id="ot" class="top-btn" @click="filterType4 = 'week'">
        <span class="material-symbols-outlined">
          document_scanner
        </span>
        訂單紀錄</button>
      <button id="Supplier-settings-btn" @click="look_sum(); filterType4 = 'week'" class="top-btn">
        <span class="material-symbols-outlined ">shopping_cart</span>
        查看進貨
      </button>
      <button id="sc" class="top-btn">
        <span class="material-symbols-outlined">
          paid
        </span>
        應收帳款</button>
      <button id="user-settings-btn" class="top-btn" @click="filterType4 = 'year'">
        <span class="material-symbols-outlined ">manage_accounts</span>
        客戶資料
      </button>
    </div>
    <hr />
    <div id="diff" class="diff-op">
      <!-- 訂單紀錄 -->
      <div class="op-body" v-show="orderHistory">
        <h1>
          <span @click="orderHistory = true" style="color: #111111;">訂單紀錄</span>&nbsp;/&nbsp;
          <span @click="orderHistory = false" style="color: #c1c1c1;">統計資料</span>
        </h1>
        <div class="input">
          <div>
            <label for="supplierIdFilter1">供應商編號：</label>
            <input type="text" id="supplierIdFilter1">
          </div>
          <div>
            <label for="supplierNameFilter1">供應商名稱：</label>
            <input type="text" id="supplierNameFilter1">
          </div>
          <div>
            <label for="snFilter1">身分證字號：</label>
            <input type="text" id="snFilter1">
          </div>
          <div>
            <label for="userNameFilter1">客戶名稱：</label>
            <input type="text" id="userNameFilter1">
          </div>
        </div>
        <template>
          <div class="add-con" v-show="isAdmin">
            <span class="material-symbols-outlined add" @click="addList1">playlist_add</span>
          </div>
        </template>
        <table id="orderDetails1">
          <thead>
            <tr>
              <th>供應商編號</th>
              <th>供應商名稱</th>
              <th>身分證字號</th>
              <th>客戶名稱</th>
              <th>商品名稱</th>
              <th>單位</th>
              <th>商品單價</th>
              <th>商品數量</th>
              <th>訂貨金額</th>
              <th>訂貨日期</th>
              <th>預計遞交日期</th>
              <th>實際遞交日期</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableData1" :key="index" :class="{ even: index % 2 === 0, odd: index % 2 !== 0 }">
              <td>
                <template v-if="!row.isEditing">{{ row.supplierId }}</template>
                <template v-else>
                  <input v-model="row.supplierId" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.supplierName }}</template>
                <template v-else>
                  <input v-model="row.supplierName" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.idNumber }}</template>
                <template v-else>
                  <input v-model="row.idNumber" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.customerName }}</template>
                <template v-else>
                  <input v-model="row.customerName" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.productName }}</template>
                <template v-else>
                  <input v-model="row.productName" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.unit }}</template>
                <template v-else>
                  <input v-model="row.unit" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.unitPrice }}</template>
                <template v-else>
                  <input v-model="row.unitPrice" type="number" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.quantity }}</template>
                <template v-else>
                  <input v-model="row.quantity" type="number" />
                </template>
              </td>
              <td>{{ parseFloat(row.unitPrice * row.quantity).toFixed(2) }}</td>
              <td>
                <template v-if="!row.isEditing">{{ row.orderDate.replaceAll("-", "/") }}</template>
                <template v-else>
                  <input v-model="row.orderDate" type="date" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.estSubDate.replaceAll("-", "/") }}</template>
                <template v-else>
                  <input v-model="row.estSubDate" type="date" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.actSubDate.replaceAll("-", "/") }}</template>
                <template v-else>
                  <input v-model="row.actSubDate" type="date" />
                </template>
              </td>
              <td>

                <template v-if="row.isEditing">
                  <span class="material-symbols-outlined ck-btn"
                    @click="createChanges(index, 'create_track_order')">done</span>
                  <span class="material-symbols-outlined ck-btn" @click="confirmDelete(index)">delete</span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
      <div class="op-body" v-show="!orderHistory">
        <h1>
          <span @click="orderHistory = true" style="color: #c1c1c1;">訂單紀錄</span>&nbsp;/&nbsp;
          <span @click="orderHistory = false" style="color: #111111;">統計資料</span>
        </h1>
        <div class="statistics">
          <span>該周訂貨總金額: {{ totalAllCosts4 }}&nbsp;元</span>
        </div>
        <span>篩選條件:&nbsp;</span>
        <select v-model="selectedYear">
          <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
        </select>
        <span>年</span>
        <select v-if="filterType4 === 'month' || filterType4 === 'week'" v-model="selectedMonth">
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
        <span v-if="filterType4 === 'month' || filterType4 === 'week'">月</span>
        <span v-if="filterType4 === 'week'">第</span>
        <select v-if="filterType4 === 'week'" v-model="selectedWeek">
          <option v-for="week in weeks" :key="week" :value="week">{{ week }}</option>
        </select>
        <span v-if="filterType4 === 'week'">周</span>
        <div class="input">
          <div>
            <label for="snFilter5">身分證字號：</label>
            <input type="text" id="snFilter5">
          </div>
        </div>
        <table id="orderDetails1_1">
          <thead>
            <tr>
              <th>身分證字號</th>
              <th>客戶名稱</th>
              <th>年齡</th>
              <th>電話</th>
              <th>職業</th>
              <th>消費狀態</th>
              <th class="th" @click="toggleSortOrder('totalCost')">訂貨總金額{{ sortIcon('totalCost') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in sortTable" :key="index" :class="{ even: index % 2 === 0, odd: index % 2 !== 0 }">
              <td>
                {{ row.idNumber }}
              </td>
              <td>
                {{ row.customerName }}
              </td>
              <td>
                {{ row.age }}
              </td>
              <td>
                {{ row.phoneNumber }}
              </td>
              <td>
                {{ row.occupation }}
              </td>
              <td>
                {{ row.status }}
              </td>
              <td>{{ totalCostForIdNumber4(row.idNumber) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 查看進貨 -->
      <div class="op-body" v-show="supplierSetting">
        <h1>
          <span @click="supplierSetting = true" style="color: #111111;">查看進貨</span>&nbsp;/&nbsp;
          <span @click="supplierSetting = false" style="color: #c1c1c1;">統計資料</span>
        </h1>
        <div class="input">
          <div>
            <label for="supplierIdFilter2">供應商編號：</label>
            <input type="text" id="supplierIdFilter2">
          </div>
          <div>
            <label for="supplierNameFilter2">負責人名稱：</label>
            <input type="text" id="supplierNameFilter2">
          </div>
          <div>
            <label for="productNameFilter2">商品名稱：</label>
            <input type="text" id="productNameFilter2">
          </div>
        </div>
        <template>
          <div class="add-con" v-show="isAdmin">
            <span class="material-symbols-outlined add" @click="addList2">playlist_add</span>
          </div>
        </template>
        <table id="orderDetails2">
          <thead>
            <tr>
              <th>供應商編號</th>
              <th>供應商名稱</th>
              <th>負責人</th>
              <th>商品名稱</th>
              <th>庫存位置</th>
              <th>規格</th>
              <th>單價</th>
              <th>單位</th>
              <th>數量</th>
              <th>總金額</th>
              <th>進貨日期</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableData2" :key="index" :class="{ even: index % 2 === 0, odd: index % 2 !== 0 }">
              <td>
                <template v-if="!row.isEditing">{{ row.supplierId }}</template>
                <template v-else>
                  <input v-model="row.supplierId" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.supplierName }}</template>
                <template v-else>
                  <input v-model="row.supplierName" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.responsible }}</template>
                <template v-else>
                  <input v-model="row.responsible" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.productName }}</template>
                <template v-else>
                  <input v-model="row.productName" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.location }}</template>
                <template v-else>
                  <input v-model="row.location" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.specification }}</template>
                <template v-else>
                  <input v-model="row.specification" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.unitPrice }}</template>
                <template v-else>
                  <input v-model="row.unitPrice" type="number" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.unit }}</template>
                <template v-else>
                  <input v-model="row.unit" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">{{ row.quantity }}</template>
                <template v-else>
                  <input v-model="row.quantity" type="number" />
                </template>
              </td>
              <td>{{ parseFloat(row.unitPrice * row.quantity).toFixed(2) }}</td>
              <td>
                <template v-if="!row.isEditing">{{ row.purchaseDate.replaceAll("-", "/") }}</template>
                <template v-else>
                  <input v-model="row.purchaseDate" type="date" />
                </template>
              </td>
              <td>
                <template v-if="row.isEditing">
                  <span class="material-symbols-outlined ck-btn"
                    @click="createChanges2(index, 'create_restock')">done</span>
                  <span class="material-symbols-outlined ck-btn" @click="confirmDelete2(index)">delete</span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="op-body" v-show="!supplierSetting">
        <h1>
          <span @click="supplierSetting = true" style="color: #c1c1c1;">查看進貨</span>&nbsp;/&nbsp;
          <span @click="supplierSetting = false" style="color: #111111;">統計資料</span>
        </h1>
        <div class="statistics">
          <span>該期限進貨總金額: {{ totalAllCosts2 }}&nbsp;元</span>
        </div>
        <span>篩選條件:&nbsp;</span>
        <select v-model="selectedYear">
          <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
        </select>
        <span>年</span>
        <select v-if="filterType4 === 'month' || filterType4 === 'week'" v-model="selectedMonth">
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
        <span v-if="filterType4 === 'month' || filterType4 === 'week'">月</span>
        <span v-if="filterType4 === 'week'">第</span>
        <select v-if="filterType4 === 'week'" v-model="selectedWeek">
          <option v-for="week in weeks" :key="week" :value="week">{{ week }}</option>
        </select>
        <span v-if="filterType4 === 'week'">周</span>
        <div class="input">
          <div>
            <label for="supplierIdFilter7">供應商編號：</label>
            <input type="text" id="supplierIdFilter7">
          </div>
          <div>
            <label for="supplierNameFilter7">負責人名稱：</label>
            <input type="text" id="supplierNameFilter7">
          </div>
          <div>
            <label for="productNameFilter7">商品名稱：</label>
            <input type="text" id="productNameFilter7">
          </div>
          <div>
            <label for="dayFilter7">日期：</label>
            <input type="text" id="dayFilter7">
          </div>
        </div>
        <table id="orderDetails2_2">
          <thead>
            <tr>
              <th>供應商編號</th>
              <th>負責人</th>
              <th>商品名稱</th>
              <th>庫存位置</th>
              <th>規格</th>
              <th>單價</th>
              <th>單位</th>
              <th>數量</th>
              <th>總金額</th>
              <th>進貨日期</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in sortTable2" :key="index" :class="{ even: index % 2 === 0, odd: index % 2 !== 0 }">
              <td>
                {{ row.supplierId }}
              </td>
              <td>
                {{ row.responsible }}
              </td>
              <td>
                {{ row.productName }}
              </td>
              <td>
                {{ row.location }}
              </td>
              <td>
                {{ row.specification }}
              </td>
              <td>
                {{ row.unitPrice }}
              </td>
              <td>
                {{ row.unit }}
              </td>
              <td>
                {{ row.quantity }}
              </td>
              <td>
                {{ parseFloat(totalCostForIdNumber2(row.productName)).toFixed(2) }}
              </td>

              <td>
                {{ row.purchaseDate.replaceAll("-", "/") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 應收帳款 -->
      <div class="op-body">
        <h1>應收帳款</h1>
        <div class="input">
          <div>
            <label for="snFilter3">身分證字號：</label>
            <input type="text" id="snFilter3">
          </div>
          <div>
            <label for="userNameFilter3">客戶名稱：</label>
            <input type="text" id="userNameFilter3">
          </div>
        </div>
        <template>
          <div class="add-con" v-show="isAdmin">
            <span class="material-symbols-outlined add" @click="addList3">playlist_add</span>
          </div>
        </template>
        <table id="orderDetails3">
          <thead>
            <tr>
              <th>身分證字號</th>
              <th>客戶名稱</th>
              <th>電話</th>
              <th>住址</th>
              <th>年齡</th>
              <th>職業</th>
              <th>應收金額</th>
              <th>待催收金額</th>
              <th>應收日期</th>
              <th>消費狀態</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableData3" :key="index" :class="{ even: index % 2 === 0, odd: index % 2 !== 0 }">
              <td>
                <template v-if="!row.isMoreOP">
                  {{ row.idNumber }}
                </template>
                <template v-else>
                  <input v-model="row.idNumber" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isMoreOP">
                  {{ row.customerName }}
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">
                  {{ row.phoneNumber }}
                </template>
                <template v-else>
                  <input v-model="row.phoneNumber" type="tel" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">
                  {{ row.address }}
                </template>
                <template v-else>
                  <input v-model="row.address" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isMoreOP">
                  {{ row.age }}
                </template>
              </td>
              <td>
                <template v-if="!row.isMoreOP">
                  {{ row.occupation }}
                </template>
              </td>
              <td>
                <template v-if="!row.isMoreOP">
                  {{ parseFloat(row.amount).toFixed(2) }}
                </template>
                <template v-else>
                  <input v-model="row.amount" type="number" />
                </template>
              </td>
              <td>
                <template v-if="!row.isMoreOP">
                  {{ parseFloat(row.pendingAmount).toFixed(2) }}
                </template>
                <template v-else>
                  <input v-model="row.pendingAmount" type="number" />
                </template>
              </td>
              <td>
                <template v-if="!row.isMoreOP">
                  {{ row.dueDate.replaceAll("-", "/") }}
                </template>
                <template v-else>
                  <input v-model="row.dueDate" type="date" />
                </template>
              </td>
              <td>
                <template v-if="!row.isMoreOP">
                  {{ row.status }}
                </template>
              </td>
              <td>
                <template v-if="row.isEditing">
                  <template v-if="row.isMoreOP">
                    <span class="material-symbols-outlined ck-btn"
                      @click="createChanges3(index, 'create_accounts_receivable')">done</span>
                    <span class="material-symbols-outlined ck-btn" @click="confirmDelete3(index)">delete</span>
                  </template>
                  <template v-else>
                    <span class="material-symbols-outlined ck-btn"
                      @click="saveChanges3(index, 'update_cutomer_info')">done</span>
                    <span class="material-symbols-outlined ck-btn" @click="cancelEditing3(index)">close</span>
                  </template>
                </template>
                <template v-else>
                  <span class="material-symbols-outlined edit" @click="startEditing3(index)">edit</span>
                </template>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 客戶資料 -->

      <div class="op-body" v-show="customerSetting">
        <h1>
          <span @click="customerSetting = true" style="color: #111111;">客戶基本資料</span>&nbsp;/&nbsp;
          <span @click="customerSetting = false" style="color: #c1c1c1;">客戶統計資料</span>
        </h1>
        <div class="statistics">
          <span>用戶人數: {{ tableData4.length }}</span>
          <span>用戶平均年齡: {{ averageAge.toFixed(2) }}</span>
          <span>狀態人數(正常&nbsp;/&nbsp;停用): {{ normalStatusCount }}&nbsp;/&nbsp;{{ stoppedStatusCount }}</span>
        </div>
        <div class="input">
          <div>
            <label for="snFilter4">身分證字號：</label>
            <input type="text" id="snFilter4">
          </div>
          <div>
            <label for="userNameFilter4">客戶名稱：</label>
            <input type="text" id="userNameFilter4">
          </div>
        </div>
        <template>
          <div class="add-con" v-show="isAdmin">
            <span class="material-symbols-outlined add" @click="addList4">playlist_add</span>
          </div>
        </template>
        <table id="orderDetails4">
          <thead>
            <tr>
              <th>身分證字號</th>
              <th>客戶名稱</th>
              <th>電話</th>
              <th>住址</th>
              <th>年齡</th>
              <th>職業</th>
              <th>登載日期</th>
              <th>照片</th>
              <th>消費狀態</th>
              <th>權限</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableData4" :key="index" :class="{ even: index % 2 === 0, odd: index % 2 !== 0 }">
              <td>
                <template v-if="!row.isMoreOP">
                  {{ row.idNumber }}
                </template>
                <template v-else>
                  <input v-model="row.idNumber" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isMoreOP">
                  {{ row.customerName }}
                </template>
                <template v-else>
                  <input v-model="row.customerName" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">
                  {{ row.phoneNumber }}
                </template>
                <template v-else>
                  <input v-model="row.phoneNumber" type="tel" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">
                  {{ row.address }}
                </template>
                <template v-else>
                  <input v-model="row.address" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isMoreOP">
                  {{ row.age }}
                </template>
                <template v-else>
                  <input v-model="row.age" type="number" />
                </template>
              </td>
              <td>
                <template v-if="!row.isMoreOP">
                  {{ row.occupation }}
                </template>
                <template v-else>
                  <input v-model="row.occupation" type="text" />
                </template>
              </td>
              <td>
                <template v-if="!row.isMoreOP">
                  {{ row.registrationDate.replaceAll("-", "/") }}
                </template>
                <template v-else>
                  <input v-model="row.registrationDate" type="date" />
                </template>
              </td>
              <td>
                <template v-if="!row.isMoreOP">
                  <img :src="row.imageSrc" alt="Customer Image" />
                </template>
                <template v-else>
                  <input type="file" @change="handleFileChange" />
                </template>
              </td>
              <td>
                <template v-if="!row.isEditing">
                  {{ row.status }}
                </template>
                <template v-else>
                  <select v-model="row.status">
                    <option value="正常">正常</option>
                    <option value="停用">停用</option>
                  </select>
                </template>
              </td>
              <td>
                <template v-if="!row.isMoreOP">
                  {{ row.permission }}
                </template>
                <template v-else>
                  <input v-model="row.permission" type="text" />
                </template>
              </td>
              <td>
                <template v-if="row.isEditing">
                  <template v-if="row.isMoreOP">
                    <span class="material-symbols-outlined ck-btn"
                      @click="createChanges4(index, 'create_cutomer_info')">done</span>
                    <span class="material-symbols-outlined ck-btn" @click="confirmDelete4(index)">delete</span>
                  </template>
                  <template v-else>
                    <span class="material-symbols-outlined ck-btn"
                      @click="saveChanges4(index, 'update_cutomer_info')">done</span>
                    <span class="material-symbols-outlined ck-btn" @click="cancelEditing4(index)">close</span>
                  </template>
                </template>
                <template v-else>
                  <span class="material-symbols-outlined edit" @click="startEditing4(index)">edit</span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="op-body" v-show="!customerSetting">
        <h1>
          <span @click="customerSetting = true" style="color: #c1c1c1;">客戶基本資料</span>&nbsp;/&nbsp;
          <span @click="customerSetting = false" style="color: #111111;">客戶統計資料</span>
        </h1>
        <div class="statistics">
          <span>用戶人數: {{ tableData4.length }}</span>
          <span>用戶平均年齡: {{ averageAge.toFixed(2) }}</span>
          <span>狀態人數(正常&nbsp;/&nbsp;停用): {{ normalStatusCount }}&nbsp;/&nbsp;{{ stoppedStatusCount }}</span>
          <div></div>
          <span>該期限訂貨總金額: {{ totalAllCosts4 }}&nbsp;元</span>
        </div>
        <span>篩選條件:&nbsp;</span>
        <label>
          <input type="radio" v-model="filterType4" value="year" name="dayfilter"> 每年
        </label>
        <label>
          <input type="radio" v-model="filterType4" value="month" name="dayfilter"> 每月
        </label>
        <label>
          <input type="radio" v-model="filterType4" value="week" name="dayfilter"> 每周
        </label>
        <select v-model="selectedYear">
          <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
        </select>
        <span>年</span>
        <select v-if="filterType4 === 'month' || filterType4 === 'week'" v-model="selectedMonth">
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
        <span v-if="filterType4 === 'month' || filterType4 === 'week'">月</span>
        <span v-if="filterType4 === 'week'">第</span>
        <select v-if="filterType4 === 'week'" v-model="selectedWeek">
          <option v-for="week in weeks" :key="week" :value="week">{{ week }}</option>
        </select>
        <span v-if="filterType4 === 'week'">周</span>
        <div class="input">
          <div>
            <label for="snFilter6">身分證字號：</label>
            <input type="text" id="snFilter6">
          </div>
          <div>
            <label for="userNameFilter6">客戶名稱：</label>
            <input type="text" id="userNameFilter6">
          </div>
        </div>


        <table id="orderDetails4_2">
          <thead>
            <tr>
              <th>身分證字號</th>
              <th>客戶名稱</th>
              <th>年齡</th>
              <th>職業</th>
              <th>消費狀態</th>
              <th>訂貨總金額</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableData4" :key="index" :class="{ even: index % 2 === 0, odd: index % 2 !== 0 }">
              <td>
                {{ row.idNumber }}
              </td>
              <td>
                {{ row.customerName }}
              </td>
              <td>
                {{ row.age }}
              </td>
              <td>
                {{ row.occupation }}
              </td>
              <td>
                {{ row.status }}
              </td>
              <td>{{ totalCostForIdNumber4(row.idNumber) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </body>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
  width: 100%;
  overflow-x: hidden;
  min-width: 1136px;
}

header {
  position: relative;
  background-color: #333;
  color: #fff;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0px 0px 0px 0px;
}

.even {
  background-color: #ffffff;
}

.odd {
  background-color: #efefef;
}

.ck-btn {
  position: relative;
  background-color: #e7e7e7;
  border: 1px solid #6f6f6f;
  border-radius: 3px;
  padding: 0px 0px 0px 0px;
  margin-left: 5px;
  cursor: pointer;
}

.logout-btn {
  position: absolute;
  right: 20px;
  color: #fff;
  border: none;
  height: 100%;
  font-size: 1.2em;

  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: transparent;
}

.home {
  position: absolute;
  left: 5px;
  width: fit-content;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 2em;
  cursor: pointer;
  padding-left: 20px;
}

.food-bank {
  font-size: 1.5em;
  color: #fff;
}


img {
  width: 50px;
}

section {
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1,
h2 {
  color: #333;
}

.diff-op {
  position: relative;
  display: flex;
  width: 400%;

}

.op-body {
  position: relative;
  padding: 30px;
  padding-bottom: 50px;
  width: 100%;
}

p {
  color: #666;
}

.cta-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
}

.home {
  position: relative;
  left: 5px;
  width: fit-content;
  height: 100%;
  display: flex;
  font-size: large;
  align-items: center;
  font-size: 2em;
  cursor: pointer;
}

table {
  border-collapse: collapse;
  margin-top: 20px;
  overflow-x: scroll;
  width: 100%;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  width: fit-content;
  max-width: 120px;
}

th {
  background-color: #333;
  color: #fff;
}

input,
select {
  padding: 10px;
  position: relative;
  border: 1px solid #aeaeae;
  outline: none;
  font-size: 16px;
  border-left: none;
  border-top: none;
  border-right: none;
  border-radius: 5px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  background-color: transparent;
  box-sizing: border-box;
}

input:hover,
select:hover {
  border-color: #78c9f2;
}

table input,
table select {
  width: 100%;
}

input:focus,
select:focus {
  border-color: #4285f4;
  box-shadow: 0 0 5px 0 rgba(66, 133, 244, 0.5);
}

.input {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.top-btn-op {
  position: sticky;
  width: 100%;
  display: flex;
  justify-items: center;
  justify-content: space-around;
}

.top-btn {
  width: fit-content;
  display: inline-flex;
  padding: 5px;
  align-items: center;
  justify-content: space-around;
  height: fit-content;
  background-color: transparent;
  color: #111111;
  font-size: 1.5em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit {
  cursor: pointer;
  border-radius: 5px;
  padding: 2px;
}

.edit:hover {
  background-color: #ddd;
}

.del-btn {
  color: red;
}

h1 {
  display: flex;
  align-items: center;
}

h1 span {
  cursor: pointer;
  /* color: #111111; */
}

.add-con {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  right: 10px;
}

.add {


  font-size: 2em;
  cursor: pointer;
  margin-top: 20px;
  width: 40px;
}

.more-dt-opt {
  position: fixed;
  /* 將 position 設置為 fixed */
  width: 30px;
  display: block;
  align-items: center;
  /* top: 0px; */
  /* left: -5px; */
  z-index: 1;
  background-color: #f6f6f6;
  border: 1px solid black;
  border-radius: 5px;
}

.statistics {
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  font-size: 1em;
  align-items: flex-end;
  flex-wrap: nowrap;
  flex-direction: column;
}

.statistics span {
  padding: 2px;
}

.th {
  cursor: pointer;
}
</style>
