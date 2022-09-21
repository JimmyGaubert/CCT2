const root = document.getElementById('root')
const exitBtn = document.getElementById('exit')
const langBtn = document.getElementById('lang')
const flags = document.getElementById('flags')
const flagEn = document.getElementById('en')
const flagFr = document.getElementById('fr')
const flagEs = document.getElementById('es')
const flagIt = document.getElementById('it')
const flagRu = document.getElementById('ru')
const flagDe = document.getElementById('de')
const flagTr = document.getElementById('tr')
const suppBtn = document.getElementById('supp')

const initialization = async () => {
    await window.stages.init()
}

exitBtn.addEventListener('click', () => {
    window.buttons.exit()
})
let langdiv = false;
langBtn.addEventListener('click', () => {
    if (langdiv === false) {
        flags.style.display = 'flex'
        langdiv = true;
    } else {
        flags.style.display = 'none'
        langdiv = false;
    }
})
async function changeLang(l) {
    flags.style.display = 'none'
    langdiv = false;
    root.appendChild(document.createElement("br"))
    switch (l) {
        case 'en':
            window.buttons.switchToEn(l)
            break;
        case 'fr':
            window.buttons.switchToFr(l)
            break;
        case 'es':
            window.buttons.switchToEs(l)
            break;
        case 'it':
            window.buttons.switchToIt(l)
            break;
        case 'ru':
            window.buttons.switchToRu(l)
            break;
        case 'de':
            window.buttons.switchToDe(l)
            break;
        case 'tr':
            window.buttons.switchToTr(l)
            break;
    }
    let sentence = document.createElement('p');
    sentence.innerHTML = `Language switched to ${l}`;
    sentence.setAttribute('class', 'white')
    root.appendChild(sentence);
    root.scrollTo(0, root.scrollHeight);
}
flagEn.addEventListener('click', () => {
    changeLang('en')
})
flagFr.addEventListener('click', () => {
    changeLang('fr')
})
flagEs.addEventListener('click', () => {
    changeLang('es')
})
flagIt.addEventListener('click', () => {
    changeLang('it')
})
flagRu.addEventListener('click', () => {
    changeLang('ru')
})
flagDe.addEventListener('click', () => {
    changeLang('de')
})
flagTr.addEventListener('click', () => {
    changeLang('tr')
})

suppBtn.addEventListener('click', (event) => {
    window.buttons.support()
})
initialization()
window.msg.receive("fromMain", async (data) => {
    switch (data) {
        case 'CLEAN_IT':
            root.textContent = '';
            break;
        default:
            root.appendChild(document.createElement("br"))
            switch (data.split('||')[1]) {
                case 'purple':
                    let purple = document.createElement('p');
                    purple.innerHTML = `${data.split('||')[0]}`;
                    purple.setAttribute('class', 'purple')
                    root.appendChild(purple);
                    break;
                case 'cyan':
                    let cyan = document.createElement('p');
                    cyan.innerHTML = `${data.split('||')[0]}`;
                    cyan.setAttribute('class', 'cyan')
                    root.appendChild(cyan);
                    break;
                case 'green':
                    let green = document.createElement('p');
                    green.innerHTML = `${data.split('||')[0]}`;
                    green.setAttribute('class', 'green')
                    root.appendChild(green);
                    break;
                case 'blue':
                    let blue = document.createElement('p');
                    blue.innerHTML = `${data.split('||')[0]}`;
                    blue.setAttribute('class', 'blue')
                    root.appendChild(blue);
                    break;
                default:
                    let white = document.createElement('p');
                    white.innerHTML = `${data.split('||')[0]}`;
                    white.setAttribute('class', 'white')
                    root.appendChild(white);
                    break;
            }
            root.scrollTo(0, root.scrollHeight);
            break;
    }
});