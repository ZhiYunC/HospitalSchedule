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
document.addEventListener('DOMContentLoaded', function() {
    var urlParams = new URLSearchParams(window.location.search);
    var selecteddepartment = urlParams.get('department');
    var selectedward = urlParams.get('ward');
    // 這裡顯示這些選項
    document.getElementById('selectedDepartment').textContent = selecteddepartment;
    document.getElementById('selectedWard').textContent = selectedward;
    showSubDepartments(selecteddepartment);

    $('#sub-departments').click(function(){
        var selectedsubdepartment = document.querySelector('.sub-department-buttons button.selected')?.textContent || '未選擇';
        console.log(selectedsubdepartment);
        // 
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
    })
});

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
        row.append('<td class="nowrap">' + doctor.doctor_Name + '</td>');
        row.append('<td><input type="hidden" name="doctorId" value="' + doctor.shift + '" readonly><input type="number" name="shift" min="1" value="' + doctor.Shift + '"></td>');
        row.append('<td><input type="number" name="shift" min="1" value="' + doctor.shift + '"></td>');
        // 如果有其他欄位，可以在此添加

        tableBody.append(row);
    });
}
document.getElementById('SaveSchedule').addEventListener('click', function () {
    // 假設這是儲存操作成功的標誌，你可以根據實際情況修改
    var saveSuccess = true;

    if (saveSuccess) {
        // 顯示儲存成功的通知
        alert("儲存成功");
        
    } else {
        // 如果儲存操作失敗，可以顯示相應的錯誤通知
        alert("儲存失敗");
    }
});

// document.addEventListener('DOMContentLoaded', function() {
//     var form = document.getElementById('scheduleForm');

//     form.addEventListener('submit', function() {
//         // 在這裡添加任何您需要的額外處理，或者允許表單正常提交
//     });
// });