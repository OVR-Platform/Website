import {TweenMax, TimelineMax, Sine} from 'gsap'
// import { $, $1, each } from '../util'
// import inView from 'in-view'


var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && screen.width > 1000;


// export function initHomeInView(){

//     if (false){ // <- Remove me before flight
//     if(document.getElementsByClassName('c-hero') && screenWidth > 1100){
//       // COURSES
//       tl_h_c = new TimelineMax({repeat:0, repeatDelay:1});
//       tl_h_c.stop();
//       TweenMax.set("#c-h-c-ball", {scale: .0});
//       $1("#c-h-c-svg-1").style.visibility = "hidden";
//       $1("#c-h-c-svg-2").style.visibility = "hidden";
//       tl_h_c.fromTo("#c-h-c-ball", 0.8, { opacity: 1, scale: .0, x: '0px',y: '0px',rotation:"1.25rad" }, { rotation:"0rad", scale: 1, x: '0px',y: '0px', ease: Expo.easeInOut, onComplete: function(){drawSVGCircles('c-h-c-svg-1','c-h-c-svg-2')}});
//       tl_h_c.staggerFromTo($("#courses .c-case__icon"), 0.4, { opacity: 0, y: '-10px' }, { opacity: 1 , y: '0px', ease: Expo.easeInOut}, 0.2)
//       tl_h_c.staggerFromTo($("#courses .c-case__title"), 0.4, { opacity: 0 }, { opacity: 1, ease: Expo.easeInOut}, 0.2, '-=0.45')
//       tl_h_c.staggerFromTo($("#courses .c-case__copy"), 0.4, { opacity: 0, x: '-10px', ease: Expo.easeInOut }, { opacity: 1 , x: '0px'}, 0.2, '-=0.4')

//       inView('#courses .o-col-fifth')
//       .on('enter', function(){
//         tl_h_c.play();
//       })
//       .on('exit', el => {

//         if(document.getElementById('c-hero-svg-1') ){
//           $1('#c-h-c-svg-1').classList.remove('a-orbit-1')
//           $1('#c-h-c-svg-2').classList.remove('a-orbit-2')
//         }
//       });



//       // SERVICES
//       tl_h_s = new TimelineMax({repeat:0, repeatDelay:1});
//       tl_h_s.stop();
//       // tl_h_s.fromTo("#wave", 1, { opacity: 0}, { opacity:0.8});
//       // tl_h_s.fromTo("#wave02", 1, { opacity: 0}, { opacity:0.8}, "-=0.2");
//       // tl_h_s.fromTo("#wave03", 1, { opacity: 0}, { opacity:0.8}, "-=0.2");
//       tl_h.staggerFromTo($(".c-services-dot__container"), 0.4, { opacity: 0 }, {opacity: 1}, 0.1)

//     }
//   } //  <- Remove me before flight IF FALSE FADE CLOSE

//   inView('#services .c-services__waves')
//     .on('enter', function(){
//       // tl_h_s.play(); //  <- Remove me before flight RIATTIVA FADE animazioni

//       $1('#wave').classList.add('a-wave-orbit-1')
//       $1('#wave02').classList.add('a-wave-orbit-2')
//       $1('#wave03').classList.add('a-wave-orbit-3')

//     })
//     .on('exit', el => {
//       if(document.getElementById('wave') ){
//       $1('#wave').classList.remove('a-wave-orbit-1')
//       $1('#wave02').classList.remove('a-wave-orbit-2')
//       $1('#wave03').classList.remove('a-wave-orbit-3')
//       }
//     });
// }
