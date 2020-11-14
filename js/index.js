let addMovieForm = document.getElementById("movie-form");
let urlFetch = "https://striveschool-api.herokuapp.com/api/movies/";
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmFlNmE4ODA1NzIzZTAwMTdjMTVlZTgiLCJpYXQiOjE2MDUyNjYwNTcsImV4cCI6MTYwNjQ3NTY1N30.Th9i5aVEtcmk9VwbK2P7Euv0lHUQLle7waDLoZaf--A";
let movieTable = document.getElementById("movie-table");
let cart = [];
let sort = false;
let currentId = "";
let addNewBtn = document.getElementById("add-new");
let spinner = document.querySelector(".spinner-container");
let cartContainer = document.getElementById("cart-container");
let movies = [];
let nameInput = document.getElementById("movie-name-input");
let categoryInput = document.getElementById("movie-category-input");
let descriptionInput = document.getElementById("movie-description-input");
let imageInput = document.getElementById("movie-image-input");
let containerGeneral = document.getElementById("movies-card-display");


//REST

//GET
//I fetch the products sending an async/await request
const fetchCategories = async (movie_id = "") => {
  const response = await fetch(urlFetch + movie_id, {
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    }),
  });
  let data = await response.json();
  return data;
};
const fetchMovies = async (cateogory_id) => {
  const response = await fetch(urlFetch + cateogory_id, {
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    }),
  });
  let data = await response.json();
  return data;
};

//DELETE
//I fetch the products sending an async/await request
const deleteMovie = async (movie_id = "") => {
  const response = await fetch(urlFetch + movie_id, {
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    }),
  });
  let data = await response.json();
  return data;
};

///BACKOFFICE PAGE
//Handle submit new movie
const handleSubmitMovie = async (e) => {
  e.preventDefault();
  let spinner = document.querySelector(".spinner-border ");
  spinner.classList.toggle("d-none");
  let id = (currentId = null ? "" : currentId);
  let name = nameInput.value;
  let category = categoryInput.value;
  let description = descriptionInput.value;
  let imageUrl = imageInput.value;

  let newMovie = {
    name,
    category,
    description,
    imageUrl,
  };
  console.log(currentId);
  let methodRequest;
  if (currentId === null) {
    id = "";
  }
  try {
    let response = await fetch(urlFetch + id, {
      body: JSON.stringify(newMovie),
      method: currentId === null ? "POST" : "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
    });
    clearFieldsAddMovie();
    currentId = null;

    if (response.ok) {
      console.log(response);
      id == ""
        ? alert("Movie Added Successfully")
        : alert("Movie Edited Successfully");
      spinner.classList.toggle("d-none");
      window.location.href = "backoffice.html";
    } else {
      alert("Something went wrong!");
    }
  } catch (err) {
    console.log(err);
  }
};

const clearFieldsAddMovie = () => {
  nameInput.value = "";
  categoryInput.value = "";
  descriptionInput.value = "";
  imageInput.value = "";
};

//find movie by ID
const findMovieById = (id) => {
  console.log(movies);
  return movies.find((movie) => movie._id == id);
};
//handle Edit Product
const openEditModal = async (id) => {
  spinner.classList.remove("d-none");
  let title = document.getElementById("addMovieModalLabel");
  title.innerHTML = "Edit Movie";

  $("#addMovieModal").modal("show");
  currentId = id;
  let movie = findMovieById(id);
  console.log(movie);

  nameInput.value = movie.name;
  categoryInput.value = movie.category;
  descriptionInput.value = movie.description;
  imageInput.value = movie.imageUrl;
  spinner.classList.add("d-none");
};

//I render the table with all the products by creating and then appending to the table as many 'tr' with prod details as the # of products.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <th scope="row">${movie._id.substring(0, 5)}</th>
        <td>${movie.name}</td>
        <td>${movie.category}</td>
       <td>${movie.description.substring(0, 30)}</td>
        <td>${movie.createdAt}</td>
        <td>${movie.updatedAt}</td>
        <td><i class="fas fa-eye" onclick=' openPreviewModal(${JSON.stringify(
          movie._id
        )})')'></i>
        <i class="fas fa-edit" onclick=' openEditModal(${JSON.stringify(
          movie._id
        )})')'></i></a>
        <i class="fas fa-trash-alt" id='${movie._id}'></i></td>
        `;

    movieTable.append(tr);
  });
};

//FILTER BY NAME/BRAND/PRICE

//with this function I cler the table so that it's ready to display other data
const clearTable = () => {
  return movieTable.querySelectorAll("*").forEach((node) => node.remove());
};

const filterByFunc = (e) => {
  let dropdownMenuBtn = document.querySelector("#dropdownMenuButton");
  filterBy = e.target.name;
  dropdownMenuBtn.innerHTML = e.target.text;
};
const filterMovies = (movies) => {
  let dropdownItem = document.querySelectorAll(".dropdown-item");
  // let searchBtn = document.getElementById('search-btn')
  let searchInput = document.getElementById("search-input");

  dropdownItem.forEach((item) =>
    item.addEventListener("click", (e) => {
      filterByFunc(e);
      if (filterBy != "") {
        searchInput.classList.remove("d-none");
        searchInput.placeholder = `Filter by ${e.target.text}`;
      } else {
        searchInput.classList.add("d-none");
      }
    })
  );

  searchInput.addEventListener("keyup", (e) => {
    let filteredMovies = movies.filter((movie) =>
      movie[filterBy].toLowerCase().includes(e.target.value.toLowerCase())
    );

    //clear table
    clearTable();
    //re-render table
    renderMovies(filteredMovies);
  });
};

//SORT THE TABLE BY NAME (ASC OR DESC)
const sortMovies = (movies) => {
  let icons = document.querySelectorAll(".fa-sort");
  icons.forEach((sortIcon) => {
    let criteria = sortIcon.getAttribute("criteria");
    sortIcon.style.cursor = "pointer";
    sortIcon.addEventListener("click", () => {
      let sortedMovies = [];

      switch (sort) {
        case false:
          sortedMovies = movies.sort((movie1, movie2) =>
            movie1[criteria].localeCompare(movie2[criteria])
          );
          sort = "cres";
          break;
        case "cres":
          sortedMovies = movies.sort((movie1, movie2) =>
            movie2[criteria].localeCompare(movie1[criteria])
          );
          sort = "decr";
          break;
        case "decr":
          ssortedMovies = movies.sort(
            (movie1, movie2) => movie1._id - movie2._id
          );
          sort = false;
          break;
      }

      //clear table
      clearTable();
      //render sorted users
      renderMovies(sortedMovies);
    });
  });
};

const handleDelete = async () => {
  let deleteIcons = document.querySelectorAll(".fa-trash-alt");
  deleteIcons.forEach((deleteIcon) => {
    let id = deleteIcon.getAttribute("id");
    console.log(id);
    deleteIcon.addEventListener("click", async () => {
      var result = await confirm(
        "Are you sure you want to delete this product?"
      );
      if (result) {
        // deleteProduct(id).then((res) => {
        //   window.location.href = "backoffice.html";
        // });
        await deleteMovie(id);
        window.location.href = "backoffice.html";
      }
    });
  });
};
//INDEX PAGE FUNCITONS

const displayMovies = (titleRow = "", filter = "", movies, quatity = 0) => {

  let row = document.createElement('div')
  row.classList.add('row', 'my-5','d-flex','flex-column','row-card-movies')
  let h4 = document.createElement('h4')
  row.appendChild(h4);
  let containerCards = document.createElement('div')
  containerCards.classList.add('movies-card-container', 'row', 'mt-4')
  h4.innerHTML = titleRow
  row.appendChild(containerCards)

  if (quatity != 0) {
    movies = movies.splice(0, quatity);
  }
  if (filter != "") {
    movies = movies.filter(movie=>movie.category.toLowerCase().includes(filter.toLowerCase()))
  }
  movies.forEach((movie) => {
    let div = document.createElement("div");
    let classes = ["col-4", "col-md-3", "col-lg-2"];
    div.classList.add(...classes);
    div.innerHTML = `<div class="card">
   
       <div class="cardImg" onclick=' openPreviewModal(${JSON.stringify(
         movie._id
       )})')'>
                    
      <img class="card-img-top" src="${
        movie.imageUrl
      }" alt="Card image cap"></div>
                    <div class="card-body">
                        <h6 class="card-title ellipsis">${movie.name}</h6>
                         <p class="card-title ellipsis">${movie.description}</p>
                          <h6 class="card-title ellipsis">${movie.category}</h6>


                        <div class="card-details d-flex justify-content-between align-items-start">
        
                    </div>`;
    containerCards.append(div);
  });
  containerGeneral.appendChild(row)
};

const displayTvShow = () => {
    containerGeneral.querySelectorAll('*').forEach(node=>node.remove());
   displayMovies("TV-Shows", "shows", movies);

}

const displayHome = () => {
      containerGeneral.querySelectorAll("*").forEach((node) => node.remove());

   displayMovies("Top Movies", "", movies);
   displayMovies("Romantic", "romantic", movies);
   displayMovies("Dramas", "drama", movies);
}
//Preview Movie Details
const openPreviewModal = (id) => {
  $("#previewMovieModal").modal("show");
  let movie = findMovieById(id);
  let backgroundPreview = document.querySelector(
    "#previewMovieModal .modal-content"
  );
  let movieName = document.getElementById("modal-movie-name");
  let movieDescription = document.getElementById("modal-movie-description");
  let movieCategory = document.getElementById("modal-movie-category");

  backgroundPreview.style.backgroundImage = `url(${movie.imageUrl})`;
  movieName.innerHTML = movie.name
  movieDescription.innerHTML = movie.description;
  movieCategory.innerHTML = movie.category;
  console.log(movie);
};
//window on load
window.onload = async () => {
  //BACKOFFICE PAGE
  if (window.location.href.includes("backoffice")) {
    addNewBtn.addEventListener("click", () => {
      let title = document.getElementById("addMovieModalLabel");
      title.innerHTML = "New Movie";
      clearFieldsAddMovie();
      currentId = null;
      $("#addMovieModal").modal("show");
    });

    addMovieForm.onsubmit = (e) => handleSubmitMovie(e);
    spinner.classList.remove("d-none");

    try {
      let categories = await fetchCategories();
      movies = await Promise.all(
        categories.map(async (cat) => {
          try {
            movieFetched = await fetchMovies(cat);
            return movieFetched;
          } catch (err) {
            throw err;
          }
        })
      );
      //
      movies = movies.reduce((acc, mov) => acc.concat(mov));
      spinner.classList.add("d-none");
      renderMovies(movies);
      filterMovies(movies);
      sortMovies(movies);
      handleDelete();
      console.log(movies);
    } catch (err) {
      console.log(err);
    }
  }


  //INDEX PAGE
  if (
    window.location.href.includes("index") ||
    window.location.pathname == "/"
  ) {
    spinner?.classList.remove("d-none");

      try {
        let categories = await fetchCategories();
        movies = await Promise.all(
          categories.map(async (cat) => {
            try {
              movieFetched = await fetchMovies(cat);
              return movieFetched;
            } catch (err) {
              throw err;
            }
          })
        );
        //
        movies = movies.reduce((acc, mov) => acc.concat(mov));
        displayHome()
    
       



        spinner?.classList.add("d-none");
        console.log(movies);
      } catch (err) {
        console.log(err);
      }
  }
  
};
