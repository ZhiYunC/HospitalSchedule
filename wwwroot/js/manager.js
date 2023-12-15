// 初始載入頁面時生成當月月曆
const currentDate = new Date();
var currentYear = currentDate.getFullYear();
var currentMonth =currentDate.getMonth();
if(currentMonth=12){
    currentYear =currentYear + 1;
    currentMonth=0;
}else{
    currentMonth=currentMonth;
}
// let currentMonth = currentDate.getMonth();
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
    var DoctorNames = ["陳芷芸","林書榆","萬家妤",
    "陳芷芸","林書榆","萬家妤","陳芷芸","林書榆","萬家妤","陳芷芸","林書榆","萬家妤",
    "陳芷芸","林書榆","萬家妤","陳芷芸","林書榆","萬家妤","陳芷芸","林書榆","萬家妤",
    "陳芷芸","林書榆","萬家妤","陳芷芸","林書榆","萬家妤","陳芷芸","林書榆","萬家妤","陳芷芸","林書榆"];
    
    // 計算所需的行數
    const numRows = Math.ceil((daysInMonth + firstDayOfWeek) / 7);
    
    for (let i = 0; i < numRows; i++) {
        // 創建一行
        const row = document.createElement('tr');
        let rowHasContent = false; 
        
        for (let j = 0; j < 7; j++) {
            // 創建一個單元格
            const cell = document.createElement('td');
            const dutyClass = getDutyClass(DoctorNames[date - 1]);
            if (i === 0 && j < firstDayOfWeek) {
                // 填充空白的單元格
                cell.textContent = '';
            } else {
                // 填充日期
                if (date <= daysInMonth) {
                    const existingContent = cell.innerHTML;
                    cell.innerHTML = existingContent + `<td><span id="day-${date}" class="calendar-day }">${date}<br><div class="${dutyClass}">${DoctorNames[date-1]}</span></td>`;
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
function getDutyClass(dutyNames) {
    const colorMap = {
        '陳芷芸': 'green-background',
        '林書榆': 'blue-background',
        '萬家妤': 'purple-background'
    };
    return dutyNames.split('、').map(name => colorMap[name] || 'default-background').join(' ');
}