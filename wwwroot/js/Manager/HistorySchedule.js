// 定義一個對象來存儲每個科別的細分部門
const subDepartmentsData = {
    // null:['請先選擇部門'],
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
$('#yearSelector,#monthSelector,#sub-departmentSelect').change(function(){
    var year = $('#yearSelector').val();
    var month = $('#monthSelector').val();
    var subdepartment = $('#sub-departmentSelect').val();
    //月曆表格 
    $.ajax({
        url: '../Manager/GetScheduleData', // 替換成你的Controller名稱
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
            generateCalendar(year, month,DoctorNames);
        },
        error: function(error) {
            console.error('Failed to fetch schedule data from the server.');
        }
    });
    //醫生班數表格
    $.ajax({
        url: '../Manager/GetShiftData', // 替換成你的Controller名稱
        type: 'GET',
        data:{ year : year ,month :month ,subdepartment:subdepartment},
        dataType: 'json',
        success: function(dt) {
            
            var shiftList = dt;
            console.log(shiftList);
            displayShift(shiftList);
        },
        error: function(error) {
            console.error(error);
        }
    });
})
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
                        // cell.innerHTML = existingContent + `<td><span id="day-${date}" class="calendar-day }">${date}<br><div class="${dutyClass}">${DoctorNames[date-1]}</span></td>`;
                        cell.innerHTML = existingContent + `<td><span id="day-${date}" class="calendar-day }">${date}<br><div >${DoctorNames[date-1]}</span></td>`;
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
    document.getElementById('currentMonthText').textContent = `${year} 年 ${month} 月`;
}
//顯示醫生班數
function displayShift(shift) {
    // 在表格中顯示醫生列表
    var tableBody = $('#doctors-body');
    tableBody.empty(); // 清空表格內容

    // 將每位醫生添加到表格中
    shift.forEach(function(doctor) {
        var row = $('<tr>');
        row.append('<td>' + doctor.doctor_Name + '</td>');
        row.append('<td>' + doctor.shift + '</td>');
        // 如果有其他欄位，可以在此添加
        tableBody.append(row);
    });
}
function getDutyClass(dutyNames) {
    const colorMap = {
        '陳芷芸': 'green-background',
        '林書榆': 'blue-background',
        '萬家妤': 'purple-background'
    };
    return dutyNames.split('、').map(name => colorMap[name] || 'default-background').join(' ');
}