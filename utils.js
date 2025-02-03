function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: message,
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function togglePasswordVisibility(inputId) {
    const passwordInput = document.getElementById(inputId);
    const icon = passwordInput.nextElementSibling;
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

function updatePointsDisplay() {
    if (currentUser) {
        document.getElementById('pointsDisplay').classList.remove('hidden');
        document.getElementById('pointsCount').innerText = currentUser.points;
    } else {
        document.getElementById('pointsDisplay').classList.add('hidden');
    }
}

function logActivity(action) {
    const timestamp = new Date().toLocaleString();
    activityLog.push({ action, timestamp });
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

function showActivityLog() {
    const log = activityLog.map(entry => `${entry.timestamp}: ${entry.action}`).join('\n');
    Swal.fire({
        title: 'سجل النشاطات',
        text: log,
        confirmButtonText: 'حسنًا'
    });
}

function canPerformActivity(activityName) {
    const lastTimestamp = lastActivityTimestamps[activityName];
    if (!lastTimestamp) return true;

    const now = new Date();
    const lastActivityDate = new Date(lastTimestamp);
    const hoursSinceLastActivity = (now - lastActivityDate) / (1000 * 60 * 60);

    return hoursSinceLastActivity >= 8;
}

function updateActivityTimestamp(activityName) {
    lastActivityTimestamps[activityName] = new Date().toISOString();
    localStorage.setItem('lastActivityTimestamps', JSON.stringify(lastActivityTimestamps));
}

function startTimer(activityName) {
    const lastTimestamp = lastActivityTimestamps[activityName];
    if (!lastTimestamp) return;

    const now = new Date();
    const lastActivityDate = new Date(lastTimestamp);
    let timeRemaining = 8 * 60 * 60 * 1000 - (now - lastActivityDate);

    if (timeRemaining > 0) {
        const timer = setInterval(() => {
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            document.getElementById('timer').innerText = `الوقت المتبقي: ${hours} ساعات ${minutes} دقائق ${seconds} ثواني`;
            timeRemaining -= 1000;

            if (timeRemaining < 0) {
                clearInterval(timer);
                document.getElementById('timer').innerText = '';
            }
        }, 1000);
    }
}