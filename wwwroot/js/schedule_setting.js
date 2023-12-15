document.addEventListener('DOMContentLoaded', function() {
    var urlParams = new URLSearchParams(window.location.search);
    var subdepartment = urlParams.get('subdepartment');
    var ward = urlParams.get('ward');

    // 這裡顯示這些選項
    document.getElementById('selectedDepartment').textContent = subdepartment;
    document.getElementById('selectedWard').textContent = ward;

});
//
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-add-date')) {
        var newDateInput = document.createElement('input');
        newDateInput.type = 'date';
        newDateInput.className="date-button"
        var buttonContainer = event.target.parentNode; // 按鈕的父容器，例如 td 元素
        buttonContainer.insertBefore(newDateInput, event.target); // 在按鈕之前插入
    }
});
//
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-less-date')) {
        // 找到按鈕的父容器，例如 td 元素
        var buttonContainer = event.target.parentNode;

        // 找到父容器中的日期輸入框
        var dateInput = buttonContainer.querySelector('.date-button');

        // 如果找到日期輸入框，則刪除它
        if (dateInput) {
            dateInput.remove();
        }
    }
});

// document.addEventListener('DOMContentLoaded', function() {
//     var form = document.getElementById('scheduleForm');

//     form.addEventListener('submit', function() {
//         // 在這裡添加任何您需要的額外處理，或者允許表單正常提交
//     });
// });