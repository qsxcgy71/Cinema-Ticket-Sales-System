// userManagement.js

document.addEventListener('DOMContentLoaded', function () {
    // 检查用户是否已登录并且是管理员
    //checkAdminAccess();
  
    // 加载用户列表
    loadUsers();
  
    // 处理编辑用户表单提交
    const editUserForm = document.getElementById('editUserForm');
    editUserForm.addEventListener('submit', function (e) {
      e.preventDefault();
      submitEditUserForm();
    });
  });
  
  // 检查管理员权限
  function checkAdminAccess() {
    fetch('/auth/check', { // 确保后端有 /auth/check 路由
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success' && data.user.role === 'admin') {
          // 有权限
        } else {
          alert('Unauthorized access');
          window.location.href = 'login.html'; // 重定向到登录页面
        }
      })
      .catch(error => {
        console.error('Error checking admin access:', error);
        window.location.href = 'login.html';
      });
  }
  
  // 获取并加载所有用户
  function loadUsers() {
    fetch('/api/admin/users') // 确保后端有此路由
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          populateUsersTable(data.users);
        } else {
          alert('Failed to load users');
        }
      })
      .catch(error => {
        console.error('Error loading users:', error);
      });
  }
  
  // 填充用户列表表格
  function populateUsersTable(users) {
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = ''; // 清空表格
  
    users.forEach(user => {
      const tr = document.createElement('tr');
  
      const tdUsername = document.createElement('td');
      tdUsername.textContent = user.username;
  
      const tdEmail = document.createElement('td');
      tdEmail.textContent = user.email;
  
      const tdBirthdate = document.createElement('td');
      const birthdate = new Date(user.birthdate);
      tdBirthdate.textContent = birthdate.toLocaleDateString();
  
      const tdGender = document.createElement('td');
      tdGender.textContent = user.gender;
  
      const tdNickname = document.createElement('td');
      tdNickname.textContent = user.nickname;
  
      const tdEnabled = document.createElement('td');
      tdEnabled.textContent = user.enabled ? 'True' : 'False';
  
      const tdRole = document.createElement('td');
      tdRole.textContent = user.role;
  
      const tdCreatedAt = document.createElement('td');
      const createdAt = new Date(user.createdAt);
      tdCreatedAt.textContent = createdAt.toLocaleString();
  
      const tdActions = document.createElement('td');
  
      // 编辑按钮
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('btn', 'btn-sm', 'btn-primary', 'me-2');
      editButton.addEventListener('click', () => openEditModal(user));
  
      // 删除按钮
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
      deleteButton.addEventListener('click', () => deleteUser(user._id));
  
      tdActions.appendChild(editButton);
      tdActions.appendChild(deleteButton);
  
      tr.appendChild(tdUsername);
      tr.appendChild(tdEmail);
      tr.appendChild(tdBirthdate);
      tr.appendChild(tdGender);
      tr.appendChild(tdNickname);
      tr.appendChild(tdEnabled);
      tr.appendChild(tdRole);
      tr.appendChild(tdCreatedAt);
      tr.appendChild(tdActions);
  
      tbody.appendChild(tr);
    });
  }
  
  // 打开编辑用户模态框
  function openEditModal(user) {
    const editUserId = document.getElementById('editUserId');
    const editUsername = document.getElementById('editUsername');
    const editEmail = document.getElementById('editEmail');
    const editBirthdate = document.getElementById('editBirthdate');
    const editGender = document.getElementById('editGender');
    const editNickname = document.getElementById('editNickname');
    const editEnabled = document.getElementById('editEnabled');
  
    editUserId.value = user._id;
    editUsername.value = user.username;
    editEmail.value = user.email;
    editBirthdate.value = user.birthdate.split('T')[0]; // 转换为 yyyy-mm-dd
    editGender.value = user.gender;
    editNickname.value = user.nickname;
    editEnabled.value = user.enabled ? 'true' : 'false';
  
    const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    editUserModal.show();
  }
  
  // 提交编辑用户表单
  function submitEditUserForm() {
    const userId = document.getElementById('editUserId').value;
    const updatedUser = {
      username: document.getElementById('editUsername').value,
      email: document.getElementById('editEmail').value,
      birthdate: document.getElementById('editBirthdate').value,
      gender: document.getElementById('editGender').value,
      nickname: document.getElementById('editNickname').value,
      enabled: document.getElementById('editEnabled').value === 'true',
      // 如果需要修改角色，可以添加此字段
      // role: document.getElementById('editRole').value,
    };
  
    fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert('User updated successfully');
          // 关闭模态框
          const editUserModalElement = document.getElementById('editUserModal');
          const editUserModal = bootstrap.Modal.getInstance(editUserModalElement);
          editUserModal.hide();
          // 重新加载用户列表
          loadUsers();
        } else {
          alert('Failed to update user');
        }
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
  }
  
  // 删除用户
  function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
      fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            alert('User deleted successfully');
            // 重新加载用户列表
            loadUsers();
          } else {
            alert('Failed to delete user');
          }
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
  }
  