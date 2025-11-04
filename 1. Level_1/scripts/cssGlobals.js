const THEME = 'light';
const htmEL = document.documentElement;

if (htmEL){
    if  (htmEL.getAttribute('future-theme') !== THEME){
        DOCUMENT_EL.setAttribute('future-theme', THEME);
    }
}


function setVhVar() {
  const vh = window.innerHeight * 0.01;
  if (htmEL)
    htmEL.style.setProperty('--vh', `${vh}px`);
}

setVhVar();
window.addEventListener('resize', setVhVar);
window.addEventListener('orientationchange', setVhVar);

/**light modus afdwingne */



export const CSSUTILS = {
    'displayNone' : 'd-none',
    'displayFlex' : 'd-flex'
}

export const CSSSTATES = {
    'loaderHidden' : 'loading-screen--hidden'
}

const CSSVARS = {
    ...CSSUTILS,
    ...CSSSTATES
}


export default CSSVARS;