const API_KEY = 'AIzaSyAU6x4ml02Flj61xsY95H9dL2Ycb9zMTik'

function getSearchResults(apiKey, term, page) {
  let reqURL = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=id,snippet&q=${term}&type=video&maxResults=10`

  if (page) {
    reqURL += `&pageToken=${page}`
  }

 return fetch(reqURL)
  .then(res => res.json())
  .then(data => {
    const items = data.items.map(i => ({
        id: i.id.videoId,
        thumbnail: i.snippet.thumbnails.default.url,
        title: i.snippet.title,
      }))

    const prevPage = data.prevPageToken
    const nextPage = data.nextPageToken

    return {
      items,
      prevPage,
      nextPage,
    }
  })
}

function getYTLink(id) {
  return "https://www.youtube.com/watch?v="+ id
}

function makeResultItem(videoId, title, thumbnail) {
  const el = document.createElement('li')
  el.className = "result"
  el.innerHTML = `
    <a href="${getYTLink(videoId)}">
      <img src="${thumbnail}" height="90" width="120"></img>
      <h1>${title}</h1>
    </a>
  `
  return el
}


const resultList = document.body.querySelector('#result-list')

function showSearchResults(results) {
  resultList.innerHTML = ''
  results.items.forEach(r => {
    const newItem = makeResultItem(r.id, r.title, r.thumbnail)
    resultList.appendChild(newItem)
  })

  if (results.prevPage) {
    previousButton.classList.remove('hidden')
  } else {
    previousButton.classList.add('hidden')
  }

  if (results.nextPage) {
    nextButton.classList.remove('hidden')
  } else {
    nextButton.classList.add('hidden')
  }
}


const form = document.body.querySelector('#form')
const searchTerm = document.body.querySelector('#search-term')
const previousButton = document.body.querySelector("#previous-button")
const nextButton = document.body.querySelector("#next-button")

function doSearch(page) {
  getSearchResults(API_KEY, searchTerm.value, page)
  .then(results => {
    previousButton.onclick = () => doSearch(results.prevPage)
    nextButton.onclick = () => doSearch(results.nextPage)
    showSearchResults(results)
  })
}


form.onsubmit = function(event) {
  event.preventDefault()
  doSearch()
}