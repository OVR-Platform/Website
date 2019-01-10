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
var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && screen.width > 1000;


let final_list = [];


var opt = new XMLHttpRequest();
opt.addEventListener("load", reqListener);
opt.open("GET", "prova.json");
opt.send();

function reqListener() {
  final_list = JSON.parse(this.responseText);

  // hex_test = ['8cad56762d08dff',
  //   '8c2cd6cf6419dff',
  //   '8ce14268e3911ff',
  //   '8c7876a52db6dff',
  //   '8c008e073356bff',
  //   '8cdf9a555d241ff',
  //   '8ccca26082559ff',
  //   '8c8a6c176a1a7ff',
  //   '8c0e026152413ff',
  //   '8cf06ea06cda9ff',
  //   '8c9326b5cd589ff',
  //   '8c000ac91832bff',
  //   '8c1f05065c563ff',
  //   '8c380e86c909dff',
  //   '8c0588a8c91a1ff',
  //   '8cf16b0025621ff',
  //   '8c8b4c8aac53bff',
  //   '8c35006027a45ff',
  //   '8cab8e728b16bff',
  //   '8c8ee8d152543ff',
  //   '8c8d4939dd431ff',
  //   '8c933101311cdff',
  //   '8c47800333ae5ff',
  //   '8c115a948bb31ff',
  //   '8cc10238dd1a5ff',
  //   '8c0753ab2d0e7ff',
  //   '8c3c19b5939d1ff',
  //   '8cf123688408dff',
  //   '8c0d18daa12a7ff',
  //   '8cece6c882311ff',
  //   '8c11b69a271c1ff',
  //   '8cf31922d6ce5ff',
  //   '8c77a4ce83951ff',
  //   '8c0fa1b1282e5ff',
  //   '8ccd3404954c1ff',
  //   '8c10a6603cb31ff',
  //   '8c2e5a98c7b1dff',
  //   '8c5c8bb16018dff',
  //   '8ceced0c494c1ff',
  //   '8c0b652135231ff',
  //   '8c3da6253b2bbff',
  //   '8c3318c036489ff',
  //   '8c1b6927401c5ff',
  //   '8cf29136d4463ff',
  //   '8c78a60017a09ff',
  //   '8cf11daa62949ff',
  //   '8ce1ab61631cbff',
  //   '8cee2bcadc341ff']

  // for (let i = 0; i < hex_test.length; i++) {
  //   let triplet = form_h3_to_words(hex_test[i])
  //   let generated_hex = from_triplet_to_h3(triplet)
  //   if (hex_test[i] === generated_hex) {
  //     console.log('ok')
  //   } else {
  //     console.log('cazzo!')
  //   }
  //   console.log(hex_test[i], triplet, generated_hex)
  // }
}


function add(x, y, base) {
  var z = [];
  var n = Math.max(x.length, y.length); 191
  var carry = 0;
  var i = 0;
  while (i < n || carry) {
    var xi = i < x.length ? x[i] : 0;
    var yi = i < y.length ? y[i] : 0;
    var zi = carry + xi + yi;
    z.push(zi % base);
    carry = Math.floor(zi / base);
    i++;
  }
  return z;
}

// Returns a*x, where x is an array of decimal digits and a is an ordinary
// JavaScript number. base is the number base of the array x.
function multiplyByNumber(num, x, base) {
  if (num < 0) return null;
  if (num == 0) return [];

  var result = [];
  var power = x;
  while (true) {
    if (num & 1) {
      result = add(result, power, base);
    }
    num = num >> 1;
    if (num === 0) break;
    power = add(power, power, base);
  }

  return result;
}

function parseToDigitsArray(str, base) {
  var digits = str.split('');
  var ary = [];
  for (var i = digits.length - 1; i >= 0; i--) {
    var n = parseInt(digits[i], base);
    if (isNaN(n)) return null;
    ary.push(n);
  }
  return ary;
}

function convertBase(str, fromBase, toBase) {
  var digits = parseToDigitsArray(str, fromBase);
  if (digits === null) return null;

  var outArray = [];
  var power = [1];
  for (var i = 0; i < digits.length; i++) {
    if (digits[i]) {
      outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
    }
    power = multiplyByNumber(fromBase, power, toBase);
  }

  var out = '';
  for (var i = outArray.length - 1; i >= 0; i--) {
    out += outArray[i].toString(toBase);
  }
  return out;
}


let combinations_vocab = {
  0: '000',
  1: '001',
  2: '010',
  3: '011',
  4: '100',
  5: '101',
  6: '110',
  7: '111',
  8: '002',
  9: '012',
  10: '020',
  11: '021',
  12: '022',
  13: '102',
  14: '112',
  15: '120',
  16: '121',
  17: '122',
  18: '200',
  19: '201',
  20: '202',
  21: '210',
  22: '211',
  23: '212',
  24: '220',
  25: '221',
  26: '222'
}


const from_triplet_to_h3 = (triplet) => {
  let h3_invariant_head = '10001100'
  let h3_invariant_tail = '111111111'

  let triplet_adj = [];
  let str_value = '';

  for (let i = 0; i < triplet.length; i++) {
    for (let j = 0; j < final_list.length; j++) {
      if (final_list[j] === triplet[i]) {
        str_value = j.toString()
      }
    }
    let length_string = str_value.length

    if (length_string < 5) {
      for (let n = 0; n < 5 - length_string; n++) {
        str_value = '0' + str_value
      }
    }

    triplet_adj.push(str_value)
  }


  let first_trinary_code = triplet_adj[0].substring(0, 1) + triplet_adj[1].substring(0, 1) + triplet_adj[2].substring(0, 1)
  let first_integer_value = 0

  for (let key in combinations_vocab) {
    if (combinations_vocab[key] === first_trinary_code) {
      first_integer_value = key
    }
  }

  let full_integer = (first_integer_value).toString() + triplet_adj[0].substring(1) + triplet_adj[1].substring(1) + triplet_adj[2].substring(1)
  let binary_full_integer = convertBase(full_integer, 10, 2)
  let binary_full_integer_length = binary_full_integer.length


  for (let i = 0; i < 43 - binary_full_integer_length; i++) {
    binary_full_integer = '0' + binary_full_integer
  }

  let whole_binary = h3_invariant_head + binary_full_integer + h3_invariant_tail
  let h3_index = convertBase(whole_binary, 2, 16)
  return h3_index
}



const form_h3_to_words = (h3_address) => {

  let binary = convertBase(h3_address, 16, 2)

  let binary_clean = binary.substr(8, 43)

  let integer = parseInt(binary_clean, 2)
  let str_integer = integer.toString()

  let integer_length = str_integer.length


  if (integer_length < 13) {
    for (let i = 0; i < 13 - integer_length; i++) {
      str_integer = '0' + str_integer
    }
  }


  let integer_first_value = str_integer[0]

  let first_word_idx = parseInt(combinations_vocab[parseInt(integer_first_value)].substring(0, 1) + str_integer.substring(1, 5))
  let first_word = final_list[first_word_idx]

  let second_word_idx = parseInt(combinations_vocab[parseInt(integer_first_value)][1] + str_integer.substring(5, 9))
  let second_word = final_list[second_word_idx]

  let third_word_idx = parseInt(combinations_vocab[parseInt(integer_first_value)][2] + str_integer.substring(9))
  let third_word = final_list[third_word_idx]

  return [first_word, second_word, third_word]
}


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
    if (!is_safari){
      SmoothParallax.init();
    } else {
      document.body.classList.add('is_safari')
    }
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
        cellAlign: 'center',
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
    fillOpacity: 0.4,
    colorScale: ['#5F39BE', '#ffffff','#1a0731', '#EC663C', '#0081DD']
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
          'fill-outline-color': 'rgba(255,255,255,1.9)',
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
        document.getElementById('c-hex-map-info').innerHTML = 'OVRLandID = ' + h3Geo 
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
              switchy.innerHTML = 'Satellite';
          } else {
              switchy.setAttribute('class', 'on');
              map.setLayoutProperty('mapbox-mapbox-satellite', 'visibility', 'visible');
              switchy.innerHTML = 'Streets';
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
      document.getElementById('c-hex-map-info').innerHTML = 'OVRLandID = ' + form_h3_to_words(h3Geo)[0] + "." + form_h3_to_words(h3Geo)[1] + "." + form_h3_to_words(h3Geo)[2] 
      // console.log(form_h3_to_words(h3Geo))
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