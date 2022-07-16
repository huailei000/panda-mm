/**
 * Created by Rayr Lee on 2017/12/18.
 */

export default {
    get(k) {
        return window.localStorage.getItem(`admin_class_${k}`);
    },
    set(k, v) {
        window.localStorage.setItem(`admin_class_${k}`, v);
    },
    delete(k) {
        window.localStorage.removeItem(`admin_class_${k}`);
    }
};
