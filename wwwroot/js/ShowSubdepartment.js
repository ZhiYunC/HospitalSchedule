const subDepartmentsData = {
    // null:['請先選擇部門'],
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


// FUN：點選科別的動畫、將科別傳入showSubDepartments()建立細科別
$('.left-nav button').click(function() {
    // 移除同一按鈕組中其他按鈕的類別
    $('.left-nav button').removeClass('selected');
    $('.sub-department-buttons button.selected').removeClass('selected');
    // 取得部門名字
    var departmentText = $(this).val();
    $(this).addClass('selected');
    // 找到目標元素，然後獲取其值
    showSubDepartments(departmentText)
});


// FUN：建立細科別(新)
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

// FUN：建立細科別(新)
// function showSubDepartments(department) {
//     // 獲取細分部門數據
//     var subDepartments = subDepartmentsData[department] || [];
//     // 建立細分部門按鈕的 HTML
//     var subDepartmentsHtml = subDepartments.map(function(sub) {
//     return `<button id="sub-department" class="flex" value="${sub}" >${sub}<div style="margin-right: 5px;margin-left:auto"><img  src="/image/check.png" height="20" alt="wh"></div></button>`;
//     }).join('');
//     // 插入細分部門按鈕到頁面中
//     var subDepartmentsContainer = document.getElementById('sub-departments');
//     subDepartmentsContainer.innerHTML = subDepartmentsHtml;
//     //設定標題內的科別文字
//     var departments = document.querySelectorAll('#selectedDepartment');
//     departments.forEach(function(element) {
//         element.textContent = department;
//     });
//     // 為細分部門按鈕添加事件監聽器
//     subDepartmentsContainer.querySelectorAll('#sub-department').forEach(function(btn) {
//         btn.addEventListener('click', function() {
//             // 移除其他按鈕的 .btn-selected 類別
//             subDepartmentsContainer.querySelectorAll('#sub-department').forEach(function(b) {
//                 b.classList.remove('selected');
//             });
//             // 為點擊的按鈕添加 .btn-selected 類別
//             btn.classList.add('selected');      
//         });
        
//     });
// }