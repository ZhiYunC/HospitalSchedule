// 定義一個對象來存儲每個科別的細分部門
const subDepartmentsData = {
    'internal': ['內科', '胃腸肝膽科', '新陳代謝科', '胸腔內科', '腎臟內科', '一般內科', '血液腫瘤科', '風濕免疫科', '感染科'],
    'surgery': ['外科', '神經外科', '大腸直腸外科', '乳房外科', '一般外科', '心臟血管外科', '整形外科', '胸腔外科', '小兒外科', '外傷科'],
    'cardiovascular': ['心臟內科'],
    'pediatrics': ['兒童醫學科'],
    'obstetrics': ['婦產科'],
    'specialties': ['骨科', '泌尿科', '眼科', '耳鼻喉科', '皮膚科', '精神科', '神經科', '復健科', '家庭醫學科', '流感疫苗-家醫', 
    '職業醫學科', '疼痛/麻醉科', '牙科', '口腔顎面科', '兒童牙科', '影像醫學科門診', '放射腫瘤科', '核子醫學科'],
    'feature': ['聖路加美容醫學', '腦血管介入治療', '運動醫學中心', '營養諮詢', '智慧科學體重管理中心'],
    'covid': ['新冠肺炎康復後整合門診', 'COVID-19疫苗注射-FM']
};

// 為主科別按鈕添加事件監聽器
document.querySelectorAll('.department-buttons button').forEach(function(btn) {
    btn.addEventListener('click', function() {
        // 移除先前選中的科別的 .btn-selected 類別
        document.querySelectorAll('.department-buttons button').forEach(function(b) {
            b.classList.remove('selected');
        });
        // 為當前選中的按鈕添加 .btn-selected 類別
        this.classList.add('selected');

        // 獲取按鈕上的 data-department 屬性值
        var department = this.getAttribute('data-department');

        // 顯示相應的細分部門
        showSubDepartments(department);
    });
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

//病房按鈕監聽器()
document.querySelectorAll('.ward-buttons button').forEach(function(btn) {
    btn.addEventListener('click', function() {
        // 移除同一按鈕組中其他按鈕的 .btn-selected 類別
        document.querySelectorAll('.ward-buttons button').forEach(function(b) {
            b.classList.remove('selected');
        });

        // 為點擊的按鈕添加 .btn-selected 類別
        btn.classList.add('selected');
    });
});

// 當按下開始排班按鈕時的事件處理函數
document.getElementById('startSchedulingBtn').addEventListener('click', function() {
    // 獲取選中的細分科別和病房
    var selectedSubDepartment = document.querySelector('.sub-department-buttons button.selected')?.textContent || '未選擇';
    var selectedWard = document.querySelector('.ward-buttons button.selected')?.textContent || '未選擇';
    // 構建 URL 和查詢參數
    var url = `/Manager/Schedule_setting?subdepartment=${encodeURIComponent(selectedSubDepartment)}&ward=${encodeURIComponent(selectedWard)}`;
    // 跳轉到 URL
    window.location.href = url;
});