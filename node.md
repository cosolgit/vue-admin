### 24-3
- Object.assign第一层是深拷贝,第二层是浅拷贝

### 24-5
- ref的两种写法
- 组件通讯
    - 父子组件通讯props,emit , .sync
        - props:<Dialog :flag="data"/>
        - .sync:<Dialog :flag.sync="data"/>   子:emit("update:flag",111)
        - props:<Dialog :flag="data"  @show="showA"/>showA=(data)=>{}     子:emit("show",{a,b,c})
    - 中央事件
        - 创建实例 
            - import Vue from "vue";export default new Vue();
        - 注册EventBus.$on("AA",()=>{}) ,触发 EventBus.$emit("AA",{a,b,c})
    - vuex  watch
    - $attrs,$listeners
        - 传属性(props接收相同名称的属性,将不被读取):父<A aaa="111"/> 子:attrs接收 <B v-bind="$attrs"/> 孙:attrs接收
        - 传事件:父 <A v-on:upaa="busEvent"/> 子:$listeners <B v-on="$listeners"/> 孙:<div @click="buc"/> buc=()=>{emit("upaa")} 
    - provide,inject 
        - 父:provide("customVal","我是父组件"),
        - 子:inject("customVal")
    - $parent ,$children,ref
 



### 25-3按钮权限
- 自定义指令,5种状态(操作DOM)
    - bind:只调用一次，指令第一次绑定到元素时候调用，用这个钩子可以定义一个绑定时执行一次的初始化动作。
    - inserted:被绑定的元素插入父节点的时候调用(父节点存在即可调用，不必存在document中)
    - update:被绑定与元素所在模板更新时调用，而且无论绑定值是否有变化，通过比较更新前后的绑定值，忽略不必要的模板更新- componentUpdate:被绑定的元素所在模板完成一次更新更新周期的时候调用
    - unbind:只调用一次，指令月元素解绑的时候调用自定义指令，5种状态（操作DOM元素）
    ***
        Vue.directive("hello",{
            //el.parentNode not defined
            bind:function(el,bingind,vnode){
                el.style["color"] = bingind.value;
                console.log("1-bind");
                bingind.def.aaa();
            },
            //el.parentNode defined
            insert:function(){console.log("2-insert)},
            
            update:function(){console.log("3-update)},
            componentUpdate:function(){console.log("4-componentUpdate)},
            unbind:function(){console.log("5-unbind)},
            aaa:function(){}
        }
    ***

    
### 26 组件缓存
- keep-alive 
    - include:字符串或正则,只有名称匹配的组件会被缓存
    - exclude:字符串或正则,名称匹配的组件不会被缓存
    - max:数字,最多可以缓存多少组件实例
    - 生命周期
        - onActivated 进入页面;onDeactivated离开页面  顺序created-mounted-activated
        - 注: 组件被缓存了,有些变量需要重新加载(编辑页等);需要在onActivated内重新获取

### 26-1bug修复,监听路由改变,环境变量参数配置
- 导航栏default-active随路由变化变化
    - 监听route.path的改变
   


对象动态键名{[xx]:123}
Xshell5 Xftp5
nginx看那个ppt(专门的nginx视频看)