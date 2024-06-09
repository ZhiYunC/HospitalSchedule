$(document).ready(function() {
    var currentDate = new Date(); // 現在時間
    var twoMonthsLater = new Date(currentDate.setMonth(currentDate.getMonth() + 2)); // 兩個月後
    var year = twoMonthsLater.getFullYear(); // 兩個月後年
    var month = twoMonthsLater.getMonth() + 1; // 兩個月後月 (JavaScript 的月份是從 0 開始的，所以需要加 1)

    console.log("Year:", year); // 顯示年份
    console.log("Month:", month); // 顯示月份
});

// 全局变量来存储医生名单(編輯班表時使用到的)
let allDoctors = [];
// 未排班/已排班功能
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
    
    // 顯示排班提示信息
    // 獲取當前日期
    var today = new Date();
    // var currentYear = today.getFullYear();
    var currentMonth = today.getMonth() + 1; 
    var nextTwoMonth = currentMonth+2;
    var currentDate = today.getDate();
    if (currentDate>20 && currentDate<25){
        $('#noteText').text('醫生填寫'+nextTwoMonth+'月不想上班日期中。');
        $('.note').show();
    }else if (currentDate>25 && currentDate<28){
        $('#noteText').text('請前往"排班頁面"填寫'+nextTwoMonth+'月醫生需排班數！');
        $('.note').show();
    }else if (currentDate>27 && currentDate<31){
        // $('#noteText').text('請前往"排班頁面"填寫'+nextTwoMonth+'月醫生需排班數！');

        $('#noteText').text(nextTwoMonth+'月班表已產出，請盡快確認！');
        $('.note').show();
    }else{
        $('.note').hide();
    }
   
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

$('#closeNote').click(function(){
    $('.note').hide();
})
// $('#department').click(function(){
    
// })

// FUN：AJAX抓取班表顯示
$('#department,#sub-departments').click(function(){
    var year = 2024;
    var month =8;
    var subdepartment =$('.sub-department-buttons button.selected').text();
    // var subdepartment =$('#sub-department.selected').val();
    console.log(subdepartment);
    // 獲取當前日期
    var currentDate = new Date();
    // 獲取當前年份
    var currentYear = currentDate.getFullYear();
    // 獲取當前月份
    var currentMonth = currentDate.getMonth() + 1; // JavaScript 的月份從 0 開始，所以要加 1
    // 計算下兩個月的月份和年份
    var nextTwoMonth = currentMonth + 2;
    var nextTwoYear = currentYear;
    if (nextTwoMonth > 12) {
        nextTwoMonth -= 12;
        nextTwoYear++;
    }
    console.log('nextTwoYear'+nextTwoYear); // 輸出下兩個月的年份
    console.log('nextTwoMonth'+nextTwoMonth); // 輸出下兩個月的月份

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
            $('#currentMonthText').text(year+'年'+month+'月 暫定班表');
            generateCalendar(year, month,doctorList);
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
            displayShift(shiftList);
            allDoctors = dt.map(doctor => doctor.doctor_Name);
        },
        error: function(error) {
            console.error(error);
        }
    });
    //醫生不想上班日期
    // $.ajax({
    //     url: '../Manager/GetDoctorUnfavDate', // 替換成你的Controller名稱
    //     type: 'POST',
    //     data:{ subdepartment:subdepartment},
    //     dataType: 'json',
    //     success: function(restrictions) {
    //         var unfavDates = {};

    //         for (var doctorName in restrictions) {
    //             if (restrictions.hasOwnProperty(doctorName)) {
    //                 restrictions[doctorName].forEach(function(day) {
    //                     if (!unfavDates[day]) {
    //                         unfavDates[day] = [];
    //                     }
    //                     unfavDates[day].push(doctorName);
    //                 });
    //             }
    //         }
    //     },
    //     error: function(error) {
    //         console.error(error);
    //     }
    // });
})
//醫生不想上班日期
function fetchAndDisplayUnfavDates(subdepartment) {
    $.ajax({
        url: '../Manager/GetDoctorUnfavDate',
        type: 'POST',
        data: { subdepartment: subdepartment },
        dataType: 'json',
        success: function(data) {
            const unfavDates = {};

            for (var doctorName in data) {
                if (data.hasOwnProperty(doctorName)) {
                    data[doctorName].forEach(function(day) {
                        if (!unfavDates[day]) {
                            unfavDates[day] = [];
                        }
                        unfavDates[day].push(doctorName);
                    });
                }
            }

            // // 在月历中显示不想排班的医生名字
            // for (var day in unfavDates) {
            //     if (unfavDates.hasOwnProperty(day)) {
            //         var cell = document.getElementById(`day-${day}`);
            //         if (cell) {
            //             var unfavDoctorsStr = unfavDates[day].join(', ');
            //             var unfavDiv = document.createElement('div');
            //             unfavDiv.className = 'unfav-doctors';
            //             unfavDiv.style.color = 'red';
            //             unfavDiv.textContent = unfavDoctorsStr;
            //             cell.appendChild(unfavDiv);
            //         }
            //     }
            // }
            // 在月历中显示不想排班的医生名字
            for (var day in unfavDates) {
                if (unfavDates.hasOwnProperty(day)) {
                    var cell = document.getElementById(`unfavdate-${day}`);
                    if (cell) {
                        var unfavDoctorsStr = 'X: ' + unfavDates[day].join(', ');
                        // var unfavDoctorsStr = unfavDates[day].map(name => `X: ${name}`).join(', ');
                        var unfavDiv = document.createElement('div');
                        unfavDiv.className = 'unfav-doctors';
                        unfavDiv.textContent = unfavDoctorsStr;
                        // 将 unfavDiv 添加到原有内容的下面
                        cell.appendChild(unfavDiv);
                    }
                }
            }
        },
        error: function(error) {
            console.error('Failed to fetch unfav dates from the server.');
        }
    });
}

// 編輯按鈕的點擊事件
$('#EditSchedule').click(function() {
    var subdepartment =$('.sub-department-buttons button.selected').text();
    // 檢查按鈕的文本內容來確定當前模式
    if ($(this).text() === "編輯班表") {
        // 切換到編輯模式
        $('#calendarrejust td').css('height', '130px'); 
        $(this).removeClass('edit-schedule').addClass('save-schedule');
        fetchAndDisplayUnfavDates(subdepartment);
        enterEditMode();
    } else {
        // 切換回正常模式
        $(this).removeClass('save-schedule').addClass('edit-schedule');
        exitEditMode();
    }
});

// 進入編輯模式的函數
function enterEditMode() {
    // 將按鈕的文本修改為“儲存班表”
    $('#EditSchedule').text("儲存班表");
    // var selectedDoctor = selectElement.text(); // 獲取doctorname
    document.querySelectorAll('.draggable').forEach(element => {
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);
        element.addEventListener('dblclick', handleDoubleClick);
    });
    document.querySelectorAll('td').forEach(cell => {
        cell.addEventListener('dragover', handleDragOver);
        cell.addEventListener('drop', handleDrop);
    });
    // 动态更新班数
    updateDoctorShiftCounts();
}
// 離開編輯、更新班表的函數
function exitEditMode() {
    $('#EditSchedule').text("編輯班表");
    var department = $('#sub-departments .selected').text();
    var updatedScheduleData = [];
    $('.calendar-day').each(function() {
        // var selectElement = $(this).find('.doctor-select');
        var selectElement = $(this).find('.draggable');

        if (selectElement.length > 0) {
            // var selectedDoctor = selectElement.val(); // 獲取doctorname
            // if (selectElement.hasClass('selected')) {                
            //     var day = $(this).data('date'); // 使用 data-date 屬性獲取日期
            //     updatedScheduleData.push({ Schedule_day: day, Schedule_doctor_name: selectedDoctor, Schedule_department_name: department }); //存到updatedScheduleData
            // }
            // $(this).empty();
            var selectedDoctor = selectElement.text(); // 獲取doctorname
            var day = $(this).data('date'); // 使用 data-date 屬性獲取日期
            updatedScheduleData.push({ Schedule_day: day, Schedule_doctor_name: selectedDoctor, Schedule_department_name: department }); //存到updatedScheduleData
            $(this).empty();
            
        }
    });
    console.log("updatedScheduleData");
    console.log(updatedScheduleData);
    $('#shift-counts').empty();
    $('#shift-counts').removeClass;
    showAlert(updatedScheduleData);
}

const checkConsecutiveDoctors = (scheduleData) => {
    for (let i = 1; i < scheduleData.length; i++) {
        if (scheduleData[i].Schedule_doctor_name === scheduleData[i - 1].Schedule_doctor_name) {
            return true;
        }
    }
    return false;
};
// 儲存班表alert
const showAlert = (updatedScheduleData) => {
    Swal.fire({
        icon: 'question',
        title: '編輯暫定班表',
        text: '確定要儲存嗎?',
        showCancelButton: true,
        confirmButtonText: "確認",
        cancelButtonText: "取消"
    }).then((result) => {
        if (result.isConfirmed) {
            if (checkConsecutiveDoctors(updatedScheduleData)) {
                Swal.fire({
                    icon: 'warning',
                    title: '醫生連續出現',
                    text: '有醫生連續出現在班表中，是否要儲存?',
                    showCancelButton: true,
                    confirmButtonText: "確認",
                    cancelButtonText: "取消"
                }).then((result) => {
                if (result.isConfirmed) {
                    var jsonData = JSON.stringify(updatedScheduleData);
                    // console.log(jsonData);
                    $.ajax({
                        url: '/Manager/UpdateSchedule',
                        method: 'POST',
                        contentType: 'application/json',
                        data: jsonData,
                        success: function(response) {
                            Swal.fire({
                                icon: 'success',
                                title: '儲存成功',
                                text: '暫定班表已更新',
                            });

                            // console.log("班表更新成功");
                            var year = 2024;
                            var month = 8;
                            var subdepartment = $('.sub-department-buttons button.selected').text();

                            //月曆表格 
                            $.ajax({
                                url: '../Manager/GetScheduleData', // 替換成你的Controller名稱
                                type: 'GET',
                                data: { year: year, month: month, subdepartment: subdepartment },
                                dataType: 'json',
                                success: function(data) {
                                    var doctorList = data;
                                    var DoctorNames = [];
                                    for (var i = 0; i < doctorList.length; i++) {
                                        DoctorNames.push(doctorList[i]);
                                    }
                                    generateCalendar(year, month, doctorList);
                                },
                                error: function(error) {
                                    console.error('Failed to fetch schedule data from the server.');
                                }
                            });
                        },
                        error: function(xhr, status, error) {
                            Swal.fire({
                                icon: 'error',
                                title: '儲存失敗',
                                text: '班表更新失敗',
                            });
                            // console.log("班表更新失敗");
                            console.error('Error:', error);
                        }
                    });
                } else {
                    var year = 2024;
                    var month = 8;
                    var subdepartment = $('.sub-department-buttons button.selected').text();
                    //月曆表格 
                    $.ajax({
                        url: '../Manager/GetScheduleData', // 替換成你的Controller名稱
                        type: 'GET',
                        data: { year: year, month: month, subdepartment: subdepartment },
                        dataType: 'json',
                        success: function(data) {
                            var doctorList = data;
                            var DoctorNames = [];
                            for (var i = 0; i < doctorList.length; i++) {
                                DoctorNames.push(doctorList[i]);
                            }
                            generateCalendar(year, month, doctorList);
                        },
                        error: function(error) {
                            console.error('Failed to fetch schedule data from the server.');
                        }
                    });
                }
                });
            }else{
                var jsonData = JSON.stringify(updatedScheduleData);
                // console.log(jsonData);
                $.ajax({
                    url: '/Manager/UpdateSchedule',
                    method: 'POST',
                    contentType: 'application/json',
                    data: jsonData,
                    success: function(response) {
                        Swal.fire({
                            icon: 'success',
                            title: '儲存成功',
                            text: '暫定班表已更新',
                        });

                        // console.log("班表更新成功");
                        var year = 2024;
                        var month = 8;
                        var subdepartment = $('.sub-department-buttons button.selected').text();

                        //月曆表格 
                        $.ajax({
                            url: '../Manager/GetScheduleData', // 替換成你的Controller名稱
                            type: 'GET',
                            data: { year: year, month: month, subdepartment: subdepartment },
                            dataType: 'json',
                            success: function(data) {
                                var doctorList = data;
                                var DoctorNames = [];
                                for (var i = 0; i < doctorList.length; i++) {
                                    DoctorNames.push(doctorList[i]);
                                }
                                generateCalendar(year, month, doctorList);
                            },
                            error: function(error) {
                                console.error('Failed to fetch schedule data from the server.');
                            }
                        });
                    },
                    error: function(xhr, status, error) {
                        Swal.fire({
                            icon: 'error',
                            title: '儲存失敗',
                            text: '班表更新失敗',
                        });
                        // console.log("班表更新失敗");
                        console.error('Error:', error);
                    }
                });
            }
        }else if (result.dismiss === Swal.DismissReason.cancel){
            var year = 2024;
            var month = 8;
            var subdepartment = $('.sub-department-buttons button.selected').text();
            //月曆表格 
            $.ajax({
                url: '../Manager/GetScheduleData', // 替換成你的Controller名稱
                type: 'GET',
                data: { year: year, month: month, subdepartment: subdepartment },
                dataType: 'json',
                success: function(data) {
                    var doctorList = data;
                    var DoctorNames = [];
                    for (var i = 0; i < doctorList.length; i++) {
                        DoctorNames.push(doctorList[i]);
                    }
                    generateCalendar(year, month, doctorList);
                },
                error: function(error) {
                    console.error('Failed to fetch schedule data from the server.');
                }
            });
        }
    });
};


// 托拽編輯功能
// 托拽編輯功能：Function to handle drag start
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.style.opacity = '0.4';
}

// 托拽編輯功能：Function to handle drag end
function handleDragEnd(e) {
    e.target.style.opacity = '1';
}

// 托拽編輯功能：Function to handle drag over
function handleDragOver(e) {
    e.preventDefault();
}

// 托拽編輯功能：Function to handle drop
function handleDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(data);
    const dropzone = e.target.closest('td').querySelector('.draggable');

    if (dropzone && dropzone !== draggedElement) {
        const tempText = dropzone.textContent;
        dropzone.textContent = draggedElement.textContent;
        draggedElement.textContent = tempText;

        // 添加编辑过的痕迹
        dropzone.classList.add('edited');
        draggedElement.classList.add('edited');
        // 更新医生班数
        updateDoctorShiftCounts();
    }
}

// 托拽編輯功能：Add event listeners to the draggable elements
document.querySelectorAll('.draggable').forEach(element => {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
});

// 托拽編輯功能：Add event listeners to the table cells
document.querySelectorAll('td').forEach(cell => {
    cell.addEventListener('dragover', handleDragOver);
    cell.addEventListener('drop', handleDrop);
});

// 雙擊編輯醫生班表：建立下拉選單
function createDoctorSelect() {
    const selectElement = document.createElement('select');
    selectElement.classList.add('doctor-select');
    allDoctors.forEach(doctorName => {
        const option = document.createElement('option');
        option.value = doctorName;
        option.text = doctorName;
        selectElement.appendChild(option);
    });
    return selectElement;
}

// 雙擊編輯醫生班表：雙擊點擊事件
function handleDoubleClick(e) {
    const targetElement = e.target;
    const selectElement = createDoctorSelect();
    selectElement.value = targetElement.textContent;
    targetElement.parentNode.replaceChild(selectElement, targetElement);
    selectElement.addEventListener('change', () => {
        const newDoctorName = selectElement.value;
        const newDoctorElement = document.createElement('div');
        newDoctorElement.classList.add('draggable', 'edited');
        newDoctorElement.draggable = true;
        newDoctorElement.textContent = newDoctorName;
        newDoctorElement.addEventListener('dragstart', handleDragStart);
        newDoctorElement.addEventListener('dragend', handleDragEnd);
        newDoctorElement.addEventListener('dblclick', handleDoubleClick);
        selectElement.parentNode.replaceChild(newDoctorElement, selectElement);
      
        updateDoctorShiftCounts()
    });
    
}

// 更新医生班数的函数
function updateDoctorShiftCounts() {
    const doctorShiftCounts = {};

    document.querySelectorAll('.draggable').forEach(element => {
        const doctorName = element.textContent.trim();
        if (doctorName) {
            if (doctorShiftCounts[doctorName]) {
                doctorShiftCounts[doctorName]++;
            } else {
                doctorShiftCounts[doctorName] = 1;
            }
        }
    });

    displayDoctorShiftCounts(doctorShiftCounts);
}
// Function to display the doctor shift counts
function displayDoctorShiftCounts(doctorShiftCounts) {
    const shiftCountsContainer = document.getElementById('shift-counts');
    shiftCountsContainer.innerHTML = '';
    const title = document.createElement('p');
    title.textContent = `目前班表班數統計`;
    shiftCountsContainer.appendChild(title);

    for (const [doctorName, count] of Object.entries(doctorShiftCounts)) {
        const p = document.createElement('p');
        p.textContent = `${doctorName}: ${count} 班`;
        shiftCountsContainer.appendChild(p);
    }
}
