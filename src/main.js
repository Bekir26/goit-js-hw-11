import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

{/* <li>
          <a href="./img/deneme.png">
            <img src="./img/deneme.png" alt="Image 1" />
            <div class="general-likes-container">
              <div class="likes-container">
                <h3 class="likes-title">Likes</h3>
                <div class="likes">1813</div>
              </div>
              <div class="likes-container">
                <h3 class="likes-title">Views</h3>
                <div class="likes">900290</div>
              </div>
              <div class="likes-container">
                <h3 class="likes-title">Comments</h3>
                <div class="likes">229</div>
              </div>
              <div class="likes-container">
                <h3 class="likes-title">Downloads</h3>
                <div class="likes">610937</div>
              </div>
            </div>
          </a>
        </li> */}

const loadingDOM = document.querySelector('.loading');
const search_btn = document.querySelector('.searchBtn');
const galleryDOM = document.querySelector('.gallery');
const base_url = "https://pixabay.com/api/?"
const api_key = "46048347-9d88aa79f4238f227ee13ac9b"
// const messageContainerDOM = document.querySelector('.messageContainer'); 

function refresh(){
  galleryDOM.innerHTML="";
}

const searchInput = document.querySelector('.searchInput');
async function getPhoto(searchText){
  refresh();
  const full_url = `${base_url}key=${api_key}&q=${searchText}&image_type=photo&orientation=horizontal&safesearch=true&per_page=9`;
  
  try {
    loadingDOM.style.display = "block";
    const response = await fetch(full_url);
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    loadingDOM.style.display = "none";
    const images = await response.json();
    if(images?.hits.length > 0){
      searchInput.value = "";
      const fragment = document.createDocumentFragment();
      images.hits.forEach((image) => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${image.largeImageURL}">
            <img src="${image.webformatURL}" alt="${image.tags}" />
            <div class="general-likes-container">
              <div class="likes-container">
                <h3 class="likes-title">Likes</h3>
                <div class="likes">${image.likes}</div>
              </div>
              <div class="likes-container">
                <h3 class="likes-title">Views</h3>
                <div class="likes">${image.views}</div>
              </div>
              <div class="likes-container">
                <h3 class="likes-title">Comments</h3>
                <div class="likes">${image.comments}</div>
              </div>
              <div class="likes-container">
                <h3 class="likes-title">Downloads</h3>
                <div class="likes">${image.downloads}</div>
              </div>
            </div>
          </a>`
        fragment.appendChild(li);
      })
      galleryDOM.appendChild(fragment);
      const lightbox = new SimpleLightbox('.gallery a', {
        captions: true,             
        captionsData: 'alt',       
        captionDelay: 250,         
        showCounter: true,          
        enableKeyboard: true,      
        loop: true,                
        nav: true,                 
        close: true,                
        animationSpeed: 250,
    });
    
    lightbox.on('show.simplelightbox', function () {
      console.log('Modal is shown');
    });
    
    lightbox.on('close.simplelightbox', function () {
      console.log('Modal is closed');
    });
    }
    else{
      // messageContainerDOM.style.display = "flex";
      // const closeBtn = document.querySelector('.close');
      // closeBtn.addEventListener('click', () => {
      //   messageContainerDOM.style.display = "none";
      // })
      iziToast.show({
        theme: 'custom',
        icon: 'fas fa-exclamation-circle',
        message: 'Sorry, there are no images matching your search query. Please, try again!',
        position: 'topRight',
        progressBarColor: '#B51B1B',
        onOpening: function(instance, toast){
            console.info('Modal is open');
        },
        onClosing: function(instance, toast, closedBy){
            console.info('closedBy: ' + closedBy); // tells if it was closed by 'drag' or 'button'
        }
    });
    }
    
    
  } catch (error) {
    loadingDOM.style.display = "none";
    console.error(error.message);
  }
  
}

search_btn.addEventListener('click', _ => {
  const searchText = searchInput.value.trim();
  
  if(searchText){
    getPhoto(searchText);
  }
  else {
    alert("Search input cant be empty");
  }
})