let currentDate = new Date(); // 現在時間
let twoMonthsLater = new Date(currentDate.setMonth(currentDate.getMonth() + 2)); // 兩個月後
let year = twoMonthsLater.getFullYear(); // 兩個月後年
let month = twoMonthsLater.getMonth() + 1; // 兩個月後月 (JavaScript 的月份是從 0 開始的，所以需要加 1)

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
// 原本使用從上一頁傳送使用者選的部門到此頁顯示系科別
// document.addEventListener('DOMContentLoaded', function() {
//     var urlParams = new URLSearchParams(window.location.search);
//     var selecteddepartment = urlParams.get('department');
//     var selectedward = urlParams.get('ward');
//     // 這裡顯示這些選項
//     document.getElementById('selectedDepartment').textContent = selecteddepartment;
//     document.getElementById('selectedWard').textContent = selectedward;
//     showSubDepartments(selecteddepartment);
//     $('#sub-departments').click(function(){
//         var selectedsubdepartment = document.querySelector('.sub-department-buttons button.selected')?.textContent || '未選擇';
//         console.log(selectedsubdepartment);
//         // 
//         $.ajax({
//             url: '../Manager/GetDoctors', // 替換成你的Controller名稱
//             type: 'GET',
//             data:{ selectedsubdepartment: selectedsubdepartment},
//             dataType: 'json',
//             success: function(doctors) {
//                 // data 包含從控制器返回的 List<Doctor>
//                 doctors.forEach(function(doctor){
//                     console.log(doctor);
//                 })
//                 displayDoctors(doctors);
//             },
//             error: function(error) {
//                 console.error('Failed to fetch schedule data from the server.');
//             }
//         });
//     })
// });

function showSubDepartments(department) {
    // 獲取細分部門數據
    var subDepartments = subDepartmentsData[department] || [];
    // 建立細分部門按鈕的 HTML
    var subDepartmentsHtml = subDepartments.map(function(sub) {
        return `<button type="button">${sub}</button>`;
    }).join('');
    // 插入細分部門按鈕到頁面中
    var subDepartmentsContainer = document.getElementById('sub-departments');
    subDepartmentsContainer.innerHTML = subDepartmentsHtml;
    //設定標題內的科別文字
    var departments = document.querySelectorAll('#selectedDepartment');
    departments.forEach(function(element) {
        element.textContent = department;
    });
    // 為細分部門按鈕添加事件監聽器
    subDepartmentsContainer.querySelectorAll('.sub-department-buttons button').forEach(function(btn) {
        btn.addEventListener('click', function() {
            // 移除其他按鈕的 .btn-selected 類別
            subDepartmentsContainer.querySelectorAll('.sub-department-buttons button').forEach(function(b) {
                b.classList.remove('selected');
            });
            // 為點擊的按鈕添加 .btn-selected 類別
            btn.classList.add('selected');      
        });
        
    });
}

function displayDoctors(doctors) {
    // 在表格中顯示醫生列表
    var tableBody = $('#doctorList tbody');
    tableBody.empty(); // 清空表格內容

    // 將每位醫生添加到表格中
    doctors.forEach(function(doctor) {
        var row = $('<tr>');
        row.append('<td id="doctorName">' + doctor.doctor_Name + '</td>');
        // row.append('<td><input type="hidden" name="doctorId" value="' + doctor.shift + '" readonly><input type="number" name="shift" min="1" value="' + doctor.Shift + '"></td>');
        row.append('<td><input id="doctorShift" type="number" name="shift" min="1" value="' + doctor.shift + '"></td>');
        // 如果有其他欄位，可以在此添加

        tableBody.append(row);
    });
}
// FUN 儲存班數按鈕事件
// $('#SaveSchedule').click(function() {
//     // 假設這是儲存操作成功的標誌，你可以根據實際情況修改
//     var saveSuccess = true;

//     if (saveSuccess) {
//         // 顯示儲存成功的通知
//         alert("儲存成功");
//     } else {
//         // 如果儲存操作失敗，可以顯示相應的錯誤通知
//         alert("儲存失敗");
//     }
// });

// $('#SaveSchedule').click(function() {
//     var selectedsubdepartment = $('.sub-department-buttons button.selected').text();

//     // 构建要发送到后端的数据结构
//     var doctorsList =[];

//     // 遍历每个医生的行
//     $('#doctorList tbody tr').each(function() {
//         var doctorName = $(this).find('#doctorName').text();
//         var doctorShift = $(this).find('#doctorShift').val();

//         doctorsList.push({ Doctor_Name: doctorName, Shift: doctorShift,Doctor_Department:selectedsubdepartment }); //存到updatedScheduleData
 
//     });
//     // console.log('doctorsList'+doctorsList[0]);
    
    
//     // 将数组转换为 JSON 格式
//     var jsonData = JSON.stringify(doctorsList);

//     if(doctorsList!=null){
//         // 发送 AJAX 请求
//         $.ajax({
//             url: '../Manager/NewShift',
//             type: 'POST',
//             contentType: 'application/json',
//             data: jsonData,
//             dataType: 'json',
//             success: function(response) {
//                 // 处理成功响应
//                 console.log('Data saved successfully:', response);
//                 alert("儲存成功");
//                 // 可以在这里显示成功通知或者执行其他操作
//             },
//             error: function(xhr, status, error) {
//                 // 处理错误响应
//                 console.error("AJAX request failed:", status, error);
//                 alert("儲存失敗");
//                 // 可以在这里显示错误通知或者执行其他操作
//             }
//         });
//     }
// });
$('#SaveSchedule').click(function(e) {
    e.preventDefault(); // 阻止默認表單提交行為

    var selectedsubdepartment = $('.sub-department-buttons button.selected').text();

    // 構建要發送到後端的數據結構
    var doctorsList = [];

    // 遍歷每個醫生的行
    $('#doctorList tbody tr').each(function() {
        var doctorName = $(this).find('#doctorName').text();
        var doctorShift = $(this).find('#doctorShift').val();

        doctorsList.push({ Doctor_Name: doctorName, Shift: doctorShift, Doctor_Department: selectedsubdepartment });
    });

    console.log('doctorsList' + JSON.stringify(doctorsList));

    // 如果 doctorsList 為空，給出提示並返回
    if (doctorsList.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: '沒有班表數據',
            text: '請先添加醫生的班表信息。',
        });
        return;
    }
    // var currentDate = new Date();
    // var year = currentDate.getFullYear();
    // var month = currentDate.getMonth() + 1;
    var daysInMonth = new Date(year, month, 0).getDate();
    var totalShifts = doctorsList.reduce(function(sum, doctor) {
        var shiftInt = parseInt(doctor.Shift, 10);
        if (!isNaN(shiftInt)) {
            return sum + shiftInt;
        } else {
            return sum;
        }
    }, 0);
    if (totalShifts !== daysInMonth) {
        console.log(totalShifts);
        Swal.fire({
            icon: 'warning',
            title: '班數總和錯誤',
            text: '醫生的班次總和必須等於當月的天數 (' + daysInMonth + ' 天)。',
            
        });
        totalShifts=[];
        return;
    }
        
    // 使用 Swal.fire 顯示確認框
    Swal.fire({
        icon: 'question',
        title: '儲存班數',
        text: '確定要儲存嗎?',
        showCancelButton: true,
        confirmButtonText: "確認",
        cancelButtonText: "取消"
    }).then((result) => {
        if (result.isConfirmed) {
            // 將數組轉換為 JSON 格式
            var jsonData = JSON.stringify(doctorsList);

            // 發送 AJAX 請求
            $.ajax({
                url: '../Manager/NewShift',
                type: 'POST',
                contentType: 'application/json',
                data: jsonData,
                dataType: 'json',
                success: function(response) {
                    // 處理成功響應
                    console.log('Data saved successfully:', response);
                    Swal.fire({
                        icon: 'success',
                        title: '儲存成功',
                        text: '暫定班表已更新',
                    });
                },
                error: function(xhr, status, error) {
                    // 處理錯誤響應
                    console.error("AJAX request failed:", status, error);
                    Swal.fire({
                        icon: 'error',
                        title: '儲存失敗',
                        text: '班表更新失敗',
                    });
                }
            });
        }
    });
});


// $('#StartSchedule').click(function(){
//     var selectedsubdepartment = $('.sub-department-buttons button.selected').text();
//     $.ajax({
//         url: '../Manager/GetShiftData', // 替換成你的Controller名稱
//         type: 'GET',
//         data:{ year:2024,month:7,subdepartment: selectedsubdepartment},
//         dataType: 'json',
//         success: function(doctors) {
//             // data 包含從控制器返回的 List<Doctor>
//             doctors.forEach(function(doctor){
//                 console.log(doctor);
//             }) 
//             if(doctors.length>0){
//                 $.ajax({
//                     url: '../Scheduling/StartSchedule',
//                     type: 'POST',
//                     data: { subdepartment: selectedsubdepartment },
//                     dataType: 'json',
//                     success: function(response) {
//                         // 處理返回的排班結果
//                         let resultDiv = $('#scheduleResult');
//                         resultDiv.empty(); // 清空之前的結果
            
//                         response.forEach(function(item) {
//                             resultDiv.append('<p>' + item + '</p>');
//                         });
//                     },
//                     error: function(xhr, status, error) {
//                         console.error("AJAX request failed:", status, error);
//                     }
//                 });
//             }else{
//                 alert("尚未設定班數");
//             }
            
//         },
//         error: function(error) {
//             console.error('Failed to fetch schedule data from the server.');
//         }
//     });
    
// })
$('#StartSchedule').click(function(e) {
    var selectedsubdepartment = $('.sub-department-buttons button.selected').text();
    e.preventDefault(); // 阻止默認表單提交行為

    $.ajax({
        url: '../Manager/GetShiftData', // 替換成你的Controller名稱
        type: 'GET',
        data: { year: year, month: month, subdepartment: selectedsubdepartment },
        dataType: 'json',
        success: function(doctors) {
            // data 包含從控制器返回的 List<Doctor>
            doctors.forEach(function(doctor) {
                console.log(doctor);
            });
            if (doctors.length > 0) {
                $.ajax({
                    url: '../Scheduling/StartSchedule',
                    type: 'POST',
                    data: { subdepartment: selectedsubdepartment },
                    dataType: 'json',
                    success: function(response) {
                        // 處理返回的排班結果
                        let resultDiv = $('#scheduleResult');
                        resultDiv.empty(); // 清空之前的結果

                        response.forEach(function(item) {
                            resultDiv.append('<p>' + item + '</p>');
                        });

                        Swal.fire({
                            icon: 'success',
                            title: '排班完成',
                            text: '排班結果已成功生成。',
                        });
                    },
                    error: function(xhr, status, error) {
                        console.error("AJAX request failed:", status, error);
                        Swal.fire({
                            icon: 'error',
                            title: '排班失敗',
                            text: '排班過程中出現錯誤，請稍後再試。',
                        });
                    }
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: '尚未設定班數',
                    text: '請先設定班數再進行排班。',
                });
            }
        },
        error: function(xhr, status, error) {
            console.error('Failed to fetch schedule data from the server.');
            Swal.fire({
                icon: 'error',
                title: '數據獲取失敗',
                text: '無法從服務器獲取班數數據，請稍後再試。',
            });
        }
    });
});

// FUN：點選科別的動畫、將科別傳入showSubDepartments()建立細科別
$('.left-nav button').click(function() {
    // 移除同一按鈕組中其他按鈕的類別
    $('.left-nav button').removeClass('selected');
    // 取得部門名字
    var departmentText =$(this).val();
    $(this).addClass('selected');
    // 找到目標元素，然後獲取其值
    showSubDepartments(departmentText)
   
})
// FUN：讀取細科別抓取班表
// $('#department').click(function(){
//     $('.sub-department-buttons button').removeClass('selected');
// })

$('#department,#sub-departments').click(function(){
    var selectedsubdepartment = $('.sub-department-buttons button.selected').text();
    $.ajax({
        url: '../Manager/GetShiftData', // 替換成你的Controller名稱
        type: 'GET',
        data:{ year:year,month:month,subdepartment: selectedsubdepartment},
        dataType: 'json',
        success: function(doctors) {
            // data 包含從控制器返回的 List<Doctor>
            doctors.forEach(function(doctor){
                console.log(doctor);
            }) 
            if(doctors.length>0){
                displayDoctors(doctors);
            }else{
                $.ajax({
                    url: '../Manager/GetDoctors', // 替換成你的Controller名稱
                    type: 'GET',
                    data:{ selectedsubdepartment: selectedsubdepartment},
                    dataType: 'json',
                    success: function(doctors) {
                        // data 包含從控制器返回的 List<Doctor>
                        doctors.forEach(function(doctor){
                            console.log(doctor);
                        }) 
                        displayDoctors(doctors);
                    },
                    error: function(error) {
                        console.error('Failed to fetch schedule data from the server.');
                    }
                });
                displayDoctors(doctors);
            }
            
        },
        error: function(error) {
            console.error('Failed to fetch schedule data from the server.');
        }
    });
});

// document.addEventListener('DOMContentLoaded', function() {
//     var form = document.getElementById('scheduleForm');

//     form.addEventListener('submit', function() {
//         // 在這裡添加任何您需要的額外處理，或者允許表單正常提交
//     });
// });