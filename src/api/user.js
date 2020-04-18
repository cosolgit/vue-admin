import service from '@/utils/request';


export function GetRole(data={}){
    return service.request({
        method:"post",
        url:"/role/",
        data
    })
}

export function UserAdd(data={}){
    return service.request({
        method:"post",
        url:"/user/add/",
        data
    })
}

export function UserDel(data={}){
    return service.request({
        method:"post",
        url:"/user/delete/",
        data
    })
}


export function UserActives(data={}){
    return service.request({
        method:"post",
        url:"/user/actives/",
        data
    })
}

export function UserEdit(data={}){
    return service.request({
        method:"post",
        url:"/user/edit/",
        data
    })
}

//系统列表
export function GetSystem(data={}){
    return service.request({
        method:"post",
        url:"/system/",
        data
    })
}



//按钮权限
export function GetPermButton(data={}){
    return service.request({
        method:"post",
        url:"/permButton/",
        data
    })
}