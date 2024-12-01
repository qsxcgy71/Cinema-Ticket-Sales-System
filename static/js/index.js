document.addEventListener('DOMContentLoaded', () => {
  fetch('/auth/me')
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('API request failed');
      }
    })
    .then((data) => {
      console.log(data);
      const greeting = document.getElementById('greeting');
      greeting.textContent = `${data.user.username} (${data.user.role})`;

      // 如果用户是管理员，则显示 Admin 按钮
      if (data.user.role === 'admin') {
        const adminButtons = document.getElementById('admin-buttons');
        adminButtons.classList.remove('d-none'); // 使按钮可见
      }
    })
    .catch((error) => {
      console.error("User is not logged in:", error);
      alert('Please login');
      sessionStorage.clear(); // 清除本地 sessionStorage
      window.open('/login.html', '_self'); // 重定向到登录页面
    });

  const logout = document.getElementById('logout-button');
  logout.addEventListener('click', async () => {
    const confirm = window.confirm('Confirm to logout?');
  
    if (confirm) {
      try {
        const response = await fetch('/auth/logout', { method: 'POST' });
  
        if (response.ok) {
          sessionStorage.clear(); // 清除本地 sessionStorage
          alert('You have been logged out.');
          window.location.href = '/login.html'; // 跳转到登录页面
        } else {
          alert('Failed to logout. Please try again.');
        }
      } catch (error) {
        console.error(error);
      }
    }
  });
  
});
