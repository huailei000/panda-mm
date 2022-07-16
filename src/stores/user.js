import {observable, action} from 'mobx';

class UserStore {
    @observable user = null;
    @observable isLogin = false;
    @observable curTitle = null;

    @action initUser(res) {
        this.user = res;
        this.isLogin = true;
    }

    @action clearUser() {
        this.user = null;
        this.isLogin = false;
    }
}

export default new UserStore();
