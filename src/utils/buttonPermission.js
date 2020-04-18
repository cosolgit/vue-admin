import store from "../store/index";

export function buttonPermission(permission){
    let button=store.getters["app/buttonPermission"];
    return button.indexOf(permission)!=-1;
}