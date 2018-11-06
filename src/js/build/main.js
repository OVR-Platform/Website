import { debounce, $1, each, $, listenForms } from './util'
// import BackgroundVideo from 'background-video'
import SmoothParallax from 'smooth-parallax'
import Flickity from 'flickity'
import { TweenLite, ScrollToPlugin } from 'gsap'
import Countdown from 'countdown-js'
import SmoothScroll from 'smooth-scroll'
import reqwest from 'reqwest'
import serialize from 'form-serialize'

const body = $1("body")

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
        dot_container.addEventListener( 'click', function(){
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
    }
  }

  const countDownManager = () => {
    // setup end datetime for timer
    var ten_days = 1000 * 60 * 60 * 24 * 10
    var end = new Date("12/1/2018")

    var timer = Countdown.timer(end, function(timeLeft) {
      document.getElementById("c-countdown_container").innerHTML = "Presale will start in "+timeLeft.days + " days " + timeLeft.hours + " hours " + timeLeft.minutes + " min " + timeLeft.seconds + " sec ";
    }, function() {
      console.log("Countdown Finished!")
    })
  }

  const onMobileHamburgerClick = () => {
    const pageWrap = $1("#hamburger-menu")
    const menuVoices = $(".c-mobile-nav__container-main a")

    pageWrap.addEventListener("click", function(){
      if( body.classList.contains("is_mobile_menu_open") ){
        body.classList.remove("is_mobile_menu_open")
      } else {
        body.classList.add("is_mobile_menu_open")
      }
    });

    each(menuVoices, (i, menuVoice) => {
      menuVoice.addEventListener("click", function(){
        body.classList.remove("is_mobile_menu_open")
      });
    });
  }

  const preloaderFadeOut = () => {
    body.classList.add("c-loader--logo-holder-animated")
    setTimeout(function(){
      body.classList.remove("c-loader--logo-holder-animated")
        setTimeout(function(){
          body.classList.add("c-loader--preloader-white-gone")
        },1600);
    },1850);
  }


  const scrollToLink = () => {
    	var scroll = new SmoothScroll('a[href*="#"]', {
        speed: 500,
        offset: 100
      });
  }

  const init = () => {
    scrollToLink();
    startParallax();
    initCarousels();
    menuManager();
    countDownManager();
    listenForms();
    onMobileHamburgerClick();
    preloaderFadeOut();
  }

  return {
    init,
  }
})()

export default Application
