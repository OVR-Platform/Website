import reqwest from 'reqwest'

export function debounce(func, wait, immediate) {
  var timeout
  return function() {
    var context = this
    var args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

export function throttle(callback, wait, context = this) {
  let timeout = null
  let callbackArgs = null

  const later = () => {
    callback.apply(context, callbackArgs)
    timeout = null
  }

  return function() {
    if (!timeout) {
      callbackArgs = arguments
      timeout = setTimeout(later, wait)
    }
  }
}

export function each(array, callback, scope) {
  for (let i = 0; i < array.length; i += 1) {
    callback.call(scope, i, array[i])
  }
}

export function $1(selector, context) {
  return (context || document).querySelector(selector)
}

export function $(selector, context) {
  return (context || document).querySelectorAll(selector)
}

export function whichTransitionEvent() {
  var t
  var el = document.createElement('fakeelement')
  var transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
  }

  for(t in transitions) {
    if(el.style[t] !== undefined) {
      return transitions[t]
    }
  }
}

export function getClosest(elem, selector) {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1
      }
  }

  // Get the closest matching element
  for ( ; elem && elem !== document; elem = elem.parentNode ) {
    if ( elem.matches( selector ) ) return elem;
  }
  return null
}

export function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}




var couldSendEmail = true;
var submitForm = debounce(function(form) {
  if(couldSendEmail == false){
    return false;
  }

  couldSendEmail = false;
  var url = form.getAttribute("action");
  $1("body").classList.add("is_form--loading");
  // console.log('submitForm','mail request');
  reqwest({
    url: url,
    method: 'post',
    data: { name: form.querySelector('.name').value,
            email: form.querySelector('.email').value,
            ogg: form.querySelector('.ogg').value,
            msg: form.querySelector('.msg').value },
    success: function (resp) {

      setTimeout(function(){
        if( resp == "false"){
          $1("body").classList.remove("is_form--loading");
          $1("body").classList.add("is_form--error");
        } else {
          $1("body").classList.remove("is_form--loading");
          $1("body").classList.add("is_form--success");
        }


        setTimeout(function(){
          $1("body").classList.remove("is_form--success");
          $1("body").classList.remove("is_form--error");
          $1("body").classList.remove("is_form--loading");
          form.querySelector('.name').value = "";
          form.querySelector('.email').value = "";
          form.querySelector('.msg').value = "";
          couldSendEmail = true;
        }, 3000)
      }, 500)
    }
  })
}, 4000, true);

export function listenForms(){
  const forms = $('.c-general-contact-form')
  // console.log('listenForms','listenForms')
  // Forms

  each(forms, (i, form) => {

    if(!form.classList.contains("is_form--listening")){
      // console.log('form_di_invio_appeso_per', form)
      form.addEventListener("submit", function(e) { e.preventDefault(); submitForm(form); }, true)
      form.classList.add("is_form--listening");
    }
  })

    each($('.c-contact-form'), (i, cf) => {
    cf.querySelector(".privacy").addEventListener("change", function(){
      if( this.checked ){
        cf.querySelector(".submit-button").classList.remove("disabled-2");
      } else {
        cf.querySelector(".submit-button").classList.add("disabled-2");
      }
    })
    // cf.querySelector(".disabled-2").addEventListener("click", function(){
    //   cf.querySelector(".privacy-holder").classList.add("tada");
    //   setTimeout(function(){
    //     cf.querySelector(".privacy-holder").classList.add("tada");
    //   }, 300);
    // })
  })
}
