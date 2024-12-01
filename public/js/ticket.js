/*document.addEventListener('DOMContentLoaded', function () {
  // 从 sessionStorage 获取 bookingInfo
  const bookingInfo = JSON.parse(sessionStorage.getItem('bookingInfo'));

  if (!bookingInfo) {
    alert('No booking information found. Please select seats first.');
    window.location.href = 'book.html';
    return;
  }

  // 显示购票信息
  const { movie, seats, totalPrice } = bookingInfo;
  document.getElementById('event-info').textContent = `Movie: ${movie.name} (${movie.time})`;
  document.getElementById('selectedSeat').textContent = `Seat(s): ${seats.join(', ')}`;
  document.getElementById('total-price').textContent = `Total Price: $${totalPrice}`;

  // 生成二维码
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=movie:${movie.name}|seats:${seats.join(', ')}&size=200x200`;
  document.getElementById('qr-code').src = qrCodeUrl;

  // 购买爆米花
  document.getElementById('popcorn').addEventListener('click', () => {
    alert('You have added Popcorn to your order!');
  });

  // 购买可乐
  document.getElementById('soda').addEventListener('click', () => {
    alert('You have added Soda to your order!');
  });

  // 添加一个按钮，供用户返回主页并清除 bookingInfo
  document.getElementById('finish-button').addEventListener('click', () => {
    // 清除 bookingInfo
    sessionStorage.removeItem('bookingInfo');
    // 跳转到主页
    window.location.href = 'index.html';
  });  
});*/



document.addEventListener('DOMContentLoaded', function () {
  // 从 sessionStorage 获取 bookingInfo
  const bookingInfo = JSON.parse(sessionStorage.getItem('bookingInfo'));

  if (!bookingInfo) {
    alert('No booking information found. Please select seats first.');
    window.location.href = 'book.html';
    return;
  }

  // 显示购票信息
  const { movie, seats, totalPrice } = bookingInfo;
  document.getElementById('event-info').textContent = `Movie: ${movie.name} (${movie.time}) at ${movie.location}`;
  document.getElementById('selectedSeat').textContent = `Seat(s): ${seats.join(', ')}`;
  document.getElementById('total-price').textContent = `Total Price: $${totalPrice}`;

  // 生成二维码
  const qrCodeData = `Movie: ${movie.name}, Seats: ${seats.join(', ')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeData)}&size=200x200`;
  document.getElementById('qr-code').src = qrCodeUrl;

  // 购买爆米花
  document.getElementById('popcorn').addEventListener('click', () => {
    alert('You have added Popcorn to your order!');
  });

  // 购买可乐
  document.getElementById('soda').addEventListener('click', () => {
    alert('You have added Soda to your order!');
  });

  // 完成按钮，返回主页并清除 bookingInfo
  document.getElementById('finish-button').addEventListener('click', () => {
    // 清除 bookingInfo
    sessionStorage.removeItem('bookingInfo');
    // 跳转到主页
    window.location.href = 'event.html';
  });

  // 自动触发模态框的显示
  const modalTrigger = document.getElementById('modalTrigger');
  modalTrigger.click();
});

