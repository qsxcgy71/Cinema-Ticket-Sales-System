async function update(event) {
  // Prevent the default form submission behavior
  event.preventDefault();
  console.log('hi');

  const usersArray = [];
  const cards = document.getElementsByClassName('card-body');
  const formData = new FormData();

  for (let i = 0; i < cards.length; i++) {
    const user = {};
    const movieName = cards[i].getElementsByClassName('form-control me-2')[0].value;
    const category = cards[i].getElementsByClassName('form-control')[1].value;
    const imageInput = cards[i].getElementsByClassName('upload-btn')[0];
    const image = imageInput.files[0];
    const description = cards[i].getElementsByClassName('description-class')[0].value;
    console.log('description');
    console.log(description);
    user.movieName = movieName;
    user.category = category;
    user.image = image ? image.name : ''; // Store the image name
    user.description = description;
    // Append the image file if exists, otherwise append an empty file
    formData.append('movieImage', image || new File([], 'empty'));
    // console.log('use.description');
    // console.log(user.description);
    const showtimes = cards[i].getElementsByClassName('showtime mb-2');
    let times_ = [];
    for (let j = 0; j < showtimes.length; j++) {
      const time_ = {};
      const showtime = showtimes[j].getElementsByClassName('form-control mb-2');

      time_.startTime = showtime[0].value;
      time_.endTime = showtime[1].value;
      time_.date = showtime[2].value;
      time_.location = showtime[3].value;
      time_.price = showtime[4].value;
      times_.push(time_);
    }
    user.showtimes = times_;

    usersArray.push(user);
  }
  // console.log(usersArray);
  formData.append('users', JSON.stringify(usersArray));
  // console.log('usersArray:', formData);
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  try {
    const response = await fetch('/admin-movies/movies', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (response.ok && data.status === 'success') {
      alert('Successfully updated');
    } else {
      alert('Failed');
    }
  } catch (error) {
    alert('An error occurred. Please try again.');
  }
}
