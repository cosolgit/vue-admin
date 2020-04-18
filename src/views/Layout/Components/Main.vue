<template>
    <div id="main-wrap">
        <div class="main-content">
            <div class="content">
                <!--子路由显示区域-->
                <keep-alive>
                    <!--需要缓存-->
                    <router-view v-if="$route.meta.keepAlive"/>
                </keep-alive>
                <!--不需要缓存-->
                <router-view v-if="!$route.meta.keepAlive"/>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    name: 'layoutMain',
}
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";
#main-wrap {
    height: 100vh;
    // position: fixed;
    // left: $navMenu;
    // top: 75px;
    // right: 0;
    // bottom: 0;
    // border: 30px solid #f7f7f7;
    // border-bottom: none;
    // -webkit-box-sizing: border;
}
.main-content {
    width: 100%;
    height: 100%;
    padding-top: $layoutHeader + 30;
    padding-right: 30px;
    @include webkit(box-sizing,border-box);
    @include webkit(transition, all .3s ease 0s);
}
.content {
    width: 100%;
    height: 100%;
    padding: 30px 30px 0 30px;
    background-color: #fff;
    @include webkit(box-sizing,border-box);
}
.open {
    .main-content { padding-left: $navMenu + 30; }
}
.close {
    .main-content { padding-left: $navMenuMin + 30; }
}
</style>