import { debounce, $1, each, $, listenForms } from './util'
// import BackgroundVideo from 'background-video'
import SmoothParallax from 'smooth-parallax'
import Flickity from 'flickity'
import { TweenLite, ScrollToPlugin, TweenMax } from 'gsap'
import Countdown from 'countdown-js'
import SmoothScroll from 'smooth-scroll'
import reqwest from 'reqwest'
import serialize from 'form-serialize'
import mapboxgl from 'mapbox-gl'
import geojson2h3 from 'geojson2h3'
const h3 = require("h3-js");
import inView from 'in-view'


const body = $1("body")

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.className = 'js'
  Application.init();
})

window.addEventListener('resize', debounce(() => {
Application.mapInit();
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

  function mailchimpCallback (data) {
    console.log(data)
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
    var end = new Date("1/1/2019")

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

  const switchFooterColor = () => {
    window.onscroll = function(ev) {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        document.getElementById('countdown').classList.add('c-fixed-countdown--inverted')
      } else {
        document.getElementById('countdown').classList.remove('c-fixed-countdown--inverted')
      }
    };
  }

  const scrollToLink = () => {
    	var scroll = new SmoothScroll('a[href*="#"]', {
        speed: 500,
        offset: 100
      });
  }

  const config = ({
    lat: 46.0922495,
    lng: 13.2312417,
    zoom: 0,
    fillOpacity: 0.2,
    colorScale: ['#5F39BE', '#af3367','#1a0731', '#EC663C', '#0081DD']
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
          'fill-outline-color': 'rgba(75,83,0,0.9)',
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
        [0.5, config.colorScale[0]],
        [1, config.colorScale[0]]
      ]
    });

    map.setPaintProperty(layerId, 'fill-opacity', config.fillOpacity);
  }

  const mapInit = () => {
    let mapMaskHeight = document.getElementById('c-hex-map-mask').clientHeight - 2;
    document.getElementById("c-hex-map").style.height = mapMaskHeight;

    const hexagons = () => {
      var center = map.getCenter()
      //console.log (center)
      const centerHex = h3.geoToH3(center['lat'], center['lng'], 12)
      const kRing = h3.kRing(centerHex, 40)
      

      var data = Object.assign({}, kRing); 

      var newData = Object.keys(data).reduce(function(obj,key){
        obj[ data[key] ] = Math.random();
        return obj;
      },{});
      return newData;

    }

    mapboxgl.accessToken = 'pk.eyJ1IjoibWFudG9uZWxsaSIsImEiOiJjam9hNmljdHkwY2Y0M3JuejJrenhmMWE1In0.dC9b8oqj24iiSfm-qbNqmw';
    const map = new mapboxgl.Map({
      container: 'c-hex-map',
      center: [
        config.lng,
        config.lat,
      ],
      zoom: config.zoom,
      style: 'mapbox://styles/mapbox/light-v9',
    })




    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken
    });
    
    map.addControl(geocoder);

    map.on('load', () => {
      // renderHexes(map, hexagons())
      geocoder.on('result', function(ev) {

        map.flyTo({
          center:[ev.result.geometry.coordinates[0], ev.result.geometry.coordinates[1]], 
          zoom:18
        });

        const h3Geo = h3.geoToH3(ev.result.geometry.coordinates[0], ev.result.geometry.coordinates[1], 12)
        // document.getElementById('c-hex-map-info').innerHTML = h3Geo + ' = ' +  JSON.stringify(e.lngLat) 
        document.getElementById('c-hex-map-info').innerHTML = 'OVRLandID = ' +h3Geo 
        console.log(h3Geo);
      });




      map.addLayer({
        id: 'mapbox-mapbox-satellite',
        source: {"type": "raster",  "url": "mapbox://mapbox.satellite", "tileSize": 256},
        type: "raster"
      });
      map.setLayoutProperty('mapbox-mapbox-satellite', 'visibility', 'none');

      var switchy = document.getElementById('remover');
      switchy.addEventListener("click", function(){
          switchy = document.getElementById('remover');
          if (switchy.className === 'on') {
              switchy.setAttribute('class', 'off');
              map.setLayoutProperty('mapbox-mapbox-satellite', 'visibility', 'none');
              switchy.innerHTML = 'Satellite View';
          } else {
              switchy.setAttribute('class', 'on');
              map.setLayoutProperty('mapbox-mapbox-satellite', 'visibility', 'visible');
              switchy.innerHTML = 'Streets View';
          }
      });
    })

    const zoomThreshold = 16;

    map.on('moveend', function(){
      if (map.getZoom() > zoomThreshold) {
        renderHexes(map, hexagons())
      } else {
        
      }
    });
  

    let fullScreenChange;  

    if ('onfullscreenchange' in window.document) {
      fullScreenChange = 'fullscreenchange';
    } else if ('onmozfullscreenchange' in window.document) {
      fullScreenChange = 'mozfullscreenchange';
    } else if ('onwebkitfullscreenchange' in window.document) {
      fullScreenChange = 'webkitfullscreenchange';
    } else if ('onmsfullscreenchange' in window.document) {
      fullScreenChange = 'MSFullscreenChange';
    }

    function onFullscreenChange() {
      body.classList.toggle("fullscreen-map");
    }

    window.document.addEventListener(fullScreenChange, onFullscreenChange);


    map.on('zoom', function() {
      const sourceId = 'h3-hexes'
      const layerId = `${sourceId}-layer`
  
      if (map.getZoom() > zoomThreshold) {
        renderHexes(map, hexagons())
        if (map.getLayer("h3-hexes-layer")) {
          map.setLayoutProperty(layerId, 'visibility', 'visible');
        }
      } else {
        if (map.getLayer("h3-hexes-layer")) {
          map.setLayoutProperty(layerId, 'visibility', 'none');
        }
      }

    });

      // Add geolocate control to the map.
      var geoLocate = new mapboxgl.GeolocateControl();
      map.addControl(geoLocate);
      geoLocate.on('geolocate', function(e) {
          map.flyTo({
            center:[e.coords.longitude, e.coords.latitude], 
            zoom:18
          });
      });

      map.addControl(new mapboxgl.FullscreenControl());


    document.getElementById('c-hex-map-jump-to').addEventListener('click', function () {
        // Fly to a random location by offsetting the point -74.50, 40
        // by up to 5 degrees.
        map.flyTo({
            zoom: 18,
            center: [
              -73.98760251687273,
              40.73158848778172]
        }); 
    });

    map.on('mousemove', function (e) {
      const h3Geo = h3.geoToH3(e.lngLat['lat'], e.lngLat['lng'], 12)
      // document.getElementById('c-hex-map-info').innerHTML = h3Geo + ' = ' +  JSON.stringify(e.lngLat) 
      document.getElementById('c-hex-map-info').innerHTML = 'OVRLandID = ' +h3Geo 
    });

  }

  const fadeInScndS = () => {

    TweenMax.set('#base', {opacity: 0}); // mondo 
    TweenMax.set('.scn-8 path', {opacity: 0}); // hex mondo
    TweenMax.set('.exa', {scale: 0, transformOrigin: 'center' }); // 3 esagoni minori
    TweenMax.set('.omino', {scale: 0, transformOrigin: 'center' }); // 3 esagoni con uomini
    TweenMax.set('#mama', {scale: 0, transformOrigin: 'center' }); // 3 esagoni con uomini
    TweenMax.set('.boxes', {scale: 0, y: '-50px', transformOrigin: 'center bottom' }); // 3 cubi
    TweenMax.set('.schermivirtual', {opacity: 0, y: '-50px', transformOrigin: 'center' }); // 3 vrexp

    var scndSVGTL = new TimelineMax({repeat:-1});
    scndSVGTL.timeScale(9);
    scndSVGTL.addPause(400).play();

    inView('#intro').once('enter', function(){
      console.log('entere');
      var tl = new TimelineMax({repeat:-1});
      tl.to('#base', 1.8, {opacity: 1})
      tl.staggerTo('.scn-8 path', 0.4, {opacity:1}, 0.03, "-=0.8")
      tl.staggerTo('.exa', 0.3, {scale:1}, 0.2, "-=0.8")
      tl.staggerTo('.omino', 0.4, {scale:1}, 0.2 )
      tl.staggerTo('.boxes', 0.4, {scale:1, y: '0px'}, 0.2 )
      tl.staggerTo('.schermivirtual', 0.4, {opacity:1, y: '0px'}, 0.2)
      tl.staggerTo('#mama', 0.4, {scale:1}, 0.2, "-=1.5" )
      .add(scndSVGTL, 0)
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
    mapInit();
    switchFooterColor();
    fadeInScndS();
  }

  return {
    init,
    mapInit: mapInit,
  }
})()

export default Application