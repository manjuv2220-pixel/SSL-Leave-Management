// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    });

    // Auto-dismiss alerts after 5 seconds
    setTimeout(function() {
        $('.alert').alert('close');
    }, 5000);

    // Form validation
    $('form').on('submit', function(e) {
        var requiredFields = $(this).find('[required]');
        var isValid = true;

        requiredFields.each(function() {
            if ($(this).val() === '') {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });

        if (!isValid) {
            e.preventDefault();
            toastr.error('Please fill all required fields');
        }
    });

    // Real-time clock
    function updateClock() {
        var now = new Date();
        var timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        var dateString = now.toLocaleDateString([], {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});

        $('.current-time').text(timeString);
        $('.current-date').text(dateString);
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Attendance check-in/out functionality
    $('#checkInBtn').on('click', function() {
        var now = new Date();
        var timeString = now.toTimeString().split(' ')[0].substring(0, 5);

        $.ajax({
            url: '/api/mark_attendance',
            method: 'POST',
            data: {
                action: 'check_in',
                time: timeString
            },
            success: function(response) {
                toastr.success('Checked in successfully at ' + timeString);
                $('#checkInBtn').prop('disabled', true);
                $('#checkOutBtn').prop('disabled', false);
            },
            error: function() {
                toastr.error('Failed to check in');
            }
        });
    });

    $('#checkOutBtn').on('click', function() {
        var now = new Date();
        var timeString = now.toTimeString().split(' ')[0].substring(0, 5);

        $.ajax({
            url: '/api/mark_attendance',
            method: 'POST',
            data: {
                action: 'check_out',
                time: timeString
            },
            success: function(response) {
                toastr.success('Checked out successfully at ' + timeString);
                $('#checkOutBtn').prop('disabled', true);
            },
            error: function() {
                toastr.error('Failed to check out');
            }
        });
    });

    // Leave days calculation
    $('#startDate, #endDate').on('change', function() {
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();

        if (startDate && endDate) {
            var start = new Date(startDate);
            var end = new Date(endDate);

            // Calculate working days
            var totalDays = 0;
            var current = new Date(start);

            while (current <= end) {
                var day = current.getDay();
                if (day !== 0 && day !== 6) { // Exclude weekends
                    totalDays++;
                }
                current.setDate(current.getDate() + 1);
            }

            $('#totalDays').val(totalDays);
        }
    });

    // Export functionality
    $('.export-btn').on('click', function() {
        var type = $(this).data('type');
        var format = $(this).data('format');

        $.ajax({
            url: '/api/export/' + type,
            method: 'POST',
            data: { format: format },
            xhrFields: {
                responseType: 'blob'
            },
            success: function(blob) {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = type + '_export.' + format;
                link.click();
                toastr.success('Export completed successfully');
            },
            error: function() {
                toastr.error('Export failed');
            }
        });
    });
});

// Toastr notifications configuration
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

// Chart initialization function
function initCharts() {
    // Attendance chart
    var ctx1 = document.getElementById('attendanceChart');
    if (ctx1) {
        new Chart(ctx1.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Present',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Leave type chart
    var ctx2 = document.getElementById('leaveTypeChart');
    if (ctx2) {
        new Chart(ctx2.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Annual', 'Sick', 'Casual', 'Emergency'],
                datasets: [{
                    data: [30, 20, 15, 5],
                    backgroundColor: [
                        'rgba(41, 128, 185, 0.8)',
                        'rgba(39, 174, 96, 0.8)',
                        'rgba(243, 156, 18, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Initialize charts when document is ready
$(document).ready(function() {
    initCharts();
});