document.addEventListener("DOMContentLoaded", () => {
  // 从 sessionStorage 获取电影信息
  const movieData = JSON.parse(sessionStorage.getItem("selectedMovie"));

  if (!movieData) {
    // 处理没有电影信息的情况
    // ...
    return;
  }

  // 显示电影标题、时间和地点
  document.getElementById("movie-title").textContent = `Booking for: ${movieData.name}`;
  document.getElementById("movie-details").textContent = `Show time: ${movieData.time}, Location: ${movieData.location}`;

  // 定义票价
  const prices = {
    premium: movieData.prices.premium,
    normal: movieData.prices.normal,
  };

  const rows = ['A', 'B', 'C', 'D']; // 行名
  const seatsPerRow = 10; // 每行座位数量
  const seatRadius = 30; // 座位半径
  const seatSpacing = 70; // 座位间距
  const rowSpacing = 100; // 行间距
  const svgContainer = document.getElementById('seatsContainer');

  const selectedSeats = [];
  let totalPrice = 0;

  let seatStatus = {};

  // 获取座位状态
  fetch(`/api/seats/${encodeURIComponent(movieData.location)}`)
    .then(response => response.json())
    .then(data => {
      seatStatus = data.seats || {};
      generateSeats();
    })
    .catch(error => {
      console.error('Error fetching seat data:', error);
      generateSeats(); // 无法获取数据时，生成默认座位图
    });

  function generateSeats() {
    rows.forEach((row, rowIndex) => {
      const rowType = rowIndex < 2 ? 'Premium' : 'Normal'; // Premium: A/B, Normal: C/D
      const rowPrice = rowType === 'Premium' ? prices.premium : prices.normal;

      // 添加行类型和价格标签
      const rowLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      rowLabel.setAttribute('x', 10);
      rowLabel.setAttribute('y', rowSpacing * (rowIndex + 1) - 50);
      rowLabel.setAttribute('fill', '#ffd600');
      rowLabel.setAttribute('font-size', '16');
      rowLabel.textContent = `${rowType} ($${rowPrice})`;
      svgContainer.appendChild(rowLabel);

      for (let seatIndex = 1; seatIndex <= seatsPerRow; seatIndex++) {
        const seatId = `${row}${seatIndex}`;
        const cx = seatSpacing * seatIndex;
        const cy = rowSpacing * (rowIndex + 1);

        const seatAvailable = seatStatus[seatId] !== false; // 默认可用

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('id', seatId);
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', seatRadius);
        circle.setAttribute('stroke', '#2e7d32');
        circle.setAttribute('stroke-width', 2);
        circle.setAttribute('fill', seatAvailable ? '#14A44D' : '#8E8E8E');
        circle.setAttribute('cursor', seatAvailable ? 'pointer' : 'not-allowed');
        if (seatAvailable) {
          circle.addEventListener('click', () => toggleSeatSelection(seatId, rowType, rowPrice));
        }

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', cx);
        text.setAttribute('y', cy + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('alignment-baseline', 'central');
        text.setAttribute('fill', seatAvailable ? '#ffd600' : '#000000');
        text.textContent = seatId;

        svgContainer.appendChild(circle);
        svgContainer.appendChild(text);
      }
    });
  }

  // 处理座位点击选择
  function toggleSeatSelection(seatId, rowType, seatPrice) {
    const seatElement = svgContainer.querySelector(`circle[id='${seatId}']`);

    if (!seatElement) {
      console.error(`Seat element not found: ${seatId}`);
      return;
    }

    if (selectedSeats.includes(seatId)) {
      selectedSeats.splice(selectedSeats.indexOf(seatId), 1);
      seatElement.setAttribute('fill', '#14A44D'); // 恢复原色
      totalPrice -= parseFloat(seatPrice); // 减去该座位价格
    } else {
      selectedSeats.push(seatId);
      seatElement.setAttribute('fill', '#FFD700'); // 选中变色
      totalPrice += parseFloat(seatPrice); // 增加该座位价格
    }

    updateSelectionAndPrice();
  }

  // 更新选中座位和总价显示
  function updateSelectionAndPrice() {
    const selectedSeatsDisplay = document.getElementById('selected-seats');
    const totalPriceDisplay = document.getElementById('price');

    if (selectedSeats.length > 0) {
      selectedSeatsDisplay.textContent = `Selected Seats: ${selectedSeats.join(', ')}`;
    } else {
      selectedSeatsDisplay.textContent = 'No seats selected.';
    }

    totalPriceDisplay.textContent = totalPrice;
  }

  // 获取提交按钮
  const submitBtn = document.getElementById('submit-btn');

  // 提交按钮点击事件
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (selectedSeats.length === 0) {
      alert('Please select at least one seat before proceeding to payment.');
      return;
    }

    // 将选定的座位、总价和电影信息保存到 sessionStorage
    const bookingInfo = {
      movie: movieData,
      seats: selectedSeats,
      totalPrice: totalPrice,
    };

    sessionStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));

    // 跳转到 payment.html
    window.location.href = 'payment.html';
  });

  // 重置按钮
  document.getElementById("reset-btn").addEventListener("click", (event) => {
    event.preventDefault(); // 阻止默认的重置行为
    window.location.reload(); // 刷新页面
  });
});
