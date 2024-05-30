$(document).ready(function() {
    const departmentNote = {
        '內科部': ['1', '9'],
        '外科部': ['10', '19'],
        '心臟血管醫學部': ['20', '20'],
        '兒童醫學部': ['21', '21'],
        '婦產部': ['22', '22'],
        '其他專科': ['23', '40'],
        '特色中心': ['41', '45'],
        '新冠肺炎專區': ['46', '47'],
    };
    
    // Iterate through each department and check scheduling status
    for (const [department, range] of Object.entries(departmentNote)) {
        $.ajax({
            url: '/Manager/CheckSchedulingCompleted',
            type: 'GET',
            data: { start: range[0], end: range[1] },
            dataType: 'json',
            success: function(response) {
                // console.log(response);
                const departmentElement = $(`button[value="${department}"] .finished, button[value="${department}"] .unfinished`);
                if (response.success) {
                    departmentElement.text("已排班");
                    departmentElement.removeClass().addClass('finished');
                } else {
                    departmentElement.text("未排班");
                    departmentElement.removeClass().addClass('unfinished');
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed:", status, error);
            }
        });
    }
    
});
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