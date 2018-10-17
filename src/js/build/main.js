import { debounce, $1, each, $ } from './util'
// import BackgroundVideo from 'background-video'
import SmoothParallax from 'smooth-parallax'
import Flickity from 'flickity'

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.className = 'js'
  Application.init();
})

window.addEventListener('resize', debounce(() => {

}, 250))

window.addEventListener('load', () => {

})




const Application = (() => {

  let startParallax = () => {
    SmoothParallax.init();
  }

  const reInit = () => {

  }

  const initCarousels = () => {
    var carousel = new Flickity('.js-tab-slider', {
      cellAlign: 'left',
      contain: true,
      pageDots: false,
      freeScroll: false,
      prevNextButtons: false,
      imagesLoaded: true,
      adaptiveHeight: true,
      hash: true,
      pauseAutoPlayOnHover: false
    })

    const featuresButton = $('.js-feature-tab-button')
    each( featuresButton, (i, featureButton) => {
      featureButton.addEventListener('click', function(){
        const id = this.dataset.id;
        carousel.select(parseInt(id, 10));
        each( featuresButton, function (l, fB) {
          fB.classList.remove('js-button--active');
        });
        this.classList.add('js-button--active');
      });
    })

    var elem = document.querySelector('.c-stories-dots__container')

    if (elem != null){
      var flktyTimeline = new Flickity(elem, {
        cellAlign: 'left',
        cellSelector: '.c-services-dot__container',
        prevNextButtons: false,
        adaptiveHeight: true,
        pageDots: false,
        contain: true
      });

      each(elem.getElementsByClassName('c-services-dot__container'), (i, dot_container) => {
        dot_container.addEventListener( 'mouseenter', function(){
          // console.log(this.dataset.index - 1);
          flktyTimeline.select( this.dataset.index );
        });
      })
    }
  }


  const menuManager = () => {
    window.removeEventListener("scroll", menuManagerOnScroll, false)
    window.addEventListener("scroll", menuManagerOnScroll, false)
    function menuManagerOnScroll(){
      const hero = $1(".c-hero")
      const body = $1("body")
      const pageWrap = $1("#page-wrap")
      const heroHeight = hero.offsetHeight;

      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // console.log(scrollTop);
      // console.log(heroHeight);
      // console.log(footerOffset);

      // pageWrap menu
      if ( scrollTop > heroHeight - 500 ){
        pageWrap.classList.add("is-scrolling")

      } else {
        pageWrap.classList.remove("is-scrolling")
      }


      // if ( scrollTop > 0 && !mouseOverMenu ){
      //   body.classList.add("main-nav--is-idle")
      // } else {
      //   body.classList.remove("main-nav--is-idle")
      // }

      // if (scrollTop > lastScrollTop){
      //     // downscroll code
      // } else {
      //   body.classList.remove("main-nav--is-idle")
      // }
      // lastScrollTop = scrollTop;

    }
  }

  const init = () => {
    startParallax();
    initCarousels();
    menuManager();
    console.log('init');
  }

  return {
    init,
  }
})()

export default Application
