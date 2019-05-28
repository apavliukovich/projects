import Utils from '../helpers/utils';

class Component {
    constructor() {
        this.request = Utils.parseRequestURL();
    }

    afterRender() {}
}

export default Component;