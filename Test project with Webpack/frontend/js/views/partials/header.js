import Component from '../../views/component';

import HeaderTemplate from '../../../templates/partials/header.hbs';

class Header extends Component {
    render() {
        const resource = this.request.resource;

        return new Promise(resolve => resolve(HeaderTemplate({
            isAboutPage: !resource,
            isQuizPage: (resource === 'quiz')
        })));
    }
}

export default Header;