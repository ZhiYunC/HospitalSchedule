// 初始載入頁面時生成當月月曆
const currentDate = new Date();
var currentYear = currentDate.getFullYear();
var currentMonth =currentDate.getMonth();
generateCalendar(currentYear, currentMonth);

// 選擇年月份的事件
 $('#yearSelector ,#monthSelector').click(function(){
    var year = $('#yearSelector').val();
    var month = $('#monthSelector').val()-1;
    generateCalendar(year,month) ;
  });

// 生成月曆
function generateCalendar(year, month) {
    // 取得月曆的第一天
    const firstDay = new Date(year, month, 1);

    // 取得當月的天數
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 取得第一天是星期幾
    const firstDayOfWeek = firstDay.getDay();

    // 找到日曆的容器
    const calendarBody = document.getElementById('calendar-body');

    // 清空日曆的容器
    calendarBody.innerHTML = '';

    // 生成月曆的日期
    let date = 1;
    // 在生成每個單元格時為其添加唯一的 ID
    const cell = document.createElement('td');
 
    // var DoctorNames = ["陳芷芸","林書榆","萬家妤",
    // "陳芷芸","林書榆","萬家妤","陳芷芸","林書榆","萬家妤","陳芷芸","林書榆","萬家妤",
    // "陳芷芸","林書榆","萬家妤","陳芷芸","林書榆","萬家妤","陳芷芸","林書榆","萬家妤",
    // "陳芷芸","林書榆","萬家妤","陳芷芸","林書榆","萬家妤","陳芷芸","林書榆","萬家妤","陳芷芸"];

    // 計算所需的行數
    const numRows = Math.ceil((daysInMonth + firstDayOfWeek) / 7);
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

    // 更新當前月份顯示
    // document.getElementById('currentMonthText').textContent = `${year} 年 ${month + 1} 月`;   
}

// 選擇日期&儲存
var DoctorSelectDate = [];
function selectDate(event) {
    const clickedCell = event.target;
    var year = $('#yearSelector').val();
    var month = $('#monthSelector').val()-1;
    var day = parseInt(clickedCell.textContent); // 從格子中獲取日期的值（將文本內容轉換為數字）
    var selectedDate = new Date(year, month, day,12,0,0);
    
    if (clickedCell.classList.contains('selected')) {
      clickedCell.classList.remove('selected');
      DoctorSelectDate.splice(DoctorSelectDate.indexOf(selectedDate), 1); // 從陣列中移除選擇的日期
    } else {
      clickedCell.classList.add('selected');
      DoctorSelectDate.push(selectedDate); // 將選擇的日期加入陣列
    //   console.log(DoctorSelectDate);
      console.log(clickedCell.textContent);
    }
}
$('#calendar-body').on('click',selectDate);// 將點擊日期格子的事件綁定到日曆的容器

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
        },
        error: function(error) {
            // 請求失敗後的處理邏輯
            // console.log(error);
            alert("儲存失敗")
        }
    });
});

 