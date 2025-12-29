// Form validation and handling for Pictorgram

// script.js - client-side "database" using localStorage

const USERS_KEY = 'pictorgram_users';
const CURRENT_USER_KEY = 'pictorgram_current_user';

function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
}
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function setCurrentUserId(id) { localStorage.setItem(CURRENT_USER_KEY, String(id)); }
function getCurrentUserId() { return localStorage.getItem(CURRENT_USER_KEY); }
function clearCurrentUser() { localStorage.removeItem(CURRENT_USER_KEY); }

function findUserByEmailOrPhone(value) {
    const users = getUsers();
    return users.find(u => u.emailOrPhone.toLowerCase() === value.toLowerCase());
}
function findUserById(id) {
    const users = getUsers();
    return users.find(u => String(u.id) === String(id));
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePhone(phone) {
    const phoneClean = phone.replace(/\s/g, '');
    const phoneRegex = /^[\d\-\+\(\)]{10,}$/;
    return phoneRegex.test(phoneClean);
}
function validEmailOrPhone(v) {
    return validateEmail(v) || validatePhone(v);
}

document.addEventListener('DOMContentLoaded', () => {
    // INDEX (login) page
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('Login-Button');
    if (loginBtn && loginEmail && loginPassword) {
        loginBtn.addEventListener('click', () => {
            const idOrEmail = loginEmail.value.trim();
            const password = loginPassword.value;
            if (!idOrEmail || !password) { alert('Please fill in all fields'); return; }
            if (!validEmailOrPhone(idOrEmail)) { alert('Enter a valid email or phone'); return; }
            const users = getUsers();
            const user = users.find(u => u.emailOrPhone.toLowerCase() === idOrEmail.toLowerCase());
            if (!user || user.password !== password) { alert('Invalid credentials'); return; }
            setCurrentUserId(user.id);
            window.location.href = 'accounts.html';
        });
    }

    // SIGN UP page
    const signBtn = document.getElementById('Sign-Button');
    if (signBtn) {
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const signEmail = document.getElementById('signEmail');
        const signPassword = document.getElementById('signPassword');
        const signConfirm = document.getElementById('signConfirm');

        signBtn.addEventListener('click', () => {
            const fn = firstName.value.trim();
            const ln = lastName.value.trim();
            const em = signEmail.value.trim();
            const pw = signPassword.value;
            const conf = signConfirm.value;

            if (!fn || !ln || !em || !pw || !conf) { alert('Please fill all fields'); return; }
            if (!validEmailOrPhone(em)) { alert('Enter a valid email or phone'); return; }
            if (pw.length < 6) { alert('Password must be at least 6 characters'); return; }
            if (pw !== conf) { alert('Passwords do not match'); return; }
            if (findUserByEmailOrPhone(em)) { alert('An account with that email/phone already exists'); return; }

            const users = getUsers();
            const newUser = {
                id: Date.now(),
                firstName: fn,
                lastName: ln,
                emailOrPhone: em,
                password: pw,
                displayName: fn + (ln ? ' ' + ln : ''),
                profileImage: null
            };
            users.push(newUser);
            saveUsers(users);
            setCurrentUserId(newUser.id);
            window.location.href = 'accounts.html';
        });
    }

    // FORGET PASSWORD page
    const findBtn = document.getElementById('Find-Button');
    if (findBtn) {
        const findInput = document.getElementById('findInput');
        findBtn.addEventListener('click', () => {
            const v = findInput.value.trim();
            if (!v) { alert('Please enter an email or phone'); return; }
            if (!validEmailOrPhone(v)) { alert('Enter a valid email or phone'); return; }
            const user = findUserByEmailOrPhone(v);
            if (!user) { alert('No account found with that email/phone'); return; }
            alert('Account found for: ' + user.displayName + '\nYou can login from the main page.');
            window.location.href = 'index.html';
        });
    }

    // ACCOUNTS page (select account)
    const accountsList = document.getElementById('accountsList');
    if (accountsList) {
        const users = getUsers();
        accountsList.innerHTML = '';
        if (users.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.padding = '40px 20px';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.innerHTML = '<h2>No accounts yet</h2><p style="color: #737373; margin-top: 10px;">Create an account to get started!</p>';
            accountsList.appendChild(emptyMsg);
        } else {
            users.forEach(u => {
                const card = document.createElement('div');
                card.className = 'account-card';
                
                const img = document.createElement('img');
                img.src = u.profileImage || 'Logo.png';
                img.alt = 'profile';
                
                const name = document.createElement('div');
                name.textContent = u.displayName || (u.firstName + ' ' + u.lastName);
                name.style.fontWeight = '600';
                name.style.marginTop = '12px';
                name.style.fontSize = '16px';
                
                const email = document.createElement('div');
                email.textContent = u.emailOrPhone;
                email.style.fontSize = '12px';
                email.style.color = '#737373';
                email.style.marginTop = '4px';
                
                const open = document.createElement('button');
                open.textContent = 'Open Profile';
                open.addEventListener('click', () => {
                    window.location.href = `profile.html?userId=${u.id}`;
                });
                
                card.appendChild(img);
                card.appendChild(name);
                card.appendChild(email);
                card.appendChild(open);
                accountsList.appendChild(card);
            });
        }

        const logoutBtn = document.getElementById('logoutAll');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                clearCurrentUser();
                window.location.href = 'index.html';
            });
        }
    }

    // PROFILE page (view/edit)
    const profileContainer = document.getElementById('profileContainer');
    if (profileContainer) {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('userId') || getCurrentUserId();
        const user = findUserById(userId);
        if (!user) {
            profileContainer.innerHTML = '<p>User not found.</p>';
            return;
        }

        function saveUpdatedUser(updatedUser) {
            const users = getUsers();
            const idx = users.findIndex(x => String(x.id) === String(updatedUser.id));
            if (idx >= 0) { users[idx] = updatedUser; saveUsers(users); }
        }

        function refreshView() {
            profileContainer.innerHTML = '';
            
            const img = document.createElement('img');
            img.src = user.profileImage || 'Logo.png';
            img.alt = 'profile';

            const name = document.createElement('h2');
            name.textContent = user.displayName || (user.firstName + ' ' + user.lastName);

            const email = document.createElement('div');
            email.textContent = user.emailOrPhone;
            email.style.color = '#737373';
            email.style.fontSize = '14px';
            email.style.marginBottom = '20px';

            const uploadLabel = document.createElement('label');
            uploadLabel.style.display = 'block';
            uploadLabel.style.marginTop = '20px';
            uploadLabel.style.marginBottom = '10px';
            uploadLabel.style.fontSize = '14px';
            uploadLabel.style.fontWeight = '600';
            uploadLabel.textContent = 'Change Profile Picture';

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.padding = '8px';
            fileInput.addEventListener('change', (e) => {
                const f = e.target.files[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = function(ev) {
                    user.profileImage = ev.target.result;
                    saveUpdatedUser(user);
                    refreshView();
                };
                reader.readAsDataURL(f);
            });

            const nameLabel = document.createElement('label');
            nameLabel.style.display = 'block';
            nameLabel.style.marginTop = '20px';
            nameLabel.style.marginBottom = '10px';
            nameLabel.style.fontSize = '14px';
            nameLabel.style.fontWeight = '600';
            nameLabel.textContent = 'Edit Display Name';

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = user.displayName || '';
            nameInput.placeholder = 'Enter your name';
            
            const saveName = document.createElement('button');
            saveName.textContent = 'Save Name';
            saveName.addEventListener('click', () => {
                if (!nameInput.value.trim()) { alert('Name cannot be empty'); return; }
                user.displayName = nameInput.value.trim();
                saveUpdatedUser(user);
                refreshView();
            });

            const back = document.createElement('button');
            back.textContent = 'Back to Accounts';
            back.addEventListener('click', () => { window.location.href = 'accounts.html'; });

            profileContainer.appendChild(img);
            profileContainer.appendChild(name);
            profileContainer.appendChild(email);
            profileContainer.appendChild(uploadLabel);
            profileContainer.appendChild(fileInput);
            profileContainer.appendChild(nameLabel);
            profileContainer.appendChild(nameInput);
            profileContainer.appendChild(saveName);
            profileContainer.appendChild(back);
        }

        refreshView();
    }
});

