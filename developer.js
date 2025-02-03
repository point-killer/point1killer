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

function loadUsersList() {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            const usersListElement = document.getElementById('usersList');
            usersListElement.innerHTML = '';

            users.forEach(user => {
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
        })
        .catch(error => console.error('Error fetching users:', error));
}

function deleteUser(username) {
    fetch(`/api/users/${username}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadUsersList();
            showToast('تم حذف المستخدم بنجاح!');
        } else {
            showError(data.message);
        }
    })
    .catch(error => console.error('Error deleting user:', error));
}

function resetUserPassword(username) {
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
                fetch(`/api/users/${username}/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newPassword })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showToast('تم إعادة تعيين كلمة السر بنجاح!');
                        loadUsersList();
                    } else {
                        showError(data.message);
                    }
                })
                .catch(error => console.error('Error resetting password:', error));
            }
        }
    });
}

function sendPoints(username) {
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
                fetch(`/api/users/${username}/send-points`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ points })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showToast(`تم إرسال ${points} نقاط إلى المستخدم بنجاح!`);
                        loadUsersList();
                    } else {
                        showError(data.message);
                    }
                })
                .catch(error => console.error('Error sending points:', error));
            }
        }
    });
}

function exportToJSON() {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            const dataStr = JSON.stringify(users, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'users.json';
            link.click();
            showToast('تم تصدير البيانات إلى JSON بنجاح!');
        })
        .catch(error => console.error('Error exporting to JSON:', error));
}

function exportToCSV() {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
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
            showToast('تم تصدير البيانات إلى CSV بنجاح!');
        })
        .catch(error => console.error('Error exporting to CSV:', error));
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