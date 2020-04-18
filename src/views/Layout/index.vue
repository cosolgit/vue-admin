<template>
    <div id="layout" :class="[menuStates?'close':'open']">
        <LayoutHeader />
        <LayoutMain />
        <LayoutNav />
    </div>
</template>

<script>
import LayoutHeader from './Components/Header';
import LayoutNav from './Components/Nav';
import LayoutMain from './Components/Main';
import { computed } from '@vue/composition-api';
export default {
    name: 'layout',
    components: {LayoutHeader, LayoutMain, LayoutNav},
    setup(props,{root}){
        const menuStates=computed(()=>root.$store.state.app.isCollapse);
        return {
            menuStates
        }
    }
}
</script>

<style lang="scss" scoped>
</style>