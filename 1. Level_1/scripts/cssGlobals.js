
/** */
function setVhVar() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVhVar();
window.addEventListener('resize', setVhVar);
window.addEventListener('orientationchange', setVhVar);

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