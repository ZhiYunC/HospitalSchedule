
// 讀取班表
$('#yearSelector,#monthSelector,#sub-departments,.left-nav').click(function(){
    var year = $('#yearSelector').val();
    var month = $('#monthSelector').val();
    var subdepartment =$('.sub-department-buttons button.selected').text();
    //月曆表格 
    $.ajax({
        url: '../Manager/GetScheduleData', 
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
            // $('#currentMonthText').text(year+'年'+month+'月 歷史班表');

            generateCalendar(year, month,doctorList);
        },
        error: function(error) {
            console.error('Failed to fetch schedule data from the server.');
        }
    });
    //醫生班數表格
    $.ajax({
        url: '../Manager/GetShiftData', 
        type: 'GET',
        data:{ year : year ,month :month ,subdepartment:subdepartment},
        dataType: 'json',
        success: function(dt) {
            var shiftList = dt;
            historyDisplayShift(shiftList);
        },
        error: function(error) {
            console.error(error);
        }
    });
})

// FUN：建立醫生班數表格
function historyDisplayShift(shift) {
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
            row.append('<td style="width: 15vh !important;font-size:16px;"><div class="doctor-style" style="'+color+';width: 10vh !important;">' + shift[i-1].doctor_Name + '</div></td>');
            row.append('<td style="width: 10vh !important;">' + shift[i-1].shift + '</td>');
            // row.append('<td>' + state + '</td>');
            // row.append('<td style="width: 10vh !important;"><img src="' + state +'" height="20" alt="wh"></img></td>');
            // row.append('<td id="State" style="width: 10vh !important;">' + state +'</td>');
            
            // 如果有其他欄位，可以在此添加
            tableBody.append(row);
            // <img src="~/image/logo.png" height="10" ></img>
        }
    // }); 
}