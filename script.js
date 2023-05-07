'use strict';

////////Global Selectors////////

const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const hamburger = document.querySelector('[data-nav-hamburger]');
const navLinksWrapper = document.querySelector('[data-nav-links]');
const footer = document.querySelector('.footer');
const mobileBreakpoint = 767;
const tabletBreakpoint = 768;

const copyYear = document.querySelector('[data-year]');
copyYear.textContent = new Date().getFullYear();

////////Cookie Message////////

const cookieMessage = document.createElement('div');
cookieMessage.classList.add('cookie-message');
cookieMessage.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn" data-close-cookie>Got it!</button>';
header.after(cookieMessage);

const closeCookie = document.querySelector('[data-close-cookie]');
closeCookie.addEventListener('click', function () {
  cookieMessage.remove();
});

function mobileMenu() {
  hamburger.classList.toggle('active');
  navLinksWrapper.classList.toggle('active');
}
hamburger.addEventListener('click', mobileMenu);

////////Scrolling to section1////////
const btnScrollTo = document.querySelector('[data-scroll-to]');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////Navigation////////
navLinksWrapper.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.hasAttribute('data-nav-link')) {
    const id = e.target.getAttribute('href'); //gets id as input and scrolls
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

const img = document.querySelector('#logo');
img.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

////////Menu fade animation////////

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//Setting "this" manually through "bind" to pass the opacity as an "argument"
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky Navigation with INtersection Observer API
const windowWidth = window.innerWidth;

const stickyNavCallBack = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const stickyOptions = {
  root: null, //viewport is defined as root
  threshold: 0,
  rootMargin: windowWidth > tabletBreakpoint ? `-${navHeight}px` : '300px',
};

const headerObserver = new IntersectionObserver(
  stickyNavCallBack,
  stickyOptions
);
headerObserver.observe(header);

////////Reveal sections with Intersection Observer API////////
const allSections = document.querySelectorAll('section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //Consider the page top position to hide the section in case the user refresh the page whule in a bottom one.
  var topPosition = document.body.getBoundingClientRect().top;
  if (topPosition > -100) {
    section.classList.add('section--hidden');
  }
});

////////Lazy loading////////
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `-100px`,
});

imgTargets.forEach(img => imgObserver.observe(img));

////////Tabbed component////////
const tabTrigger = document.querySelectorAll('[data-tab');
const tabContainer = document.querySelector('[data-tab-container]');
const tabContent = document.querySelectorAll('[data-tab-content]');

tabContainer.addEventListener('click', function (e) {
  const clickedBtn = e.target.closest('[data-tab]');

  //Guard clause
  if (!clickedBtn) return;

  //Activate tab
  tabTrigger.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickedBtn.classList.add('operations__tab--active');

  //Activate content area
  tabContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clickedBtn.dataset.tab}`)
    .classList.add('operations__content--active');
});
////////Slider////////
// Slider
const slider = function () {
  const sliderContainer = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const maxSlide = slides.length;
  const btnLeft = document.querySelector('[data-slider-left]');
  const btnRight = document.querySelector('[data-slider-right]');
  const dotContainer = document.querySelector('[data-dots-container]');

  const createDots = function () {
    slides.forEach((_, i) => {
      const btnDot = `<button class="dots__dot" data-slide="${i}"></button>`;
      dotContainer.insertAdjacentHTML('beforeend', btnDot);
    });
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });

    activeDot(slide);

    btnRight.classList.remove('disabled');
    btnLeft.classList.remove('disabled');
    if (slide === 0) {
      btnLeft.classList.add('disabled');
    }
    if (slide === maxSlide - 1) {
      btnRight.classList.add('disabled');
    }
  };

  const activeDot = function (slide) {
    //Remove all active dot styling first
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(Number(slide));
    }
  });

  //Next slide
  const nextSlide = function () {
    currentSlide++;
    goToSlide(currentSlide);
  };

  // Previous slide
  const prevSlide = function () {
    currentSlide--;
    goToSlide(currentSlide);
  };

  //Initiate always on slide 0
  const initSlider = function () {
    createDots();
    goToSlide(0);
  };

  initSlider();

  //Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  const sliderTouch = function () {
    let isDragging = false,
      startPos = 0,
      currentTranslate = 0,
      prevTranslate = 0,
      currentIndex = 0;

    slides.forEach((slide, index) => {
      slide.addEventListener('dragstart', e => e.preventDefault());
      // touch events
      slide.addEventListener('touchstart', touchStart(index));
      slide.addEventListener('touchend', touchEnd);
      slide.addEventListener('touchmove', touchMove);
      // mouse events
      slide.addEventListener('mousedown', touchStart(index));
      slide.addEventListener('mouseup', touchEnd);
      slide.addEventListener('mousemove', touchMove);
      slide.addEventListener('mouseleave', touchEnd);
    });

    // make responsive to viewport changes
    window.addEventListener('resize', setPositionByIndex);

    // prevent menu popup on long press
    window.oncontextmenu = function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };

    function getPositionX(event) {
      return event.type.includes('mouse')
        ? event.pageX
        : event.touches[0].clientX;
    }
    function touchStart(index) {
      return function (event) {
        currentIndex = index;
        startPos = getPositionX(event);
        isDragging = true;
        sliderContainer.classList.add('grabbing');
      };
    }
    function touchMove(event) {
      if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
      }
    }
    function touchEnd() {
      isDragging = false;
      const movedBy = currentTranslate - prevTranslate;
      // if moved enough negative then snap to next slide if there is one
      if (movedBy < -100 && currentIndex < slides.length - 1) {
        currentIndex++;
        goToSlide(currentIndex);
      }

      // if moved enough positive then snap to previous slide if there is one
      if (movedBy > 100 && currentIndex > 0) {
        currentIndex--;
        goToSlide(currentIndex);
      }
      setPositionByIndex();
      sliderContainer.classList.remove('grabbing');
    }
    function setPositionByIndex() {
      currentTranslate = currentIndex * -window.innerWidth;
      prevTranslate = currentTranslate;
    }
  };
  sliderTouch();
};

slider();

const modal = document.querySelector('[data-modal]');
const overlay = document.querySelector('[data-overlay]');
const btnCloseModal = document.querySelector('[data-modal-close]');
const btnsOpenModal = document.querySelectorAll('[data-modal-open]');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
