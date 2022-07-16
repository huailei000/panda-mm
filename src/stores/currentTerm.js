import { observable, action } from 'mobx';

class currentTermStore {
  @observable term = null;
}

export default new currentTermStore();
