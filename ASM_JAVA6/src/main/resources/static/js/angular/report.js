function exportToExcel() {
    // Lấy dữ liệu từ bảng
    var table = document.getElementById('dataTable');
    var html = table.outerHTML;

    // Gửi dữ liệu đến Spring Boot backend để xử lý và tạo file Excel
    fetch('/export-excel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: html }),
    })
    .then(response => response.blob())
    .then(blob => {
        // Tạo một đường link để tải file Excel
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([blob]));
        link.download = 'data.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}