// FUN：建立月曆
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
    // 計算所需的行數
    const numRows = Math.ceil((daysInMonth + firstDayOfWeek) / 7);
    // 計算每個醫生的班數
    const doctorShiftCounts = {};
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
                // !沒排班
                if(doctors.length<1){
                    // 更新當前月份顯示
                    document.getElementById('currentMonthText').textContent = `尚未排班`; 
                    if (date <= daysInMonth) {
                        const existingContent = cell.innerHTML;
                        cell.innerHTML = existingContent + `<span id="day-${date}" class="calendar-day">${date}</span>`;
                        date++;
                        rowHasContent = true;
                    } else {
                        // 超過當月的天數，填充空白的單元格
                        cell.textContent = '';
                    }
                    // !有排班
                }else{
                    // 更新當前月份顯示
                    // document.getElementById('currentMonthText').textContent = `${year} 年 ${month} 月 暫定班表`;
                    // document.getElementById('currentMonthText').textContent = `2024 年 7 月 暫定班表`;
                    // document.getElementById('EditSchedule').textContent = `編輯班表`;
                    
                    // const dutyClass = getDutyClass(DoctorNames[date - 1]);
                    if (date <= daysInMonth) {
                        const existingContent = cell.innerHTML;
                        var color = getDutyClass(doctors[date-1].schedule_doctor_color);  
                        cell.id = `day-${date}`;
                        // cell.innerHTML = existingContent + `<td><span class="calendar-day" data-date="${date}" >${date}<div id="doctor" class="${color}">${doctors[date-1].schedule_doctor_name}</span></td>`;
                        cell.innerHTML = existingContent + `<td  style="min-height:90px !important"><span class="calendar-day" data-date="${date}" >${date}<div id="draggable-${date}" class="draggable" draggable="true" data-doctorname="${doctors[date-1].schedule_doctor_name}" style="${color}margin: 3px auto !important;">${doctors[date-1].schedule_doctor_name}</div><div id="unfavdate-${date}"></div></span></td>`;
                        // // 計算班數
                        // if (doctorShiftCounts[doctors[date-1].schedule_doctor_name]) {
                        //     doctorShiftCounts[doctors[date-1].schedule_doctor_name]++;
                        // } else {
                        //     doctorShiftCounts[doctors[date-1].schedule_doctor_name] = 1;
                        // }
                        // cell.innerHTML = existingContent + `<td><span id="day-${date}" class="calendar-day }">${date}<br><div >${DoctorNames[date-1]}</span></td>`;
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
    // console.log(doctorShiftCounts);
    // displayDoctorShiftCounts(doctorShiftCounts);
}

// FUN：建立醫生班數表格
function displayShift(shift) {
    // 在表格中顯示醫生列表
    var tableBody = $('#doctors-body');
    tableBody.empty(); // 清空表格內容
    var doctorName=[];
    // 將每位醫生添加到表格中
    // shift.forEach(function(doctor) {
        for(i=1; i<shift.length+1;i++){
            doctorName.push(shift[i-1].doctor_Name);
            var color = getDutyClass(i);
            var state = getStateClass(shift[i-1].doctor_State);
            var row = $('<tr>');
            row.append('<td style="width: 10vh !important;font-size:16px;"><div class="doctor-style" style="width: 9vh !important;'+color+'; margin: 3px auto !important;">' + shift[i-1].doctor_Name +'</div><div class="flex" style=" align-items: center;justify-content:center;"><img  src="/image/phone.png" height="12px;"><div class="doctor-phone"> 0'+ shift[i-1].doctor_Phone +'</div></div></td>');
            row.append('<td style="width: 5vh !important;">' + shift[i-1].shift + '</td>');
            // row.append('<td>' + state + '</td>');
            // row.append('<td style="width: 10vh !important;"><img src="' + state +'" height="20" alt="wh"></img></td>');
            row.append('<td id="State" style="width: 5vh !important;">' + state +'</td>');
            
            // 如果有其他欄位，可以在此添加
            tableBody.append(row);
            // <img src="~/image/logo.png" height="10" ></img>
        }
    // }); 
}

function getDutyClass(doctorName) {
    const colorMap = {
        0: 'background-color: white',
        1: 'background-color: #e5a99b;',
        2: 'background-color: #9fb5e4;',
        3: 'background-color: #e49fcd;',
        4: 'background-color: #e4e49f;',
        5: 'background-color: #a6e9aea5;',
        6: 'purple-background',
        7: 'purple-background',
        8: 'purple-background',
        9: 'purple-background',
        10: 'purple-background',
        11: 'background-color:transparent !important;',
    };
    return colorMap[doctorName] || 'default-background';
}
function getStateClass(doctorState) {
    const stateMap = {
        // true:'/image/checked.png',
        // false:'/image/png'
        true:'<img  src="/image/check.png" height="20" alt="wh">',
        false:'<div id="state" data-detail="1234"></div>'
    };
    return stateMap[doctorState] || 'default';
}