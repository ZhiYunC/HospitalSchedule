document.addEventListener('DOMContentLoaded', function() {
    var urlParams = new URLSearchParams(window.location.search);
    var subdepartment = urlParams.get('subdepartment');
    var ward = urlParams.get('ward');

    // 這裡顯示這些選項
    document.getElementById('selectedDepartment').textContent = subdepartment;
    document.getElementById('selectedWard').textContent = ward;

    // 隱藏不屬於選定科別的醫生
    const allDoctorElements = document.querySelectorAll('.doctor-list');
    allDoctorElements.forEach(doctorElement => {
        const department = doctorElement.getAttribute('data-department');
        if (department !== subdepartment) {
            doctorElement.style.display = 'none';
        }
    });
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-add-date')) {
        var newDateInput = document.createElement('input');
        newDateInput.type = 'date';
        newDateInput.className="date-button"
        var buttonContainer = event.target.parentNode; // 按鈕的父容器，例如 td 元素
        buttonContainer.insertBefore(newDateInput, event.target); // 在按鈕之前插入
    }
});