import Component from '../../views/component';

import FooterTemplate from '../../../templates/partials/footer';

class Footer extends Component {
    render() {
        return new Promise(resolve => resolve(FooterTemplate()));
    }
}

export default Footer;