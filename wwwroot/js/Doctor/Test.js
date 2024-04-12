$.ajax({
    url: '../Manager/GetScheduleData', // 替換成你的Controller名稱
    type: 'GET',
    dataType: 'json',
    success: function(data) {
        // 在這裡處理從Controller返回的JSON數據
        console.log(data);

        // 清空之前的內容
        $('#json').empty();

        // 遍歷數據，將其添加到#json容器中
        $.each(data, function(index, item) {
            var scheduleItem = $('<div>').text(item);
            $('#json').append(scheduleItem);
        });
    },
    error: function(error) {
        console.error('Failed to fetch schedule data from the server.');
    }
});