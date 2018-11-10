import { debounce, $1, each, $, listenForms } from './util'
// import BackgroundVideo from 'background-video'
import SmoothParallax from 'smooth-parallax'
import Flickity from 'flickity'
import { TweenLite, ScrollToPlugin } from 'gsap'
import Countdown from 'countdown-js'
import SmoothScroll from 'smooth-scroll'
import reqwest from 'reqwest'
import serialize from 'form-serialize'
import mapboxgl from 'mapbox-gl'
import geojson2h3 from 'geojson2h3'
const h3 = require("h3-js");


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

  const config = ({
    lng: -122.4,
    lat: 37.7923539,
    zoom: 11.5,
    fillOpacity: 0.6,
    colorScale: ['#ffffcc', '#78c679', '#006837']
  })

  function renderHexes(map, hexagons) {
  
    // Transform the current hexagon map into a GeoJSON object
    const geojson = geojson2h3.h3SetToFeatureCollection(
      Object.keys(hexagons),
      hex => ({ value: hexagons[hex] })
    )

    const sourceId = 'h3-hexes'
    const layerId = `${sourceId}-layer`
    let source = map.getSource(sourceId)
    
    // Add the source and layer if we haven't created them yet
    if (!source) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: geojson,
      })
      map.addLayer({
        id: layerId,
        source: sourceId,
        type: 'fill',
        interactive: false,
        paint: {
          'fill-outline-color': 'rgba(0,0,0,0)',
        },
      })
      source = map.getSource(sourceId)
    }

    // Update the geojson data
    source.setData(geojson)

    // Update the layer paint properties, using the current config values
    map.setPaintProperty(layerId, 'fill-color', {
      property: 'value',
      stops: [
        [0, config.colorScale[0]],
        [0.5, config.colorScale[1]],
        [1, config.colorScale[2]]
      ]
    });

    map.setPaintProperty(layerId, 'fill-opacity', config.fillOpacity);
  }

  const mapInit = () => {

    const hexagons = () => {
      const centerHex = h3.geoToH3(config.lat, config.lng, 8)
      const kRing = h3.kRing(centerHex, 3)
      // Reduce hexagon list to a map with random values
      // console.log('kRing', kRing)
      // kRing.reduce((res, hexagon) => {
      //   console.log(...res)
      // })

      return {
        '88283082a3fffff': 0.4249828858264375,
        '88283082a1fffff': 0.4372496914160584,
        '88283082a7fffff': 0.6383156026444929,
        '88283080c9fffff': 0.0029371686960160126,
        '88283082b5fffff': 0.7797984528233057,
        '88283082bdfffff': 0.12086935004080979,
        '88283082abfffff': 0.43410455265262327,
        '88283082a9fffff': 0.24791156506714596,
      }
    }

    mapboxgl.accessToken = 'pk.eyJ1IjoibWFudG9uZWxsaSIsImEiOiJjam9hNmljdHkwY2Y0M3JuejJrenhmMWE1In0.dC9b8oqj24iiSfm-qbNqmw';
    const map = new mapboxgl.Map({
      container: 'map',
      center: [
        config.lng,
        config.lat,
      ],
      zoom: config.zoom,
      style: 'mapbox://styles/mapbox/light-v9',
    })

    map.on('load', () => {
      renderHexes(map, hexagons())
    })
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
    mapInit();
  }

  return {
    init,
  }
})()

export default Application
