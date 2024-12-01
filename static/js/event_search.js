//前端
// 实时推荐功能
console.log("event_search.js loaded successfully");
document.getElementById("search-bar").addEventListener("input", function () {
  const query = this.value.trim();
  const suggestionsBox = document.getElementById("autocomplete-suggestions");

  if (query.length > 0) {
    // 在输入时打印调试信息
    console.log("Input query:", query);

    fetch(`http://localhost:3000/search-suggestions?q=${encodeURIComponent(query)}`)
      .then((response) => {
        // 在收到响应时打印响应状态
        console.log("Fetch response status:", response.status);

        // 检查响应是否成功
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // 在接收到 JSON 数据时打印调试信息
        console.log("Received suggestions:", data.suggestions);

        // 清空当前的自动补全建议
        suggestionsBox.innerHTML = "";

        if (data.suggestions.length > 0) {
          // 显示自动补全建议框
          suggestionsBox.style.display = "block";

          // 为每个建议创建 DOM 元素
          data.suggestions.forEach((item) => {
            const suggestionItem = document.createElement("div");
            suggestionItem.className = "list-group-item list-group-item-action";
            suggestionItem.textContent = item;

            // 点击事件：填充搜索框并隐藏建议框
            suggestionItem.addEventListener("click", function () {
              console.log("Suggestion clicked:", item);
              document.getElementById("search-bar").value = item;
              suggestionsBox.style.display = "none";
              /*filterEvents(); // 自动触发过滤功能*/
            });

            // 将建议项插入建议框
            suggestionsBox.appendChild(suggestionItem);
          });
        } else {
          // 如果没有建议，隐藏建议框
          suggestionsBox.style.display = "none";
        }
      })
      .catch((err) => {
        // 捕获 fetch 或 JSON 解析的错误
        console.error("Fetch error:", err);
      });
  } else {
    // 如果输入为空，隐藏建议框
    suggestionsBox.style.display = "none";
  }
});

  
 // 过滤功能
    document.getElementById("filter-button").addEventListener("click", () => {
      console.log("Filter button clicked");
      filterEvents();
    }); 
        function filterEvents() {
          const title = document.getElementById("search-bar").value.toLowerCase().trim();
          const dateInput = document.getElementById("search-date-start").value.trim();
          const venue = document.getElementById("search-venue").value.toLowerCase().trim();
          const tag = document.getElementById("search-tag").value.toLowerCase().trim(); // 获取标签输入
      
          const cards = document.querySelectorAll(".card");
      
          console.log("Title Input:", title);
          console.log("Date Input:", dateInput);
          console.log("Venue Input:", venue);
          console.log("Tag Input:", tag);
      
          // 如果所有输入框为空，显示所有卡片
          if (!title && !dateInput && !venue && !tag) {
              console.log("No input provided. Showing all cards.");
              cards.forEach(card => card.classList.remove("hidden"));
              return;
          }
      
          cards.forEach(card => {
              const cardTitle = card.querySelector(".card-title").textContent.toLowerCase();
              const cardDateMatch = card.querySelector(".card-text").textContent.match(/\d{2}\/\d{2}\/\d{4}/);
              const cardDate = cardDateMatch ? cardDateMatch[0] : null;
              const cardVenue = card.querySelector(".card-text:nth-child(3)").textContent.toLowerCase();
              const cardTags = Array.from(card.querySelectorAll(".badge")).map(badge => badge.textContent.toLowerCase()); // 获取所有标签
      
              // 匹配条件
              const matchesTitle = title ? cardTitle.includes(title) : false;
              const matchesDate = dateInput && cardDate
                  ? new Date(cardDate.split('/').reverse().join('-')).toDateString() === new Date(dateInput).toDateString()
                  : false;
              const matchesVenue = venue ? cardVenue.includes(venue) : false;
              const matchesTag = tag ? cardTags.some(tagItem => tagItem.includes(tag)) : false; // 检查标签是否匹配
      
              console.log({
                  cardTitle,
                  cardDate,
                  cardVenue,
                  cardTags,
                  matchesTitle,
                  matchesDate,
                  matchesVenue,
                  matchesTag
              });
      
              // 如果任意条件匹配，则显示卡片；否则隐藏
              if (matchesTitle || matchesDate || matchesVenue || matchesTag) {
                  card.classList.remove("hidden");
              } else {
                  card.classList.add("hidden");
              }
          });
      }
//存储电影数据
document.addEventListener("DOMContentLoaded", () => {
  const buyTicketButtons = document.querySelectorAll(".buy-ticket-btn");

  buyTicketButtons.forEach(button => {
      button.addEventListener("click", (event) => {
          event.preventDefault(); // 阻止默认跳转

          const movieName = button.getAttribute("data-movie");
          const movieTime = button.getAttribute("data-time");
          const movieLocation = button.getAttribute("data-location");
          const normalPrice = button.getAttribute("data-price-normal");
          const premiumPrice = button.getAttribute("data-price-premium");

          // 存储电影信息到 sessionStorage
          sessionStorage.setItem("selectedMovie", JSON.stringify({
              name: movieName,
              time: movieTime,
              location: movieLocation,
              prices: {
                  normal: normalPrice,
                  premium: premiumPrice
              }
          }));

          console.log("Stored movie data:", sessionStorage.getItem("selectedMovie"));

          // 跳转到 book.html
          window.location.href = button.href;
      });
  });
});

//动态加载电影卡片信息
document.addEventListener("DOMContentLoaded", () => {
  fetch("movies.json")
      .then(response => response.json())
      .then(data => {
          populateMovieCards(data);
      })
      .catch(error => console.error("Error loading movie data:", error));
});

function populateMovieCards(movies) {
  const eventMenu = document.getElementById("event-menu");
  eventMenu.innerHTML = ""; // 清空卡片容器

  movies.forEach(movie => {
      const card = document.createElement("div");
      card.className = "col card m-auto d-flex mt-2 mb-2";
      card.style.width = "22rem";
      card.style.height = "auto";

      card.innerHTML = `
          <img src="assets/${movie.name}.webp" class="card-img-top mx-auto" alt="${movie.name}" style="max-height: 300px; object-fit: cover;" />
          <div class="card-body" style="line-height: 1.5;">
              <h5 class="card-title fw-bolder mb-3">${movie.name}</h5>
              <p class="card-text mb-2">Show time: ${movie.time}</p>
              <p class="card-text mb-2">Location: ${movie.location}</p>
              <p class="card-text mb-2">Normal: $${movie.prices.normal}, Premium: $${movie.prices.premium}</p>
              <a class="btn btn-success buy-ticket-btn d-block mx-auto"
                 data-movie="${movie.name}"
                 data-time="${movie.time}"
                 data-location="${movie.location}"
                 data-price-normal="${movie.prices.normal}"
                 data-price-premium="${movie.prices.premium}"
                 href="book.html"
                 style="width: 50%;">Buy Ticket</a>
          </div>
      `;

      eventMenu.appendChild(card);
  });

  bindBuyTicketButtons(); // 为生成的按钮绑定事件
}

function bindBuyTicketButtons() {
  const buyTicketButtons = document.querySelectorAll(".buy-ticket-btn");

  buyTicketButtons.forEach(button => {
      button.addEventListener("click", (event) => {
          event.preventDefault();

          const movieName = button.getAttribute("data-movie");
          const movieTime = button.getAttribute("data-time");
          const movieLocation = button.getAttribute("data-location");
          const normalPrice = button.getAttribute("data-price-normal");
          const premiumPrice = button.getAttribute("data-price-premium");

          sessionStorage.setItem("selectedMovie", JSON.stringify({
              name: movieName,
              time: movieTime,
              location: movieLocation,
              prices: {
                  normal: normalPrice,
                  premium: premiumPrice
              }
          }));
          console.log("Stored movie data:", sessionStorage.getItem("selectedMovie"));
          window.location.href = button.href;
      });
  });
}
 