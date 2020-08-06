const ITEMSQTY = document.querySelectorAll('.carousel-item').length;
let current = 0;
let canSlide = true;

function move(inEle, outEle, isLTR) {
  console.log('成功觸發 move 了 ！')
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
  console.log('觸發 slideTo 了')
  console.log('這次的 num 是', num)
  console.log('這次的 current 是', current)
  if (num === current) {
    console.log("num 等於 current，slideTo 終止！")
    return
  };
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

  console.log(`current:${current} 改成 下一個數字 ${num} 囉`)
  current = +num;
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
  */

  const addSlideHandler = (ele, count, direction) => {
    ele.addEventListener('click', function () {
      if (!canSlide) return
      canSlide = false;
      slideTo(count(), direction);
    })
  };


  // 阿阿阿阿阿阿阿這裡的 current 被固定住拉！！！！！！！！！
  addSlideHandler(prev, () => count(current + -1), 'left');
  addSlideHandler(next, () => count(current + 1), 'right');

  for (let i = 0; i < indicators.length; i += 1) {
    const li = indicators[i];
    addSlideHandler(li, () => li.getAttribute('data-slide-to'));
  }
}());
