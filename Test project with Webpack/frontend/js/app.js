import '../styles/app';
import '../styles/quizStyle';

import Utils from './helpers/utils';

import Header from './views/partials/header';
import Footer from './views/partials/footer';

import About from './views/pages/about';
import Error404 from './views/pages/error404';

import Quiz from './views/pages/quiz';

const Routes = {
    '/': About,
    '/quiz': Quiz
};

function router() {
    const headerContainer = document.getElementsByClassName('header-container')[0],
        contentContainer = document.getElementsByClassName('content-container')[0],
        footerContainer = document.getElementsByClassName('footer-container')[0],
        header = new Header(),
        footer = new Footer();

    header.render().then(html => {
        headerContainer.innerHTML = html;
        header.afterRender();
    });

    const request = Utils.parseRequestURL(),
        parsedURL = `/${request.resource || ''}`,
        page = Routes[parsedURL] ? new Routes[parsedURL]() : new Error404();

            page.render().then(html => {
            contentContainer.innerHTML = html;
            page.afterRender();
        });

    footer.render().then(html => {
        footerContainer.innerHTML = html;
        footer.afterRender();
    });
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);

module.hot && module.hot.accept(router());