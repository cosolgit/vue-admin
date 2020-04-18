import service from "@/utils/request";
/**
 * 列表
 */
export function GetList(data){
    return service.request({
        url:"/news/getList/",
        method:"post",
        data
    })
}
/**
 * 新增
 */
export function AddInfo(data){
    return service.request({
        url:"/news/add/",
        method:"post",
        data
    })
}
/**
 * 编辑
 */
export function EditInfo(data){
    return service.request({
        url:"/news/editInfo/",
        method:"post",
        data
    })
}
/**
 * 删除
 */
export function DeleteInfo(data){
    return service.request({
        url:"/news/deleteInfo/",
        method:"post",
        data
    })
}
 /**
  * 一级分类添加
  */
export function AddFirstCategory(data){
    return service.request({
        url:"/news/addFirstCategory/",
        method:"post",
        data
    })
}
 /**
  * 子级分类添加
  */
 export function AddChildrenCategory(data){
    return service.request({
        url:"/news/addChildrenCategory/",
        method:"post",
        data
    })
}
/**
 * 获取分类
 */
export function GetCategory(){
    return service.request({
        url:"/news/getCategory/",
        method:"post"
    })
}
/**
 * 获取全部分类(包含子级)
 */
export function GetCategoryAll(){
    return service.request({
        url:"/news/getCategoryAll/",
        method:"post"
    })
}
/**
 * 删除分类
 */
export function DeleteCategory(data){
    return service.request({
        url:"/news/deleteCategory/",
        method:"post",
        data
    })
}
/**
 * 编辑分类
 */
export function EditCategory(data){
    return service.request({
        method: "post",
        url: "/news/editCategory/",
        data
    })
}