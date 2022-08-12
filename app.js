const imdbUrl = 'https://imdb-api.com/API/'

const imdbKey = 'key'

const resizeBackdrops = imdbUrl + 'ResizePoster?apikey=' + imdbKey + '&size=w1280&url='
const resizeBigPoster = imdbUrl + 'ResizePoster?apikey=' + imdbKey + '&size=w300&url='
const resizePoster = imdbUrl + 'ResizeImage?apikey=' + imdbKey + '&size=250x400&url='

var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

getData = (name, extras) => {
  if(extras) {
    return fetch(imdbUrl + name + '/' + imdbKey + '/' + extras, requestOptions)
  } else {
    return fetch(imdbUrl + name + '/' + imdbKey, requestOptions)
  }
}

/* Loading */
loading = (on) => {
  let load = document.getElementById('loading')

  on == true ? load.style.display = 'flex' : load.style.display = 'none'
}

/* Movies */
let header = document.getElementById('header')
initHeader = () => {
  loading(true)
  getData('MostPopularMovies')
  .then(response => response.json())
  .then(result => {
    let i = 0
    let title = document.querySelector('.title')
    let cast = document.querySelector('.casting')
    let watch = document.querySelector('.watch')
    let bgimage = document.querySelector('.movie-bg-image')
    let poster = document.querySelector('.movie-poster-image')

    title.innerHTML = result.items[i].fullTitle
    cast.innerHTML = result.items[i].crew
    bgimage.alt = 'Background ' + result.items[i].fullTitle
    poster.alt = 'Poster ' + result.items[i].fullTitle
    watch.innerHTML = `
      <button class="btn" type="button" onclick="watch('${result.items[i].id}')">
        Assistir
      </button>
    `
    setBanner(result.items[i].id)
    setList(result.items)
  })
  .catch(error => console.log('error', error));
}

setBanner = (id) => {
  let bgimage = document.querySelector('.movie-bg-image')
  let poster = document.querySelector('.movie-poster-image')

  getData('Posters', id)
    .then(response => response.json())
    .then(result => {
      bgimage.src = resizeBackdrops + result.backdrops[0].link
      poster.src = resizeBigPoster + result.posters[0].link
      loading(false)
    })
    .catch(error => console.log('error', error));
}

/* Viewer */
watch = (id) => {
  let view = document.getElementById('view')
  let viewer = document.querySelector('.view')

  if (view.style.display == 'none') {
    view.style.display = 'block'
    viewer.innerHTML = `
      <iframe
        src="https://embed.hdfoxcdn.net/${id}"
        width="100%" height="500" allowfullscreen="true" scrolling="no"
        frameborder="0">
      </iframe>
    `
  } else {
    view.style.display = 'none'
    viewer.innerHTML = ""
  }
}

/* Slider */
setList = (list) => {
  sliderWidth('.movies-list')
  let slider = document.querySelector('.movies-list')
  slider.innerHTML = ''
  for (let i = 0; i < 10; i++) {
    slider.innerHTML += `
      <li>
        <div class="image">
          <img
            src="${resizePoster + list[i].image}"
            alt="${list[i].title}">
        </div>
        <div class="buttons">
          <h3>${list[i].rank} - ${list[i].title}<br>${list[i].year}</h3>
          <button class="btn" type="button" onclick="watch('${list[i].id}')">
            Assistir
          </button>
        </div>
      </li>
    `
  }
}

sliderWidth = (id) => {
  let slider = document.querySelector(id)
  screen.width < 768 ? slider.style.width = '500%' : slider.style.width = '250%'
}

slider = (id, value) => {
  let slider = document.querySelector(id)
  if(screen.width < 768) {
    value = parseInt(value) * 2
  }
  position = parseInt(slider.style.marginLeft) + parseInt(value)
  if (parseInt(slider.style.marginLeft) == 0 && parseInt(value) > 0) {
    position = parseInt(slider.style.marginLeft)
  }
  if (-parseInt(slider.style.marginLeft) == parseInt(slider.style.width) - 100
    && parseInt(value) < 0) {
    position = parseInt(slider.style.marginLeft)
  }
  slider.style.marginLeft = position.toString() + '%'
}

window.addEventListener(
  'resize',
  ()=>{
    sliderWidth('.movies-list')
  }
)

/* Search */

searchBox = () => {
  let search = document.querySelector('.search-box')
  if(search.style.height == 'auto'){
    search.style.height = '0'
    search.classList.remove('active')
  } else {
    search.style.height = 'auto'
    search.classList.add('active')
  }
}

search = () => {
  let searchInput = document.querySelector('#search-text')

  if(searchInput.value.length > 3) {
    getData('SearchMovie', searchInput.value)
      .then(response=>response.json())
      .then(response=>{
        console.log(response.results)
        items = response.results
        let searchList = document.querySelector('.search-list')
        searchList.innerHTML = ''
        for (let i = 0; i < items.length; i++) {
          searchList.innerHTML += `
            <li>
              <button onclick="watch('${items[i].id}')">
                <div class="image">
                  <img
                    src="${items[i].image}"
                    alt="${items[i].title}">
                </div>
                <div class="info">
                  <h3>${items[i].title}</h3>
                </div>
              </button>
            </li>
          `
        }
      })
      .catch(error=>console.log(error))
  }
}

initHeader()