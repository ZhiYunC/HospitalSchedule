// 為主科別按鈕添加事件監聽器
document.querySelectorAll('.department-buttons button').forEach(function(btn) {
    btn.addEventListener('click', function() {
        // 移除先前選中的科別的 .btn-selected 類別
        document.querySelectorAll('.department-buttons button').forEach(function(b) {
            b.classList.remove('selected');
        });
        // 為當前選中的按鈕添加 .btn-selected 類別
        this.classList.add('selected');
    });
}); 
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
    var selectedDepartment = document.querySelector('.department-buttons button.selected')?.textContent || '未選擇';
    var selectedWard = document.querySelector('.ward-buttons button.selected')?.textContent || '未選擇';
    // 構建 URL 和查詢參數
    var url = `/Manager/Scheduling?department=${encodeURIComponent(selectedDepartment)}&ward=${encodeURIComponent(selectedWard)}`;
    // 跳轉到 URL
    window.location.href = url;
});