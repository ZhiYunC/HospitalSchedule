let currentDate = new Date(); // 現在時間
let twoMonthsLater = new Date(currentDate.setMonth(currentDate.getMonth() + 2)); // 兩個月後
let year = twoMonthsLater.getFullYear(); // 兩個月後年
let month = twoMonthsLater.getMonth() + 1; // 兩個月後月 (JavaScript 的月份是從 0 開始的，所以需要加 1)

// 使用 fetch 加载共享的 HTML 内容
fetch('/Doctor/DoctorShare')
    .then(response => response.text())
    .then(html => {
        // 将加载的 HTML 插入到共享容器中
        document.getElementById('sharedContentContainer').innerHTML = html;
    }
);
$(document).ready(function() {
    
    $.ajax({
        url: '/Doctor/GetDoctorState',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            const departmentElement = $('#SaveSchedule');
            if (response==true) {
                departmentElement.text("已確認班表");
                departmentElement.prop('disabled', true);
                departmentElement.removeClass().addClass('alrightsave-scheduling');
            } else {
                departmentElement.text("確認班表");
                departmentElement.removeClass().addClass('save-scheduling');
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX request failed:", status, error);
        }
    });
    // 顯示排班提示信息
    // 獲取當前日期
    var today = new Date();
    // var currentYear = today.getFullYear();
    var currentMonth = today.getMonth() + 1; 
    var nextTwoMonth = currentMonth+2;
    var currentDate = today.getDate();
    if (currentDate>20 && currentDate<25){
        //原$('#noteText').text('請盡快前往"排班頁面"填寫 '+nextTwoMonth+'月不想上班日期！');
        $('.note').show();
    }else if (currentDate>25 && currentDate<28){
        //原$('#noteText').text('系統排班中~');
        $('.note').show();
    }else if (currentDate>27 && currentDate<31){
        // $('#noteText').text('請盡快前往"排班頁面"填寫 '+nextTwoMonth+'月不想上班日期！');
        $('#noteText').text(nextTwoMonth+'月班表已產出，請盡快確認！');
        $('.note').show();
    }else{
        $('.note').hide();
    }
});
// 定義一個對象來存儲每個科別的細分部門
const subDepartmentsData = {
    '內科部': ['內科', '胃腸肝膽科', '新陳代謝科', '胸腔內科', '腎臟內科', '一般內科', '血液腫瘤科', '風濕免疫科', '感染科'],
    '外科部': ['外科', '神經外科', '大腸直腸外科', '乳房外科', '一般外科', '心臟血管外科', '整形外科', '胸腔外科', '小兒外科', '外傷科'],
    '心臟血管醫學部': ['心臟內科'],
    '兒童醫學部': ['兒童醫學科'],
    '婦產部': ['婦產科'],
    '其他專科': ['骨科', '泌尿科', '眼科', '耳鼻喉科', '皮膚科', '精神科', '神經科', '復健科', '家庭醫學科', '流感疫苗-家醫', 
    '職業醫學科', '疼痛/麻醉科', '牙科', '口腔顎面科', '兒童牙科', '影像醫學科門診', '放射腫瘤科', '核子醫學科'],
    '特色中心': ['聖路加美容醫學', '腦血管介入治療', '運動醫學中心', '營養諮詢', '智慧科學體重管理中心'],
    '新冠肺炎專區': ['新冠肺炎康復後整合門診', 'COVID-19疫苗注射-FM']
};
// 關閉提示訊息
$('#closeNote').click(function(){
    $('.note').hide();
})
// 系科別顯示
$('#departmentSelect').change(function(){
    var department = $(this).val();
    var subDepartments = subDepartmentsData[department] || [];
     // 清空細分部門下拉選單
     $('#sub-departmentSelect').empty();
    // / 建立細分部門按鈕的 HTML
    var subDepartmentsHtml = subDepartments.map(function(sub) {
        return `<option value="${sub}">${sub}</option>`;
    }).join('');
    // 插入細分部門按鈕到頁面中
    // var subDepartmentsContainer = document.getElementById('sub-departmentSelect');
    // subDepartmentsContainer.innerHTML = subDepartmentsHtml;
    $('#sub-departmentSelect').html(subDepartmentsHtml);
})
// 讀取班表
// $('#sub-departmentSelect').change(function(){
//     var year = "2024";
//     var month = "3";
//     var subdepartment = $('#sub-departmentSelect').val();
//     //班表 
//     $.ajax({
//         url: '../Doctor/GetScheduleData', // 替換成你的Controller名稱
//         type: 'GET',
//         data:{ year : year ,month :month ,subdepartment:subdepartment},
//         dataType: 'json',
//         success: function(data) {
//             // data 包含從控制器返回的 List<Doctor>
//             var doctorList = data;
//             var DoctorNames = [];
//             // 遍歷 doctorList 並提取醫生名字
//             for (var i = 0; i < doctorList.length; i++) {
//                 DoctorNames.push(doctorList[i]); // 假設 Doctor 類型有一個 Name 屬性
//             }
//             // console.log(DoctorNames);
//             generateCalendar(year, month,DoctorNames);
//         },
//         error: function(error) {
//             console.error('Failed to fetch schedule data from the server.');
//         }
//     });
//     //醫生班數
//     // $.ajax({
//     //     url: '../Manager/GetShiftData', // 替換成你的Controller名稱
//     //     type: 'GET',
//     //     data:{ year : year ,month :month ,subdepartment:subdepartment},
//     //     dataType: 'json',
//     //     success: function(dt) {
            
//     //         var shiftList = dt;
//     //         console.log(shiftList);
//     //         displayShift(shiftList);
//     //     },
//     //     error: function(error) {
//     //         console.error(error);
//     //     }
//     // });
// })

var subdepartment = $('#sub-departmentSelect').val();

//班表 
$.ajax({
    url: '../Doctor/GetScheduleData', // 替換成你的Controller名稱
    type: 'GET',
    data:{ year : year ,month :month ,subdepartment:subdepartment},
    dataType: 'json',
    success: function(data) {
        // data 包含從控制器返回的 List<Doctor>
        var doctorList = data;
        var DoctorNames = [];
        // 遍歷 doctorList 並提取醫生名字
        for (var i = 0; i < doctorList.length; i++) {
            DoctorNames.push(doctorList[i]); // 假設 Doctor 類型有一個 Name 屬性
        }
        // console.log(DoctorNames);
        generateCalendar(year, month,doctorList);
    },
    error: function(error) {
        console.error('Failed to fetch schedule data from the server.');
    }
});
// 顯示班表月曆
function generateCalendar(year, month,doctors) {
    // 取得月曆的第一天
    const firstDay = new Date(year, month-1, 1);
    // 取得當月的天數
    const daysInMonth = new Date(year, month ,0).getDate();
    // 取得第一天是星期幾
    const firstDayOfWeek = firstDay.getDay();
    // const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    // 找到日曆的容器
    const calendarBody = document.getElementById('calendar-body');
    // 清空日曆的容器
    calendarBody.innerHTML = '';
    // 生成月曆的日期
    let date = 1;
    // 在生成每個單元格時為其添加唯一的 ID
    const cell = document.createElement('td');
    cell.id = `day-${date}`;
    //儲存取得的排班人員
    var DoctorNames =doctors;
    var name=$('#navDoctorName').data('doctorname');
    // 計算所需的行數
    const numRows = Math.ceil((daysInMonth + firstDayOfWeek) / 7);
    for (let i = 0; i < numRows+2; i++) {
        // 創建一行
        const row = document.createElement('tr');
        let rowHasContent = false; 
        for (let j = 0; j < 7; j++) {
            // 創建一個單元格
            const cell = document.createElement('td');
            // const dutyClass = getDutyClass(DoctorNames[date - 1]);
            if (i === 0 && j < firstDayOfWeek) {
                // 填充空白的單元格
                cell.textContent = '';
            } else {
                // 填充日期
                if(doctors.length<1){
                    if (date <= daysInMonth) {
                        const existingContent = cell.innerHTML;
                        cell.innerHTML = existingContent + `<span id="day-${date}" class="calendar-day">${date}</span>`;
                        // cell.innerHTML = existingContent + `<span id="day-${date}" class="calendar-day">${date}<br>${DoctorNames[date-1]}</span>`;
                        // cell.innerHTML = existingContent + `<span id="day-${date}" class="calendar-day ${dutyClass}">${date}<br>${DoctorNames[date-1]}</span>`;
                        // cell.innerHTML = existingContent + `<td><span id="day-${date}" class="calendar-day }">${date}<br><div class="${dutyClass}">${DoctorNames[date-1]}</span></td>`;
                        // cell.innerHTML = existingContent + `<span id="day-${date}" class="calendar-day" >${DoctorName[date]}</span>`;
                        date++;
                        rowHasContent = true;
                    } else {
                        // 超過當月的天數，填充空白的單元格
                        cell.textContent = '';
                    }
                }else{
                    // const dutyClass = getDutyClass(DoctorNames[date - 1]);
                    if (date <= daysInMonth) {
                        const existingContent = cell.innerHTML;
                        
                        // console.log("doctor.js");
                        // console.log(name);
                        var color = getDutyClass(name,doctors[date-1].schedule_doctor_name);  
                        // cell.innerHTML = existingContent + `<td><span id="day-${date}" class="calendar-day }">${date}<br><div class="${dutyClass}">${DoctorNames[date-1]}</span></td>`;
                        // cell.innerHTML = existingContent + `<td><span id="day-${date}" class="calendar-day }">${date}<br><div >${DoctorNames[date-1]}</span></td>`;
                        cell.innerHTML = existingContent + `<td><span class="calendar-day" data-date="${date}" >${date}<div id="doctor" class="${color}" style="font-weight: bold!important;">${doctors[date-1].schedule_doctor_name}</span></td>`;
                        date++;
                        rowHasContent = true;
                    } else {
                        // 超過當月的天數，填充空白的單元格
                        cell.textContent = '';
                    }
                }
                
            }
            // 將單元格添加到行中
            row.appendChild(cell);
        }
        // 將行添加到日曆的容器
        // calendarBody.appendChild(row);
        // 只有在行中有內容時才將行添加到日曆的容器中
        if (rowHasContent) {
            calendarBody.appendChild(row);
        }
    }
    // 更新當前月份顯示
    // document.getElementById('currentMonthText').textContent = `${year} 年 ${month} 月`;
    document.getElementById('currentMonthText').textContent = year + ` 年 ` + month + ` 月`;
}

function getDutyClass(nowdoctor, doctorName) {
    if (nowdoctor === doctorName) {
        return 'blue-background';
    } else {
        return 'defalut-background';
    }
}
// $('#SaveSchedule').click(function(){
//     $.ajax({
//         url: '../Doctor/UpdateState', // 替換成你的Controller名稱
//         type: 'POST',
//         data:{},
//         dataType: 'json',
//         success: function(data) {
//             // data 包含從控制器返回的 List<Doctor>
//             $(this).text()="已確認班表";
//         },
//         error: function(error) {
//             console.error('Failed to fetch schedule data from the server.');
//         }
//     });
// })

$('#SaveSchedule').click(function() {
    Swal.fire({
        icon: 'question',
        title: '確定班表',
        text: '確定沒有要修正嗎?',
        showCancelButton: true,
        confirmButtonText: "確認",
        cancelButtonText: "取消"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '../Doctor/UpdateState', // 替換成你的Controller名稱
                type: 'POST',
                data: {},
                dataType: 'json',
                success: function(data) {
                    // data 包含從控制器返回的 List<Doctor>
                    $('#SaveSchedule').text("已確認班表");
                    $('#SaveSchedule').removeClass('save-scheduling').addClass('alrightsave-scheduling');
                    $('#SaveSchedule').prop('disabled', true);
                },
                error: function(error) {
                    console.error('Failed to fetch schedule data from the server.');
                }
            });
        } else {
            // 如果使用者選擇取消，可以在這裡添加相應的處理邏輯（可選）
            console.log('User canceled the confirmation.');
        }
    });
});
