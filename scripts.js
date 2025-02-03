let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];
let ideas = JSON.parse(localStorage.getItem('ideas')) || [];
let messages = JSON.parse(localStorage.getItem('messages')) || [];
let lastActivityTimestamps = JSON.parse(localStorage.getItem('lastActivityTimestamps')) || {};
let dailyTasks = JSON.parse(localStorage.getItem('dailyTasks')) || {
    login: false,
    idea: false,
    video: false
};

// أكواد الهدايا
const giftCodes = new Set([
    "MXL", "0MXL", "Point Killer", "m0x0l", "00mxl", "m09xl", "0m1xl", "m0x1l", 
    "3m1xl", "8m3xl", "m8x0l", "mxl16", "40mxl", "19mxl", "8mx0l", "m0xl9", 
    "9m1xl", "mx11l", "1mxl1"
]);

// أكواد تم استخدامها
let usedGiftCodes = JSON.parse(localStorage.getItem('usedGiftCodes')) || [];

function generateRandomCode(length = 16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function redeemGift() {
    const giftCode = document.getElementById('giftCode').value.trim();
    if (!giftCode) {
        showError('يرجى إدخال كود الهدية!');
        return;
    }

    if (!currentUser) {
        showError('يجب تسجيل الدخول أولاً!');
        return;
    }

    // التحقق من أن الكود لم يتم استخدامه من قبل المستخدم الحالي
    if (currentUser.usedGiftCodes && currentUser.usedGiftCodes.includes(giftCode)) {
        showError('هذا الكود تم استخدامه مسبقًا!');
        return;
    }

    if (!giftCodes.has(giftCode)) {
        showError('كود الهدية غير صحيح!');
        return;
    }

    // إضافة النقاط للمستخدم
    currentUser.points += 100;
    
    // إضافة الكود إلى قائمة الأكواد المستخدمة للمستخدم الحالي
    if (!currentUser.usedGiftCodes) {
        currentUser.usedGiftCodes = [];
    }
    currentUser.usedGiftCodes.push(giftCode);
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    users = users.map(u => u.username === currentUser.username ? currentUser : u);
    localStorage.setItem('users', JSON.stringify(users));

    // تحديث عرض النقاط
    updatePointsDisplay();

    // إظهار رسالة نجاح
    showToast('تم استرداد الهدية بنجاح!');
}

function canSendMessage() {
    if (!lastMessageTimestamp) return true;

    const now = new Date();
    const lastMessageDate = new Date(lastMessageTimestamp);
    const hoursSinceLastMessage = (now - lastMessageDate) / (1000 * 60 * 60);

    // إذا مرت 4 ساعات، نعيد تعيين عدد الرسائل
    if (hoursSinceLastMessage >= 4) {
        messageCount = 0;
        localStorage.setItem('messageCount', JSON.stringify(messageCount));
        return true;
    }

    // إذا كان عدد الرسائل أقل من 2، نسمح بالإرسال
    return messageCount < 2;
}

function purchaseActivatedAccount() {
    if (!currentUser) {
        showError('يجب تسجيل الدخول أولاً!');
        return;
    }

    if (currentUser.points < 200) {
        showError('ليس لديك نقاط كافية! تحتاج إلى 200 نقطة.');
        return;
    }

    // خصم النقاط
    currentUser.points -= 200;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    users = users.map(u => u.username === currentUser.username ? currentUser : u);
    localStorage.setItem('users', JSON.stringify(users));

    // تحديث عرض النقاط
    updatePointsDisplay();

    // إنشاء كود عشوائي
    const activationCode = generateRandomCode();

    // عرض الكود في رسالة مدتها دقيقة واحدة
    const activationCodeElement = document.getElementById('accountCode');
    activationCodeElement.innerText = activationCode;
    document.getElementById('activatedAccountCode').classList.remove('hidden');

    // إخفاء الكود بعد دقيقة واحدة
    setTimeout(() => {
        document.getElementById('activatedAccountCode').classList.add('hidden');
    }, 60000); // 60 ثانية

    // إظهار رسالة نجاح
    showToast('تم شراء حساب مفعل بنجاح! الكود الخاص بك ظاهر الآن لمدة دقيقة واحدة.');
}

// مصفوفة الفيزات
let vizas = [
    "5195351048130471|02|2031|488",
    "5195359725017655|12|2028|432",
    "5195350919492077|01|2032|819",
    "5195359473010605|08|2029|503",
    "5195352181828376|01|2028|190",
    "5195353123789973|08|2030|771",
    "5195354074001392|06|2032|466",
    "5195355862642487|11|2026|749",
    "5195350347250436|06|2029|298",
    "5195355353354808|07|2030|122",
    "5195350897389071|09|2027|350",
    "5195352949060395|02|2032|971",
    "5195358453207264|07|2031|421",
    "5195358274331558|11|2028|774",
    "5195350211535128|10|2027|676",
    "5195355968349763|02|2029|605",
    "5195354799094573|02|2029|372",
    "5195352706711180|03|2026|895",
    "5195353884499614|04|2027|883",
    "5195353541071632|10|2028|749",
    "5195351290160788|12|2027|667",
    "5195351116139685|10|2026|571",
    "5195356862402070|09|2031|438",
    "5195356208807313|06|2031|623",
    "5195357338639824|10|2031|285",
    "5195359402617215|08|2028|784",
    "5195356447855115|01|2031|746",
    "5195359561750419|03|2032|110",
    "5195352247049884|12|2029|276"
];

// لعبة إكس-أو
let currentPlayer = 'X';
let gameBoard = Array(9).fill('');
let winStreak = 0;

// قيود إرسال الرسائل
let lastMessageTimestamp = JSON.parse(localStorage.getItem('lastMessageTimestamp')) || null;
let messageCount = JSON.parse(localStorage.getItem('messageCount')) || 0;

let ws;

// الاتصال بخادم WebSocket
function connectWebSocket() {
    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
        console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
            const message = JSON.parse(data.data);
            messages.push(message);
            displayMessages();
        }
    };

    ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
    };
}

function sendMessage() {
    if (!canSendMessage()) {
        showError('يمكنك إرسال رسالتين فقط كل 4 ساعات!');
        return;
    }

    const messageContent = document.getElementById('messageInput').value.trim();
    if (!messageContent) {
        showError('يرجى كتابة رسالة!');
        return;
    }

    if (!currentUser) {
        showError('يجب تسجيل الدخول أولاً!');
        return;
    }

    const newMessage = {
        sender: currentUser.username,
        message: messageContent,
        timestamp: new Date().toLocaleString()
    };

    // إرسال الرسالة عبر WebSocket
    ws.send(JSON.stringify(newMessage));

    // تحديث الوقت وعدد الرسائل
    updateMessageTimestamp();
}

function displayMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';

    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `
            <strong>${msg.sender}</strong> - <span class="timestamp">${msg.timestamp}</span>
            <p>${msg.message}</p>
        `;
        messagesContainer.appendChild(messageDiv);
    });
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

function showPage(pageId) {
    document.querySelectorAll('[id$="Page"]').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    if (pageId === 'profilePage') {
        loadProfileData();
    } else if (pageId === 'challengePage') {
        loadIdeas();
    } else if (pageId === 'developerPage') {
        loadDeveloperContent();
    } else if (pageId === 'vizaPage') {
        loadViza();
    } else if (pageId === 'pointsGuidePage') {
        loadTasksStatus();
    } else if (pageId === 'dailyTasksPage') {
        loadDailyTasksStatus();
    } else if (pageId === 'playWithBotPage' || pageId === 'playWithFriendPage') {
        resetGame();
    }
}

function generateViza() {
    if (!currentUser) return;

    if (currentUser.points < 10) {
        showError('ليس لديك نقاط كافية! تحتاج إلى 10 نقاط.');
        return;
    }

    // إضافة تأخير لمدة ثانية واحدة
    document.getElementById('getNewVizaButton').disabled = true;
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * vizas.length);
        const selectedViza = vizas[randomIndex];
        document.getElementById('vizaNumber').innerText = selectedViza;
        document.getElementById('vizaOutput').classList.remove('hidden');

        currentUser.points -= 10;
        currentUser.points += 2; // مكافأة نقطتين عند شراء فيزا
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        users = users.map(u => u.username === currentUser.username ? currentUser : u);
        localStorage.setItem('users', JSON.stringify(users));
        updatePointsDisplay();

        // حفظ الفيزا في localStorage مع وقت انتهاء الصلاحية
        const vizaExpiry = new Date().getTime() + 12 * 60 * 60 * 1000; // 12 ساعة
        localStorage.setItem('currentViza', JSON.stringify({ viza: selectedViza, expiry: vizaExpiry }));

        showToast('تم الحصول على فيزا جديدة بنجاح!');
        document.getElementById('getNewVizaButton').disabled = false;

        // تحديث حالة المهمة
        document.getElementById('vizaTask').classList.remove('hidden');
    }, 1000); // تأخير 1 ثانية
}

function loadViza() {
    const vizaData = JSON.parse(localStorage.getItem('currentViza'));
    if (vizaData && new Date().getTime() < vizaData.expiry) {
        document.getElementById('vizaNumber').innerText = vizaData.viza;
        document.getElementById('vizaOutput').classList.remove('hidden');
        document.getElementById('vizaMessage').innerText = 'الفيزا يمكن استخدامها على العديد من الحسابات بنفس الفيزا.';
    } else {
        localStorage.removeItem('currentViza');
    }
}

function copyViza() {
    const vizaNumber = document.getElementById('vizaNumber').innerText;
    navigator.clipboard.writeText(vizaNumber).then(() => {
        showToast("تم نسخ الفيزا بنجاح!");
    });
}

function loadProfileData() {
    if (currentUser) {
        document.getElementById('profileFirstName').value = currentUser.firstName;
        document.getElementById('profileLastName').value = currentUser.lastName;
        document.getElementById('profileUsername').value = currentUser.username;
        document.getElementById('profileEmail').value = currentUser.email;
        document.getElementById('profilePassword').value = '';
        document.getElementById('profileRecoveryPassword').value = '';
    }
}

function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: message,
    });
}

function login() {
    const usernameOrEmail = document.getElementById('usernameOrEmail').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!usernameOrEmail || !password) {
        showError('يرجى ملء جميع الحقول!');
        return;
    }

    const user = users.find(u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password);
    if (user) {
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
}

function showWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const welcomeText = document.getElementById('welcomeText');
    const loginSuccessText = document.getElementById('loginSuccessText');

    welcomeText.innerText = `مرحبًا، ${currentUser.firstName}`;
    loginSuccessText.innerText = 'تم تسجيل الدخول بنجاح';
    welcomeMessage.classList.remove('hidden');

    setTimeout(() => {
        welcomeMessage.classList.add('hidden');
    }, 3000);
}

function register() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const newUsername = document.getElementById('newUsername').value.trim();
    const email = document.getElementById('email').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const recoveryPassword = document.getElementById('recoveryPassword').value.trim();

    if (!firstName || !lastName || !newUsername || !email || !newPassword || !recoveryPassword) {
        showError('يرجى ملء جميع الحقول!');
        return;
    }

    if (users.some(u => u.username === newUsername)) {
        showError('اليوزر نيم موجود بالفعل!');
        return;
    }
    if (users.some(u => u.email === email)) {
        showError('الإيميل موجود بالفعل!');
        return;
    }

    const newUser = {
        firstName,
        lastName,
        username: newUsername,
        email,
        password: newPassword,
        recoveryPassword,
        points: 0,
        usedGiftCodes: [] // إضافة قائمة الأكواد المستخدمة
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    Swal.fire({
        icon: 'success',
        title: 'تم إنشاء الحساب بنجاح!',
        showConfirmButton: false,
        timer: 1500
    });
    showPage('loginPage');
}

function resetPassword() {
    const usernameOrEmail = document.getElementById('forgotUsernameOrEmail').value.trim();
    const recoveryPassword = document.getElementById('forgotRecoveryPassword').value.trim();

    if (!usernameOrEmail || !recoveryPassword) {
        showError('يرجى ملء جميع الحقول!');
        return;
    }

    const user = users.find(u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.recoveryPassword === recoveryPassword);
    if (user) {
        Swal.fire({
            title: 'أدخل كلمة السر الجديدة',
            input: 'password',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'حفظ',
            cancelButtonText: 'إلغاء',
            showLoaderOnConfirm: true,
            preConfirm: (newPassword) => {
                if (newPassword) {
                    user.password = newPassword;
                    localStorage.setItem('users', JSON.stringify(users));
                    Swal.fire({
                        icon: 'success',
                        title: 'تم إعادة تعيين كلمة السر بنجاح!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    showPage('loginPage');
                }
            }
        });
    } else {
        showError('اليوزر نيم/الإيميل أو كلمة السر السرية غير صحيحة!');
    }
}

function logout() {
    if (currentUser) {
        // حفظ النقاط في localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.map(u => u.username === currentUser.username ? currentUser : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    currentUser = null;
    showPage('loginPage');
    showToast('تم تسجيل الخروج بنجاح!');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function updateProfile() {
    const firstName = document.getElementById('profileFirstName').value.trim();
    const lastName = document.getElementById('profileLastName').value.trim();
    const username = document.getElementById('profileUsername').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    const password = document.getElementById('profilePassword').value.trim();
    const recoveryPassword = document.getElementById('profileRecoveryPassword').value.trim();

    if (!firstName || !lastName || !username || !email) {
        showError('يرجى ملء جميع الحقول الإجبارية!');
        return;
    }

    if (users.some(u => u.username === username && u.username !== currentUser.username)) {
        showError('اليوزر نيم موجود بالفعل!');
        return;
    }
    if (users.some(u => u.email === email && u.email !== currentUser.email)) {
        showError('الإيميل موجود بالفعل!');
        return;
    }

    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.username = username;
    currentUser.email = email;
    if (password) {
        currentUser.password = password;
    }
    if (recoveryPassword) {
        currentUser.recoveryPassword = recoveryPassword;
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    users = users.map(u => u.username === currentUser.username ? currentUser : u);
    localStorage.setItem('users', JSON.stringify(users));

    showToast('تم تحديث البيانات بنجاح!');
}

function updatePointsDisplay() {
    if (currentUser) {
        document.getElementById('pointsDisplay').classList.remove('hidden');
        document.getElementById('pointsCount').innerText = currentUser.points;
    } else {
        document.getElementById('pointsDisplay').classList.add('hidden');
    }
}

function loadInitialPage() {
    users = JSON.parse(localStorage.getItem('users')) || [];
    messages = JSON.parse(localStorage.getItem('messages')) || []; // تحميل الرسائل

    if (currentUser) {
        document.getElementById('welcomeUsername').innerText = currentUser.firstName;
        updatePointsDisplay();
        showPage('welcomePage');
        loadIdeas(); // تحميل الأفكار عند فتح الصفحة
        displayMessages(); // عرض الرسائل
    } else {
        showPage('loginPage');
    }
}

function showDeveloperPage() {
    showPage('developerPage');
}

function accessDeveloperPage() {
    const developerPassword = document.getElementById('developerPassword').value.trim();
    const correctPassword = "21944793Mohamed@gmail.com";

    if (developerPassword === correctPassword) {
        document.getElementById('developerContent').classList.remove('hidden');
        loadUsersList();
        loadDeveloperIdeas();
    } else {
        showError('كلمة السر غير صحيحة!');
    }
}

function loadUsersList(usersList = users) {
    const usersListElement = document.getElementById('usersList');
    usersListElement.innerHTML = '';

    usersList.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'border-b';
        row.innerHTML = `
            <td class="p-2">${user.firstName} ${user.lastName}</td>
            <td class="p-2">${user.username}</td>
            <td class="p-2">${user.email}</td>
            <td class="p-2">${user.password}</td>
            <td class="p-2">${user.recoveryPassword}</td>
            <td class="p-2">
                <button onclick="deleteUser('${user.username}')" class="bg-red-500 text-white p-1 rounded hover:bg-red-600">حذف</button>
                <button onclick="resetUserPassword('${user.username}')" class="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600">إعادة تعيين كلمة السر</button>
                <button onclick="sendPoints('${user.username}')" class="bg-green-500 text-white p-1 rounded hover:bg-green-600">إرسال نقاط</button>
            </td>
        `;
        usersListElement.appendChild(row);
    });
}

function deleteUser(username) {
    users = users.filter(u => u.username !== username);
    localStorage.setItem('users', JSON.stringify(users));
    loadUsersList();
    logActivity(`تم حذف المستخدم: ${username}`);
    showToast('تم حذف المستخدم بنجاح!');
}

function resetUserPassword(username) {
    const user = users.find(u => u.username === username);
    if (user) {
        Swal.fire({
            title: 'إعادة تعيين كلمة السر',
            input: 'password',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'حفظ',
            cancelButtonText: 'إلغاء',
            preConfirm: (newPassword) => {
                if (newPassword) {
                    user.password = newPassword;
                    localStorage.setItem('users', JSON.stringify(users));
                    logActivity(`تم إعادة تعيين كلمة سر المستخدم: ${username}`);
                    showToast('تم إعادة تعيين كلمة السر بنجاح!');
                    loadUsersList();
                }
            }
        });
    }
}

function sendPoints(username) {
    const user = users.find(u => u.username === username);
    if (user) {
        Swal.fire({
            title: 'إرسال نقاط',
            input: 'number',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'إرسال',
            cancelButtonText: 'إلغاء',
            preConfirm: (points) => {
                if (points) {
                    user.points += parseInt(points);
                    localStorage.setItem('users', JSON.stringify(users));
                    logActivity(`تم إرسال ${points} نقاط إلى المستخدم: ${username}`);
                    showToast(`تم إرسال ${points} نقاط إلى المستخدم بنجاح!`);
                    loadUsersList();
                }
            }
        });
    }
}

function exportToJSON() {
    const dataStr = JSON.stringify(users, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.json';
    link.click();
    logActivity('تم تصدير البيانات إلى JSON');
    showToast('تم تصدير البيانات إلى JSON بنجاح!');
}

function exportToCSV() {
    const headers = ['الاسم', 'اليوزر نيم', 'الإيميل', 'كلمة السر', 'كلمة السر السرية'];
    const rows = users.map(user => [
        `${user.firstName} ${user.lastName}`,
        user.username,
        user.email,
        user.password,
        user.recoveryPassword
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.csv';
    link.click();
    logActivity('تم تصدير البيانات إلى CSV');
    showToast('تم تصدير البيانات إلى CSV بنجاح!');
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
    const lastActivityDate = new Date(lastTimestamp.time);
    const hoursSinceLastActivity = (now - lastActivityDate) / (1000 * 60 * 60);

    // إذا مرت 4 ساعات، نعيد تعيين عدد الأفكار المرسلة
    if (hoursSinceLastActivity >= 4) {
        lastActivityTimestamps[activityName] = null;
        localStorage.setItem('lastActivityTimestamps', JSON.stringify(lastActivityTimestamps));
        return true;
    }

    // إذا كان عدد الأفكار المرسلة أقل من 2، نسمح بالإرسال
    return (lastActivityTimestamps[activityName].count || 0) < 2;
}

function updateActivityTimestamp(activityName) {
    const now = new Date();
    const lastTimestamp = lastActivityTimestamps[activityName];

    if (!lastTimestamp || (now - new Date(lastTimestamp.time)) >= 4 * 60 * 60 * 1000) {
        // إذا مرت 4 ساعات، نبدأ عدًا جديدًا
        lastActivityTimestamps[activityName] = {
            time: now.toISOString(),
            count: 1
        };
    } else {
        // إذا لم تمر 4 ساعات، نزيد العدد
        lastActivityTimestamps[activityName].count += 1;
    }

    localStorage.setItem('lastActivityTimestamps', JSON.stringify(lastActivityTimestamps));
}

function submitIdea() {
    if (!currentUser) return;

    // تحميل البيانات من localStorage
    const lastIdeaTimestamp = JSON.parse(localStorage.getItem('lastIdeaTimestamp')) || null;
    const ideaCount = JSON.parse(localStorage.getItem('ideaCount')) || 0;

    const now = new Date();

    // إذا مرت 4 ساعات منذ آخر فكرة، نعيد تعيين العداد
    if (lastIdeaTimestamp && (now - new Date(lastIdeaTimestamp)) >= 4 * 60 * 60 * 1000) {
        localStorage.setItem('ideaCount', JSON.stringify(0));
        localStorage.setItem('lastIdeaTimestamp', JSON.stringify(null));
    }

    // إذا كان عدد الأفكار المرسلة 2 أو أكثر، نتحقق من الوقت المنقضي
    if (ideaCount >= 2) {
        if (lastIdeaTimestamp && (now - new Date(lastIdeaTimestamp)) < 4 * 60 * 60 * 1000) {
            showError('يمكنك إرسال فكرتين فقط كل 4 ساعات!');
            return;
        } else {
            // إذا مرت 4 ساعات، نعيد تعيين العداد
            localStorage.setItem('ideaCount', JSON.stringify(0));
            localStorage.setItem('lastIdeaTimestamp', JSON.stringify(null));
        }
    }

    const ideaText = document.getElementById('challengeIdea').value.trim();
    if (!ideaText) {
        showError('يرجى كتابة فكرة إبداعية!');
        return;
    }

    const newIdea = {
        username: currentUser.username,
        idea: ideaText,
        timestamp: new Date().toLocaleString()
    };

    ideas.push(newIdea);
    localStorage.setItem('ideas', JSON.stringify(ideas));

    currentUser.points += 5;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    users = users.map(u => u.username === currentUser.username ? currentUser : u);
    localStorage.setItem('users', JSON.stringify(users));

    // تحديث الوقت وعدد الأفكار المرسلة
    if (ideaCount + 1 === 2) {
        localStorage.setItem('lastIdeaTimestamp', JSON.stringify(now.toISOString()));
    }
    localStorage.setItem('ideaCount', JSON.stringify(ideaCount + 1));

    showToast('تم إرسال الفكرة بنجاح!');
    loadIdeas();
    updatePointsDisplay();
    document.getElementById('ideaTask').classList.remove('hidden');
}

function loadIdeas() {
    const ideasListElement = document.getElementById('ideasList');
    ideasListElement.innerHTML = '';

    ideas.forEach((idea, index) => {
        const ideaDiv = document.createElement('div');
        ideaDiv.className = 'bg-gray-100 p-4 rounded-lg text-black';
        ideaDiv.innerHTML = `
            <p><strong>${idea.username}</strong> - <span class="text-sm text-gray-600">${idea.timestamp}</span></p>
            <p>${idea.idea}</p>
            <div class="flex items-center justify-between mt-2">
                <button onclick="voteForIdea(${index})" class="bg-blue-500 text-white p-1 rounded hover:bg-blue-600">تصويت (${idea.votes || 0})</button>
                <button onclick="deleteIdea(${index})" class="bg-red-500 text-white p-1 rounded hover:bg-red-600">حذف</button>
            </div>
        `;
        ideasListElement.appendChild(ideaDiv);
    });
}

function loadDeveloperIdeas() {
    const developerIdeasListElement = document.getElementById('developerIdeasList');
    developerIdeasListElement.innerHTML = '';

    ideas.forEach((idea, index) => {
        const ideaDiv = document.createElement('div');
        ideaDiv.className = 'bg-gray-100 p-4 rounded-lg text-black';
        ideaDiv.innerHTML = `
            <p><strong>${idea.username}:</strong> ${idea.idea}</p>
            <div class="flex items-center justify-between mt-2">
                <span>التصويتات: ${idea.votes}</span>
                <button onclick="deleteIdea(${index})" class="bg-red-500 text-white p-1 rounded hover:bg-red-600">حذف</button>
            </div>
        `;
        developerIdeasListElement.appendChild(ideaDiv);
    });
}

function editIdea(index) {
    const idea = ideas[index];
    Swal.fire({
        title: 'تعديل الفكرة',
        input: 'text',
        inputValue: idea.idea,
        showCancelButton: true,
        confirmButtonText: 'حفظ',
        cancelButtonText: 'إلغاء',
        preConfirm: (newIdea) => {
            if (newIdea) {
                idea.idea = newIdea;
                localStorage.setItem('ideas', JSON.stringify(ideas));
                loadIdeas();
                showToast('تم تعديل الفكرة بنجاح!');
            }
        }
    });
}

function deleteIdea(index) {
    const idea = ideas[index];
    if (idea.username === currentUser.username) {
        currentUser.points += 3;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        users = users.map(u => u.username === currentUser.username ? currentUser : u);
        localStorage.setItem('users', JSON.stringify(users));

        ideas.splice(index, 1);
        localStorage.setItem('ideas', JSON.stringify(ideas));
        loadIdeas();
        showToast('تم حذف الفكرة بنجاح!');
        updatePointsDisplay();
        document.getElementById('deleteTask').classList.remove('hidden');
    } else {
        showError('لا يمكنك حذف فكرة ليست لك!');
    }
}

function loadTasksStatus() {
    if (currentUser) {
        if (currentUser.points >= 10) {
            document.getElementById('vizaTask').classList.remove('hidden');
        }
        if (currentUser.points >= 5) {
            document.getElementById('ideaTask').classList.remove('hidden');
        }
        if (currentUser.points >= 2) {
            document.getElementById('voteTask').classList.remove('hidden');
        }
        if (currentUser.points >= 3) {
            document.getElementById('deleteTask').classList.remove('hidden');
        }
        if (currentUser.points >= 5) {
            document.getElementById('videoTask').classList.remove('hidden');
        }
    }
}

// لعبة إكس-أو
function resetGame() {
    gameBoard = Array(9).fill('');
    currentPlayer = 'X';
    document.querySelectorAll('.game-cell').forEach(cell => cell.innerText = '');
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // صفوف
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // أعمدة
        [0, 4, 8], [2, 4, 6]             // أقطار
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }
    return null;
}

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (gameBoard[index] || !currentUser) return;

    gameBoard[index] = currentPlayer;
    cell.innerText = currentPlayer;

    const winner = checkWin();
    if (winner) {
        if (document.getElementById('playWithBotPage').classList.contains('hidden')) {
            // اللعب مع صديق (لا نقاط)
            showToast(`الفائز هو: ${winner}`);
        } else {
            // اللعب ضد البوت
            winStreak++;
            if (winStreak === 3) {
                currentUser.points += 4;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                users = users.map(u => u.username === currentUser.username ? currentUser : u);
                localStorage.setItem('users', JSON.stringify(users));
                updatePointsDisplay();
                showToast('مبروك! لقد فزت 3 مرات متتالية وحصلت على 4 نقاط!');
                winStreak = 0;
                document.getElementById('gameTask').classList.remove('hidden');
            } else {
                showToast(`لقد فزت! انتصاراتك المتتالية: ${winStreak}`);
            }
        }
        resetGame();
    } else if (gameBoard.every(cell => cell !== '')) {
        showToast('تعادل!');
        resetGame();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (!document.getElementById('playWithBotPage').classList.contains('hidden')) {
            // إذا كانت اللعبة ضد البوت
            setTimeout(() => {
                const emptyCells = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
                const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                gameBoard[randomIndex] = currentPlayer;
                document.querySelector(`.game-cell[data-index="${randomIndex}"]`).innerText = currentPlayer;

                const botWinner = checkWin();
                if (botWinner) {
                    showToast(`البوت فاز!`);
                    resetGame();
                } else if (gameBoard.every(cell => cell !== '')) {
                    showToast('تعادل!');
                    resetGame();
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                }
            }, 500); // تأخير 500 مللي ثانية لتحرك البوت
        }
    }
}

document.querySelectorAll('.game-cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// الاتصال بخادم WebSocket عند تحميل الصفحة
connectWebSocket();

// تحميل الصفحة الأولية
loadInitialPage();