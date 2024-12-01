document.addEventListener('DOMContentLoaded', function () {
  const payButton = document.getElementById('pay-button');

  // 从 sessionStorage 获取 bookingInfo
  const bookingInfo = JSON.parse(sessionStorage.getItem('bookingInfo'));

  if (!bookingInfo) {
    alert('No booking information found. Please select seats first.');
    window.location.href = 'book.html';
    return;
  }
  
    // 显示购票信息
  const { movie, seats, totalPrice } = bookingInfo;
  document.getElementById('event-confirm').textContent = `Event Name: ${movie.name}`;
  document.getElementById('date-confirm').textContent = `Date: ${movie.date} ${movie.time}`;
  document.getElementById('location-confirm').textContent = `Location: ${movie.location}`;
  document.getElementById('selectedSeat').textContent = `Seat(s): ${seats.join(', ')}`;
  document.getElementById('total-price').textContent = `$${totalPrice}`;

  payButton.addEventListener('click', () => {
    const cardNumber = document.getElementById('cardNumber').value;
    const cardExpiration = document.getElementById('cardExpiration').value;
    const cardCVV = document.getElementById('cardCVV').value;

    if (!cardNumber || !cardExpiration || !cardCVV) {
      alert('Please fill in all the fields.');
      return;
    }

    if (cardNumber.length !== 16) {
      alert('Invalid card number!');
      return;
    }

    if (cardCVV.length !== 3) {
      alert('Invalid CVV!');
      return;
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month
    const currentYear = currentDate.getFullYear();

    const expirationDate = new Date(cardExpiration + '/1'); // Appending '/1' to convert month to a complete date
    const expirationMonth = expirationDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month
    const expirationYear = expirationDate.getFullYear();

    if (expirationYear < currentYear || (expirationYear === currentYear && expirationMonth < currentMonth)) {
      alert('Card has expired!');
      return;
    }

    // 模拟支付成功
    const data = {
      status: 'success',
    };

    if (data.status === 'success') {
      alert('Payment successful!');

      // 在支付成功后，将购票信息发送到服务器
      fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingInfo),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to save booking information.');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Booking information saved:', data);
          // 清除 sessionStorage 中的 bookingInfo
          sessionStorage.removeItem('bookingInfo');
          // 跳转到确认页面或主页
          window.location.href = 'index.html';
        })
        .catch((error) => {
          console.error('Error saving booking information:', error);
          alert('Error saving booking information. Please contact support.');
        });
    }
  });
});
