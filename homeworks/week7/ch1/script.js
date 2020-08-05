const ITEMSQTY = document.querySelectorAll('.carousel-item').length;
let current = 0;
let canSlide = true;

function move(inEle, outEle, isLTR) {
  const direction = isLTR ? 'left' : 'right';
  inEle.classList.add(direction, 'in', 'active');
  outEle.classList.add(direction, 'out');

  inEle.addEventListener('animationend', () => {
    inEle.classList.remove('in', direction);
    canSlide = true;
  }, {
    once: true,
  });
  outEle.addEventListener('animationend', () => {
    outEle.classList.remove('out', direction, 'active');
  }, {
    once: true,
  });
}

function slideTo(num, direction) {
  if (num === current) return;
  let isLTR = num < current;
  if (direction === 'left') {
    isLTR = true;
  } else if (direction === 'right') {
    isLTR = false;
  }
  document.querySelector('li.active').classList.remove('active');
  document.querySelector(`li[data-slide-to="${num}"]`).classList.add('active');

  const slideInEle = document.querySelectorAll('.carousel-item')[num];
  const slideOutEle = document.querySelector('.carousel-item.active');
  move(slideInEle, slideOutEle, isLTR);

  current = num;
}

const count = (num) => {
  if (num < 0) return ITEMSQTY + num;
  if (num >= ITEMSQTY) return num - ITEMSQTY;
  return num;
};

(function addListener() {
  const prev = document.querySelector('#prev');
  const next = document.querySelector('#next');
  const indicators = document.querySelectorAll('li[data-slide-to]');

  /* 原本有想要包裝成下面的形式，但是中間遇到問題：在 move 裡面的 canSlide 不會轉成 true，導致說裡面的東西不會執行

  const addSlideHandler = (ele, num, direction) => {
    ele.addEventListener('click', function(){
      if (!canSlide) return
      canSlide = false;
      slideTo(num, direction);
    })
  };
  addSlideHandler(prev, count(current + -1), 'left')

  */

  const setCanSlideFalse = func => function () {
    if (!canSlide) return;
    canSlide = false;
    func();
  };

  prev.addEventListener('click', setCanSlideFalse(() => {
    slideTo(count(current + -1), 'left');
  }));
  next.addEventListener('click', setCanSlideFalse(() => {
    slideTo(count(current + 1), 'right');
  }));

  for (let i = 0; i < indicators.length; i += 1) {
    const li = indicators[i];
    li.addEventListener('click', setCanSlideFalse(() => {
      slideTo(count(li.getAttribute('data-slide-to')));
    }));
  }
}());
