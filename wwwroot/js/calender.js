// 生成月份和年份選項
const monthYearDropdown = document.getElementById('monthYearDropdown');
const currentMonthText = document.getElementById('currentMonthText');
const nowdate=new Date(); //
let nowyear = nowdate.getFullYear();
for (let year = (nowyear-1); year <= nowyear; year++) {
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('div');
        option.classList.add('month-year-option');
        option.textContent = `${year} 年 ${month} 月`;
        option.addEventListener('click', function () {
            selectMonthYear(year, month);
        });
        monthYearDropdown.appendChild(option);
    }
}

// 選擇月份/年份的按鈕點擊事件
currentMonthText.addEventListener('click', function () {
    monthYearDropdown.style.display = monthYearDropdown.style.display === 'block' ? 'none' : 'block';
});

// 當點擊月份/年份選項時更新當前月份和年份並隱藏下拉選單
function selectMonthYear(year, month) {
    currentYear = year;
    currentMonth = month - 1; // 月份是從 0 開始的，所以減 1
    generateCalendar(currentYear, currentMonth);
    monthYearDropdown.style.display = 'none';
}   

// 初始載入頁面時生成當月月曆
const currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
generateCalendar(currentYear, currentMonth);
// 使用 JavaScript 來動態生成月曆的日期
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
    cell.id = `day-${date}`;

    for (let i = 0; i < 6; i++) {
        // 創建一行
        const row = document.createElement('tr');
        let rowHasContent = false; 

        for (let j = 0; j < 7; j++) {
            // 創建一個單元格
            const cell = document.createElement('td');

            if (i === 0 && j < firstDayOfWeek) {
                // 填充空白的單元格
                cell.textContent = '';
            } else {
                // 填充日期
                if (date <= daysInMonth) {
                    const existingContent = cell.innerHTML;
                    cell.innerHTML = existingContent + `<span id="day-${date}" class="calendar-day">${date}</span>`;
                    date++;
                    rowHasContent = true;
                } else {
                    // 超過當月的天數，填充空白的單元格
                    cell.textContent = '';
                }
            }
            // 將單元格添加到行中
            row.appendChild(cell);
        }
        // 將行添加到日曆的容器
        calendarBody.appendChild(row);
    }

    // 更新當前月份顯示
    document.getElementById('currentMonthText').textContent = `${year} 年 ${month + 1} 月`;

    
}