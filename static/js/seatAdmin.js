document.addEventListener("DOMContentLoaded", () => {
  const cinemaSelect = document.getElementById('cinema-select');
  const svgContainer = document.getElementById('seatsContainer');
  const submitBtn = document.getElementById('submit-btn');
  let seatStatus = {}; // 保存座位状态
  let selectedCinema = '';

  cinemaSelect.addEventListener('change', () => {
    selectedCinema = cinemaSelect.value;
    svgContainer.innerHTML = ''; // 清空座位图
    seatStatus = {};
    if (selectedCinema === '') {
      submitBtn.style.display = 'none';
      return;
    }
    submitBtn.style.display = 'block';
    // 获取座位状态
    fetch(`/api/seats/${selectedCinema}`)
      .then(response => response.json())
      .then(data => {
        seatStatus = data.seats || {};
        generateSeats();
      })
      .catch(error => {
        console.error('Error fetching seat data:', error);
        generateSeats(); // 无法获取数据时，生成默认座位图
      });
  });

  function generateSeats() {
    const rows = ['A', 'B', 'C', 'D']; // 行名
    const seatsPerRow = 10; // 每行座位数量
    const seatRadius = 30; // 座位半径
    const seatSpacing = 70; // 座位间距
    const rowSpacing = 100; // 行间距

    rows.forEach((row, rowIndex) => {
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
        circle.setAttribute('cursor', 'pointer');
        circle.addEventListener('click', () => toggleSeatAvailability(seatId));

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

  function toggleSeatAvailability(seatId) {
    // 切换座位可用状态
    seatStatus[seatId] = seatStatus[seatId] === false ? true : false;

    // 更新座位颜色
    const circle = svgContainer.querySelector(`circle[id='${seatId}']`);
    const text = svgContainer.querySelector(`text[x='${circle.getAttribute('cx')}']`);

    if (seatStatus[seatId]) {
      circle.setAttribute('fill', '#14A44D');
      text.setAttribute('fill', '#ffd600');
    } else {
      circle.setAttribute('fill', '#8E8E8E');
      text.setAttribute('fill', '#000000');
    }
  }

  submitBtn.addEventListener('click', () => {
    // 将更新后的座位状态发送到服务器
    fetch(`/api/seats/${selectedCinema}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ seats: seatStatus }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save seat availability data.');
        }
        alert('Seat availability updated successfully.');
      })
      .catch(error => {
        console.error('Error saving seat data:', error);
        alert('Error saving seat availability. Please try again.');
      });
      window.location.href = 'index.html';
  });
  // 重置按钮
  document.getElementById("reset-btn").addEventListener("click", (event) => {
    event.preventDefault(); // 阻止默认的重置行为
    window.location.reload(); // 刷新页面
  });
});
