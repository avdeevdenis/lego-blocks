const globalMatrix = {};
let maxYOffset;

const blocks = document.querySelector('.blocks');

const centerBlock = document.querySelector('.block-center');

const blue1 = document.querySelector('.blue-1');
const blue3 = document.querySelector('.blue-3');

const white1 = document.querySelector('.white-1');
const white3 = document.querySelector('.white-3');

const green1 = document.querySelector('.green-1');
const green3 = document.querySelector('.green-3');

let centerBlockDefaultTop;

const DETAIL_HEIGHT = 11;
const DETAIL_DOUBLE_HEIGHT = 48;

let blue1TargetTop;
let blue3TargetTop;

let blue1StartTop;
let blue1Left;

let blue3StartTop;
let blue3Left;

let white1Left;
let white3Left;

let green1Left;
let green3Left;

let removeTransitionTimer = null;
let removedTransitionClass = false;

const setCorrectVh = () => {
    // Сначала получаем высоту окна просмотра 
    // и умножаем ее на 1%
    let vh = window.innerHeight * 0.01;

    // Затем устанавливаем значение свойства --vh
    // для корневого элемента
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

const setDefaultSettings = () => {
    setCorrectVh();

    // какой-то отступ
    const offset = 16;
    maxYOffset = document.body.offsetHeight - document.documentElement.clientHeight + offset;

    centerBlockDefaultTop = getTransformTopCoord(centerBlock);

    blue1TargetTop = centerBlockDefaultTop - DETAIL_DOUBLE_HEIGHT;
    blue3TargetTop = centerBlockDefaultTop - DETAIL_HEIGHT;

    blue1StartTop = getTransformTopCoord(blue1);
    blue1Left = getTransformLeftCoord(blue1);

    blue3StartTop = getTransformTopCoord(blue3);
    blue3Left = getTransformLeftCoord(blue3);

    white1Left = getTransformLeftCoord(white1);
    white3Left = getTransformLeftCoord(white3);

    green1Left = getTransformLeftCoord(green1);
    green3Left = getTransformLeftCoord(green3);    
}

const onDOMContentLoaded = () => {
    setDefaultSettings();

    window.addEventListener('scroll', throttle(onScroll, 10), false);
    onScroll(IS_USER_ACTION = false);

    // слушаем событие resize
    window.addEventListener('resize', () => {
        setCorrectVh();
    });

    const transitionDuration = window.getComputedStyle(blue1).transitionDuration;
    const timeoutDuration = transitionDuration.split('s')[0] * 1000;

    removeTransitionTimer = setTimeout(() => {
        removeTransitionClass();
    }, timeoutDuration);
}

function removeTransitionClass() {
    clearTimeout(removeTransitionTimer);

    removedTransitionClass = true;
    blocks.classList.remove('blocks_transition');
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded, false);

function onScroll(IS_USER_ACTION = true) {
    if (IS_USER_ACTION && !removedTransitionClass) {
        removeTransitionClass();
    }

    let blue1Top = window.pageYOffset / maxYOffset * blue1TargetTop;
    let blue3Top = blue3StartTop - (
        (blue3StartTop - blue3TargetTop) * (window.pageYOffset / maxYOffset)
    );

    blue1Top = Math.min(blue1Top, blue1TargetTop);
    blue3Top = Math.max(blue3Top, blue3TargetTop);

    setTransform(blue1, blue1Left, blue1Top);
    setTransform(white1, white1Left, blue1Top);
    setTransform(green1, green1Left, blue1Top);

    setTransform(blue3, blue3Left, blue3Top);
    setTransform(white3, white3Left, blue3Top);
    setTransform(green3, green3Left, blue3Top);

    blue3.style.transform = `translate(${blue3Left}px, ${blue3Top}px)`;
    white3.style.transform = `translate(${white3Left}px, ${blue3Top}px)`;
    green3.style.transform = `translate(${green3Left}px, ${blue3Top}px)`;
}

function setTransform(elem, x, y) {
    elem.style.transform = `translate(${x}px, ${y}px)`;
}

function getTransformLeftCoord(elem) {
    const cls = elem.className;

    if (!globalMatrix[cls] || !globalMatrix[cls].left) {
        let matrix = window.getComputedStyle(elem).transform;
        matrix = matrix.split(/\(|,\s|\)/).slice(1, 7);

        globalMatrix[cls] = {
            left: Number(matrix[4])
        };
    }

    return globalMatrix[cls].left;
}

function getTransformTopCoord(elem) {
    const cls = elem.className;

    if (!globalMatrix[cls] || !globalMatrix[cls].top) {
        let matrix = window.getComputedStyle(elem).transform;
        matrix = matrix.split(/\(|,\s|\)/).slice(1, 7);

        globalMatrix[cls] = {
            top: Number(matrix[5])
        };
    }

    return globalMatrix[cls].top;
}

function throttle(func, ms) {
    let isThrottled = false,
    savedArgs,
    savedThis;

    function wrapper() {

    if (isThrottled) { // (2)
        savedArgs = arguments;
        savedThis = this;
        return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;

    setTimeout(function() {
            isThrottled = false; // (3)
            if (savedArgs) {
            wrapper.apply(savedThis, savedArgs);
            savedArgs = savedThis = null;
            }
        }, ms);
    }

    return wrapper;
}
