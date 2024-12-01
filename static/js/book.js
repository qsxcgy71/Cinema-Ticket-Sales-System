// 页面加载时动态加载电影信息
/*document.addEventListener("DOMContentLoaded", () => {
  // 从 sessionStorage 获取电影信息
  const movieData = JSON.parse(sessionStorage.getItem("selectedMovie"));

  if (movieData) {
      // 显示电影标题、时间和地点
      document.getElementById("movie-title").textContent = `Booking for: ${movieData.name}`;
      document.getElementById("movie-details").textContent = `Show time: ${movieData.time}, Location: ${movieData.location}`;

      // 设置票价选项
      const ticketTypeSelect = document.getElementById("ticket-type");
      ticketTypeSelect.options[0].textContent = `Normal - $${movieData.prices.normal}`;
      ticketTypeSelect.options[1].textContent = `Premium - $${movieData.prices.premium}`;

      // 默认票价
      let selectedPrice = movieData.prices.normal;

      // 更新总价显示
      const totalPriceDisplay = document.getElementById("price");
      const selectedSeatsDisplay = document.getElementById("selseat");
      const seats = document.querySelectorAll(".seat"); // 获取所有座位元素
      let selectedSeats = [];

      // 监听座位点击事件
      seats.forEach((seat, index) => {
          // 跳过不可选座位
          if (seat.classList.contains("unavailable")) return;

          seat.addEventListener("click", () => {
              const seatNumber = index + 1; // 假设座位号从1开始

              if (!seat.classList.contains("selected")) {
                  // 选中座位
                  seat.classList.add("selected");
                  selectedSeats.push(seatNumber);
              } else {
                  // 取消选中座位
                  seat.classList.remove("selected");
                  selectedSeats = selectedSeats.filter(num => num !== seatNumber);
              }

              // 更新显示选中的座位和总价
              updateSelectionAndPrice();
          });
      });

      // 监听票价类别选择变化
      ticketTypeSelect.addEventListener("change", (event) => {
          selectedPrice = event.target.value === "premium"
              ? movieData.prices.premium
              : movieData.prices.normal;
          updateSelectionAndPrice();
      });

      // 更新选中座位和总价的函数
      function updateSelectionAndPrice() {
          // 显示选中的座位号
          if (selectedSeats.length > 0) {
              selectedSeatsDisplay.textContent = `Selected Seats: ${selectedSeats.join(", ")}`;
          } else {
              selectedSeatsDisplay.textContent = "No seats selected.";
          }

          // 计算并显示总价
          const totalPrice = selectedSeats.length * selectedPrice;
          totalPriceDisplay.textContent = totalPrice;
      }
  } else {
      console.error("No movie data available. Redirecting to main page...");
      alert("No movie selected. Please select a movie first.");
      window.location.href = "event.html"; // 跳转回电影选择页面
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const rows = ['A', 'B', 'C', 'D']; // 行名
  const seatsPerRow = 10; // 每行座位数量
  const seatRadius = 30; // 座位半径
  const seatSpacing = 70; // 座位间距
  const rowSpacing = 100; // 行间距
  const svgContainer = document.getElementById('seatsContainer');

  const movieData = JSON.parse(sessionStorage.getItem("selectedMovie"));
  if (!movieData) {
    alert("No movie selected. Redirecting...");
    window.location.href = "event.html";
    return;
  }

  const prices = {
    premium: movieData.prices.premium,
    normal: movieData.prices.normal,
  };

  const selectedSeats = [];
  let totalPrice = 0;

  rows.forEach((row, rowIndex) => {
    const rowType = rowIndex < 2 ? 'Premium' : 'Normal';
    const rowPrice = rowIndex < 2 ? prices.premium : prices.normal;

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

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', seatRadius);
      circle.setAttribute('stroke', '#2e7d32');
      circle.setAttribute('stroke-width', 2);
      circle.setAttribute('fill', '#14A44D');
      circle.setAttribute('cursor', 'pointer');
      circle.addEventListener('click', () => toggleSeatSelection(seatId, rowType));

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', cx);
      text.setAttribute('y', cy + 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('alignment-baseline', 'central');
      text.setAttribute('class', 'seat-text');
      text.textContent = seatId;

      svgContainer.appendChild(circle);
      svgContainer.appendChild(text);
    }
  });

  function toggleSeatSelection(seatId, rowType) {
    const seatElement = Array.from(svgContainer.querySelectorAll('circle')).find(
      (circle) => circle.getAttribute('onclick')?.includes(seatId)
    );

    if (!seatElement) {
      console.error(`Seat element not found: ${seatId}`);
      return;
    }

    if (selectedSeats.includes(seatId)) {
      selectedSeats.splice(selectedSeats.indexOf(seatId), 1);
      seatElement.setAttribute('fill', '#14A44D');
      totalPrice -= rowType === 'Premium' ? prices.premium : prices.normal;
    } else {
      selectedSeats.push(seatId);
      seatElement.setAttribute('fill', '#FFD700');
      totalPrice += rowType === 'Premium' ? prices.premium : prices.normal;
    }

    updateSelectionAndPrice();
  }

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
});*/
document.addEventListener("DOMContentLoaded", () => {
  // 从 sessionStorage 获取电影信息
  const movieData = JSON.parse(sessionStorage.getItem("selectedMovie"));

  if (!movieData) {
    console.error("No movie data available. Redirecting to main page...");
    alert("No movie selected. Please select a movie first.");
    window.location.href = "event.html"; // 跳转回电影选择页面
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

  // 动态加载座位图
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

      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('id', seatId); // 添加 id 属性
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', seatRadius);
      circle.setAttribute('stroke', '#2e7d32');
      circle.setAttribute('stroke-width', 2);
      circle.setAttribute('fill', '#14A44D');
      circle.setAttribute('cursor', 'pointer');
      circle.addEventListener('click', () => toggleSeatSelection(seatId, rowType, rowPrice));
      //circle.addEventListener('click', () => toggleSeatSelection(seatId, rowType, seatPrice));
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', cx);
      text.setAttribute('y', cy + 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('alignment-baseline', 'central');
      text.setAttribute('class', 'seat-text');
      text.textContent = seatId;

      svgContainer.appendChild(circle);
      svgContainer.appendChild(text);
    }
  });

  // 处理座位点击选择
  function toggleSeatSelection(seatId, rowType, seatPrice) {
    const seatElement = Array.from(svgContainer.querySelectorAll('circle')).find(
      //(circle) => circle.getAttribute('cx') && circle.getAttribute('cy')
      (circle) => circle.getAttribute('id') === seatId
    );

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
     // 强制重新渲染
    
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
});
