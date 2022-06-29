const reverse = document.querySelector('.reverse');
const reset = document.querySelector('.reset');
const start = document.querySelector('.start');
const saveBtn = document.querySelector('.save');
let timer;
let rev;
let saveArrLS = [];
const saveArea = document.querySelector('.save_area');


// Определяем начальное значение чисел (/ выведение из Local Storage) и их публикация
localStorage.getItem('ms') == null ? ms = 0 : ms = localStorage.getItem('ms');
const msText = () => ms < 10 ? document.querySelector('.ms').textContent = '0' + ms : document.querySelector('.ms').textContent = ms;
msText();

localStorage.getItem('sec') == null ? sec = 0 : sec = localStorage.getItem('sec');

const secText = () => sec < 10 ? document.querySelector('.sec').textContent = '0' + sec : document.querySelector('.sec').textContent = sec;
secText();

localStorage.getItem('min') == null ? min = 0 : min = localStorage.getItem('min');

const minText = () => min < 10 ? document.querySelector('.min').textContent = '0' + min : document.querySelector('.min').textContent = min;
minText();

localStorage.getItem('hour') == null ? hour = 0 : hour = localStorage.getItem('hour');

const hourText = () => hour < 10 ? document.querySelector('.hour').textContent = '0' + hour : document.querySelector('.hour').textContent = hour;
hourText();

// Есть ли поле сохранений в памяти?
if (localStorage.getItem('saveArrLS')) {
    saveArrLS = JSON.parse(localStorage.getItem('saveArrLS'));
    for(item of saveArrLS){
        let saveElement = document.createElement('p');
        saveElement.textContent = item;
        saveElement.classList.add('save_list');
        saveArea.prepend(saveElement);
    }
}

// Реверс?
if (localStorage.getItem('reverse') == 'true') {
    reverse.classList.add('rev_go');
}

// начальное значение кнопки старт и что делаем? (стоим/идем)
localStorage.getItem('startBut') == null ? document.querySelector('.start').textContent = 'START' : document.querySelector('.start').textContent = localStorage.getItem('startBut');
if (document.querySelector('.start').textContent == 'STOP') {
    checkReverse();
}



// Нажимаем на кнопку старт или реверс и запускаем проверку 
// в какую сторону двигаться таймеру
start.addEventListener('click', function () {
    if (this.innerText == 'START' || this.innerText == 'CONTINUE') {
        reverse.classList.contains('rev_go') == true ? clearInterval(rev) : clearInterval(timer);
        checkReverse();
        this.innerText = 'STOP';
        /////////////////////// LOCAL STORAGE ///////////////////////////////
        localStorage.setItem('startBut', document.querySelector('.start').textContent);
    } else if (this.innerText == 'STOP') {
        reverse.classList.contains('rev_go') == true ? clearInterval(rev) : clearInterval(timer);
        this.innerText = 'CONTINUE';
        /////////////////////// LOCAL STORAGE ///////////////////////////////
        localStorage.setItem('startBut', document.querySelector('.start').textContent);
    }
});


// Остановка противоположного таймера и изменение текста основной кнопки
reverse.addEventListener('click', function () {
    clearInterval(timer);
    if (start.textContent == 'STOP') {
        reverse.classList.contains('rev_go') == true ? clearInterval(rev) : clearInterval(timer);
        stage2();
    } else if (start.textContent == 'CONTINUE') {
        reverse.classList.contains('rev_go') == true ? clearInterval(rev) : clearInterval(timer);
        start.textContent = 'STOP'
        stage2();
    }

    function stage2() {
        // замена реверс-классов при нажатии на реверс
        if (reverse.classList.contains('rev_go')) {
            reverse.classList.remove('rev_go');
            /////////////////////// LOCAL STORAGE ///////////////////////////////
            localStorage.setItem('reverse', 'false');
            // запуск проверки с назначением действий
            checkReverse();
        } else if (reverse.classList.contains('rev_go') == false) {
            reverse.classList.add('rev_go');
            /////////////////////// LOCAL STORAGE ///////////////////////////////
            localStorage.setItem('reverse', 'true');
            checkReverse();
        }
    }
});

// Проверка есть ли реверс и назначение действий
function checkReverse() {
    save.style.visibility = 'visible';
    reverse.style.visibility = 'visible';
    reset.style.visibility = 'visible';
    if (reverse.classList.contains('rev_go') == false) {
        try {
            clearInterval(rev);
        } catch (error) {
            console.log('первый вызов. Отменять нечего')
        }
        timer = setInterval(() => {
            forvardGo();
            /////////////////////// LOCAL STORAGE ///////////////////////////////
            localStorage.setItem('ms', ms);
            localStorage.setItem('sec', sec);
            localStorage.setItem('min', min);
            localStorage.setItem('hour', hour);
        }, 10);
    } else if (reverse.classList.contains('rev_go') == true) {
        try {
            clearInterval(timer);
        } catch (error) {
            console.log('timer не включен')
        }
        rev = setInterval(() => {
            reverseGo();
            /////////////////////// LOCAL STORAGE ///////////////////////////////
            localStorage.setItem('hour', hour);
            localStorage.setItem('min', min);
            localStorage.setItem('sec', sec);
            localStorage.setItem('ms', ms);
        }, 10);
    }
}

// ForvardGo
function forvardGo() {
    if (hour < 24) {
        ms++;
        msText();
        if (ms > 99) {
            ms = 0;
            msText();
            sec++
            secText();
            if (sec > 59) {
                sec = 0;
                secText();
                min++;
                minText();
                if (min > 59) {
                    min = 0;
                    minText();
                    hour++;
                    hourText();
                }
            }
        }
    } else {
        resetAll();
    }
}

// REVERSE
function reverseGo() {
    if (ms + sec + min + hour > 0) {
        ms--;
        msText();
        if (ms < 0) {
            ms = 99;
            msText();
            sec--;
            secText();
            if (sec < 0) {
                sec = 59;
                secText();
                min--;
                minText();
                if (min < 0) {
                    min = 59;
                    minText();
                    hour--;
                    hourText();
                }
            }
        }
    } else {
        resetAll();
    }
}

// SAVE
saveBtn.addEventListener('click', function () {
    let saveElement = document.createElement('p');
    saveElement.textContent = `${document.querySelector('.hour').textContent}:${document.querySelector('.min').textContent}:${document.querySelector('.sec').textContent}:${document.querySelector('.ms').textContent}`;
    saveElement.classList.add('save_list');
    saveArea.prepend(saveElement);
    /////////////////////// LOCAL STORAGE ///////////////////////////////
    saveArrLS.push(saveElement.textContent);
    localStorage.setItem('saveArrLS', JSON.stringify(saveArrLS));
})

// DELETE или RESET

reset.addEventListener('click', resetSaveArea);

function resetSaveArea() {
    reset.style.visibility = 'hidden';
    for (i of document.querySelectorAll('.save_list')) {
        document.querySelectorAll('.save_list')[0].remove();
    }
    resetAll();
}

function resetAll() {
    start.innerHTML = 'START';
    if (reverse.classList.contains('rev_go')) {
        clearInterval(rev);
        reverse.classList.remove('rev_go');
    } else {
        clearInterval(timer);
    }
    ms = 0;
    sec = 0;
    min = 0;
    hour = 0;
    msText();
    secText();
    minText();
    hourText();
    localStorage.clear();
    save.style.visibility = 'hidden';
    reverse.style.visibility = 'hidden';
}
