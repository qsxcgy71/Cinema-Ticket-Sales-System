document.addEventListener("DOMContentLoaded", () => {
  const movieList = document.getElementById('movie-list');
  const addMovieBtn = document.getElementById('add-movie-btn');
  const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
  const movieForm = document.getElementById('movie-form');
  const filterButton = document.getElementById('filter-button');
  const searchBar = document.getElementById('search-bar');
  const posterInput = document.getElementById('movie-poster');
  const previewImage = document.getElementById('poster-preview');

  const formData = new FormData(movieForm); // 使用 FormData 来处理表单数据
  formData.append('movie-poster', posterInput.files[0]);  // 确保附加文件

  let editingMovieId = null;

  // 获取电影列表
  function fetchMovies(filters = {}) {
    let query = new URLSearchParams(filters).toString();
    fetch(`/api/movies?${query}`)
      .then(response => response.json())
      .then(data => {
        populateMovieCards(data);
      })
      .catch(error => console.error('Error:', error));
  }

  // 生成电影卡片
  function populateMovieCards(movies) {
    movieList.innerHTML = "";
    movies.forEach(movie => {
      const card = document.createElement("div");
      card.className = "col card m-auto d-flex mt-2 mb-2";
      card.style.width = "22rem";
      card.style.height = "auto";

      // 构造海报路径
      let posterPath =  getPosterPath(movie.name) || '/assets/default.png';

      // 构造卡片的html
      const tagsHtml = movie.tags.map(tag => `<span class="badge bg-secondary">${tag}</span>`).join(' ');

      card.innerHTML = `
        <img src="${posterPath}" class="card-img-top mx-auto" alt="${movie.name}" style="max-height: 300px; object-fit: cover;" />
        <div class="card-body" style="line-height: 1.5;">
          <h5 class="card-title fw-bolder mb-3">${movie.name}</h5>
          <p class="card-text mb-2">Show time: ${movie.date} ${movie.time}</p>
          <p class="card-text mb-2">Location: ${movie.location}</p>
          <p class="card-text mb-2">Normal: $${movie.prices.normal}, Premium: $${movie.prices.premium}</p>
          <div class="mb-2">
            ${tagsHtml}
          </div>
          <div class="d-flex justify-content-around">
            <button class="btn btn-primary edit-movie-btn" data-id="${movie.name}">Edit</button>
            <button class="btn btn-danger delete-movie-btn" data-id="${movie.name}">Delete</button>
          </div>
        </div>
      `;

      movieList.appendChild(card);
    });
  }

  // 根据电影名字构建海报路径
  function getPosterPath(movieName) {
    // 规范化电影名字（去掉空格并替换为下划线，统一为小写）
    const normalizedMovieName = movieName.replace(/\s+/g, '_').toLowerCase();
    
    // 定义支持的图片格式
    const imageFormats = ['webp', 'jpg', 'png'];
    
    // 尝试不同格式的图片路径
    for (let format of imageFormats) {
      const testPath = `/assets/${normalizedMovieName}.${format}`;
      //return fasle;
      return testPath;
    }
    //return false;
    // 默认返回默认海报    
  }

  // 编辑和删除电影
  movieList.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-movie-btn')) {
      const movieName = e.target.dataset.id;
      fetch(`/api/movies/${encodeURIComponent(movieName)}`)
        .then(response => response.json())
        .then(selectedMovie => {
          // 填充表单数据
          document.getElementById('movie-title').value = selectedMovie.name;
          document.getElementById('movie-date').value = selectedMovie.date;
          document.getElementById('movie-time').value = selectedMovie.time;
          document.getElementById('movie-location').value = selectedMovie.location;
          document.getElementById('movie-normal-price').value = selectedMovie.prices.normal;
          document.getElementById('movie-premium-price').value = selectedMovie.prices.premium;
          document.getElementById('movie-tags').value = selectedMovie.tags.join(', ');

          

          editingMovieId = movieName; // 设置编辑模式的标识
          document.getElementById('movieModalLabel').innerText = 'Edit';
          movieModal.show();
        })
        .catch(error => console.error('Error:', error));
    } else if (e.target.classList.contains('delete-movie-btn')) {
      const movieName = e.target.dataset.id;
      if (confirm('Are you sure you want to delete this movie?')) {
        fetch(`/api/movies/${encodeURIComponent(movieName)}`, {
          method: 'DELETE',
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to delete movie');
            }
            return response.json();
          })
          .then(() => fetchMovies())
          .catch(error => console.error('Error deleting movie:', error));
      }
    }
  });

  // 添加新电影按钮事件
  addMovieBtn.addEventListener('click', () => {
    editingMovieId = null;
    movieForm.reset();
    document.getElementById('movieModalLabel').innerText = 'Add a new movie';
    movieModal.show();
  });

  // 提交电影表单
  movieForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(movieForm); // 使用 FormData 来处理表单数据
    /*
    const newMovie = {
      name: document.getElementById('movie-title').value,
      date: document.getElementById('movie-date').value,
      time: document.getElementById('movie-time').value,
      location: document.getElementById('movie-location').value,
      prices: {
        normal: document.getElementById('movie-normal-price').value,
        premium: document.getElementById('movie-premium-price').value,
      },
      tags: document.getElementById('movie-tags').value.split(',').map(tag => tag.trim()),
    };*/

    let url = '/api/movies';
    let method = 'POST';

    if (editingMovieId) {
      url = `/api/movies/${encodeURIComponent(editingMovieId)}`;
      method = 'PUT';
    }

    fetch(url, {
      method: method,
      body: formData, // 直接发送表单数据
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save movie');
        }
        return response.json();
      })
      .then(data => {
        console.log('successfully save: ', data);
        fetchMovies();
        movieModal.hide();
      })
      .catch(error => console.error('can not save:', error));
  });/*
  // 提交电影表单
movieForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(movieForm); // 使用 FormData 来处理表单数据

  // 如果需要手动添加字段，可以使用 formData.append('fieldName', value);
  // 例如，如果您的价格字段需要特殊处理：
  // formData.append('prices[normal]', document.getElementById('movie-normal-price').value);
  // formData.append('prices[premium]', document.getElementById('movie-premium-price').value);

  let url = '/api/movies';
  let method = 'POST';

  if (editingMovieId) {
    url = `/api/movies/${encodeURIComponent(editingMovieId)}`;
    method = 'PUT';
  }

  fetch(url, {
    method: method,
    body: formData, // 直接发送表单数据
    // 不要设置 headers，浏览器会自动设置为 multipart/form-data
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save movie');
      }
      return response.json();
    })
    .then(data => {
      console.log('successfully save: ', data);
      fetchMovies();
      movieModal.hide();
    })
    .catch(error => console.error('can not save:', error));
});*/
//test
  

  // 过滤功能
  filterButton.addEventListener('click', () => {
    const filters = {
      title: document.getElementById('search-bar').value.toLowerCase().trim(),
      date: document.getElementById('search-date-start').value.trim(),
      location: document.getElementById('search-venue').value.toLowerCase().trim(),
      tag: document.getElementById('search-tag').value.toLowerCase().trim()
    };
    fetchMovies(filters);
  });

  // 实时推荐功能
  searchBar.addEventListener("input", function () {
    const query = this.value.trim();
    const suggestionsBox = document.getElementById("autocomplete-suggestions");

    if (query.length > 0) {
      fetch(`/api/search-suggestions?q=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((data) => {
          suggestionsBox.innerHTML = "";

          if (data.suggestions.length > 0) {
            suggestionsBox.style.display = "block";

            data.suggestions.forEach((item) => {
              const suggestionItem = document.createElement("div");
              suggestionItem.className = "list-group-item list-group-item-action";
              suggestionItem.textContent = item;

              suggestionItem.addEventListener("click", function () {
                searchBar.value = item;
                suggestionsBox.style.display = "none";
              });

              suggestionsBox.appendChild(suggestionItem);
            });
          } else {
            suggestionsBox.style.display = "none";
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
        });
    } else {
      suggestionsBox.style.display = "none";
    }
  });

  // 初始化获取电影列表
  fetchMovies();
});






