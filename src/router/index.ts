import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeScreen.vue'
import AboutView from '@/views/About.vue'
import Portfolio from '@/views/Portfolio.vue'
import Writing from '@/views/Writing.vue'
import Flags from '@/views/Flags.vue'
import Post from '@/views/Posts/Post.vue'
import AllPosts from '@/views/Posts/AllPosts.vue'

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
      children:[
        {
          path: 'allposts',
          name: 'allposts',
          component: AllPosts
        },
        {
          path: 'python',
          name: 'python',
          component: Post,
        },
        {
          path: 'post1',
          name: 'post1',
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