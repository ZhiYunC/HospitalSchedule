// 初始載入頁面時生成當月月曆
// const currentDate = new Date();
// var currentYear = currentDate.getFullYear();
// var currentMonth =currentDate.getMonth();
// generateCalendar(currentYear, currentMonth);

$(document).ready(function() {
    // 獲取當前日期
    var today = new Date();
    var currentYear = today.getFullYear();
    var currentMonth = today.getMonth() + 1; 
    
    // 设置 #yearSelector 和 #monthSelector 的默认值
    $('#yearSelector').val(currentYear);
    $('#monthSelector').val(currentMonth);

    // 生成当前月份的日历
    generateCalendar(currentYear, currentMonth - 1);
    // 绑定选择事件
    
    $('#calendar-body').on('click', selectDate);
});
// 選擇年月份的事件
 $('#yearSelector ,#monthSelector').change(function(){
    var year = $('#yearSelector').val();
    var month = $('#monthSelector').val()-1;
    generateCalendar(year,month) ;
    // displayUafavDate(year,month);
  });

// 生成月曆
function generateCalendar(year, month) {
    // 清除所有 td 元素的 class
    const allCells = document.querySelectorAll('#calendar-body td');
    allCells.forEach(cell => cell.className = '');

    const firstDay = new Date(year, month, 1);// 取得月曆的第一天
    const daysInMonth = new Date(year, month + 1, 0).getDate();// 取得當月的天數
    const firstDayOfWeek = firstDay.getDay();// 取得第一天是星期幾
    const calendarBody = document.getElementById('calendar-body');// 找到日曆的容器
    calendarBody.innerHTML = ''; // 清空日曆的容器
    let date = 1;// 生成月曆的日期
    const cell = document.createElement('td');// 在生成每個單元格時為其添加唯一的 ID
    const numRows = Math.ceil((daysInMonth + firstDayOfWeek) / 7);// 計算所需的行數
    for (let i = 0; i < numRows; i++) {
        // 創建一行
        const row = document.createElement('tr');
        let rowHasContent = false; 

        for (let j = 0; j < 7; j++) {
            // 創建一個單元格
            const cell = document.createElement('td');
            cell.id = `day-${date}`;
            // const dutyClass = getDutyClass(DoctorNames[date - 1]);多這一行會讓日曆沒辦法跑！
            if (i === 0 && j < firstDayOfWeek) {
                // 填充空白的單元格
                // cell.textContent = '';
            } else {
                // 填充日期
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
                    // cell.textContent = '';
                }
            }
            // 將單元格添加到行中
            row.appendChild(cell);
        }
        // 將行添加到日曆的容器
        calendarBody.appendChild(row);
    }
    displayUafavDate(year,month);
    // 更新當前月份顯示
    // document.getElementById('currentMonthText').textContent = `${year} 年 ${month + 1} 月`;   
}
function displayUafavDate(year,month){
    $.ajax({
        url: '/Doctor/GetUnfavDate',
        type: 'POST',
        data:{year:year,month:month},
        dataType: 'json',
        success: function(response) {
            var unfavDates = response;
            // 遍歷 unfavDates 並處理每個日期
            unfavDates.forEach(function(dateString) {
                var unfavDate = new Date(dateString);
                // 確認年份和月份匹配
                // if (unfavDate.getFullYear() === year && unfavDate.getMonth() === month) {
                    var day = unfavDate.getDate();
                    var cell = document.getElementById(`day-${day}`);
                    if (cell) {
                        cell.classList.add('selected');
                    }
                // }
            });
            // console.log(unfavDates);
        },
        error: function(xhr, status, error) {
            console.error("AJAX request failed:", status, error);
        }
    });
    
}

// 選擇日期&儲存
var DoctorSelectDate = [];
// function selectDate(event) {
//     const clickedCell = event.target;
//     var year = $('#yearSelector').val();
//     var month = $('#monthSelector').val()-1;
//     var day = parseInt(clickedCell.textContent); // 從格子中獲取日期的值（將文本內容轉換為數字）
//     var selectedDate = new Date(year, month, day,12,0,0);
    
//     if (clickedCell.classList.contains('selected')) {
//       clickedCell.classList.remove('selected');
//       DoctorSelectDate.splice(DoctorSelectDate.indexOf(selectedDate), 1); // 從陣列中移除選擇的日期
//     } else {
//         if (DoctorSelectDate.length >= 5) {
//             alert('只能選擇 5 個日期！');
//             return; // 如果已經選擇了 5 個日期，則停止添加新日期
//         }
//         clickedCell.classList.add('selected');
//         DoctorSelectDate.push(selectedDate); // 將選擇的日期加入陣列
        
//         //   console.log(DoctorSelectDate);
//         console.log(clickedCell.textContent);
//     }
// }
function selectDate(event) {
    const clickedCell = event.target;
    var year = $('#yearSelector').val();
    var month = $('#monthSelector').val() - 1;
    var day = parseInt(clickedCell.textContent); // 從格子中獲取日期的值（將文本內容轉換為數字）
    var selectedDate = new Date(year, month, day, 12, 0, 0);

    // 檢查是否已選擇相同的日期
    var isSelected = DoctorSelectDate.some(date => 
        date.getFullYear() === selectedDate.getFullYear() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getDate() === selectedDate.getDate()
    );

    if (isSelected) {
        // 如果日期已選擇，則移除
        clickedCell.classList.remove('selected');
        DoctorSelectDate = DoctorSelectDate.filter(date => 
            !(date.getFullYear() === selectedDate.getFullYear() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getDate() === selectedDate.getDate())
        );
    } else {
        // 如果日期未選擇，則添加
        if (DoctorSelectDate.length >= 5) {
            alert('只能選擇 5 個日期！');
            return; // 如果已經選擇了 5 個日期，則停止添加新日期
        }
        clickedCell.classList.add('selected');
        DoctorSelectDate.push(selectedDate); // 將選擇的日期加入陣列
    }

    console.log(DoctorSelectDate);
}

// $('#calendar-body').on('click',selectDate);// 將點擊日期格子的事件綁定到日曆的容器

// 儲存班數按鈕事件
$('#SaveSchedule').click(function(){
    
    // DoctorSelectDate.forEach(function(cell) {
    //     console.log(cell); // 印出日期格子的內容
    // });
    // 將日期陣列轉換為 JSON 字符串
    var jsonData = JSON.stringify(DoctorSelectDate);
    $.ajax({
        url: '/Doctor/SaveDates',
        method: 'POST',
        contentType: 'application/json',
        data: jsonData,
        success: function(response) {
            // 請求成功後的處理邏輯
            // console.log(response);
            alert("儲存成功")
            DoctorSelectDate=[];
        },
        error: function(error) {
            // 請求失敗後的處理邏輯
            // console.log(error);
            alert("儲存失敗")
        }
    });
});

 