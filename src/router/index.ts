import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeScreen.vue'
import AboutView from '@/views/About.vue'
import Portfolio from '@/views/Portfolio.vue'
import Writing from '@/views/Writing.vue'
import Flags from '@/views/Flags.vue'
import AllPosts from '@/views/AllPosts.vue'
import Post from '@/views/Posts/Post.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: Portfolio
    },
    {
      path: '/writing',
      name: 'writing',
      component: Writing,
      props: true,
      children:[
        {
          path: 'python',
          name: 'python',
          component: Post,
        }
      ]
    },
    {
      path: '/flags',
      name: 'flags',
      component: Flags
    },
  ]
})

export default router