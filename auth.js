function login() {
    const usernameOrEmail = document.getElementById('usernameOrEmail').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!usernameOrEmail || !password) {
        showError('يرجى ملء جميع الحقول!');
        return;
    }

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernameOrEmail, password, rememberMe })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const user = data.user;

            // تحميل قائمة الأكواد المستخدمة للمستخدم الحالي
            if (!user.usedGiftCodes) {
                user.usedGiftCodes = [];
            }

            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }

            currentUser = user;
            document.getElementById('welcomeUsername').innerText = user.firstName;
            updatePointsDisplay();
            showPage('welcomePage');
            showWelcomeMessage();
            completeLoginTask(); // إكمال مهمة تسجيل الدخول اليومي
        } else {
            showError('اليوزر نيم/الإيميل أو كلمة السر غير صحيحة!');
        }
    })
    .catch(error => {
        console.error('Error logging in:', error);
        showError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    });
}

function logout() {
    // حفظ النقاط في قاعدة البيانات قبل تسجيل الخروج
    if (currentUser) {
        fetch(`/api/users/${currentUser.username}/update-points`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ points: currentUser.points })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.removeItem('currentUser');
                sessionStorage.removeItem('currentUser');
                currentUser = null;
                showPage('loginPage');
                showToast('تم تسجيل الخروج بنجاح!');
            } else {
                showError('حدث خطأ أثناء حفظ النقاط!');
            }
        })
        .catch(error => {
            console.error('Error saving points:', error);
            showError('حدث خطأ أثناء حفظ النقاط!');
        });
    } else {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        currentUser = null;
        showPage('loginPage');
        showToast('تم تسجيل الخروج بنجاح!');
    }
}