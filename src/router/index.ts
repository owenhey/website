import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeScreen.vue'
import AboutView from '@/views/About.vue'
import Portfolio from '@/views/Portfolio.vue'
import Writing from '@/views/Writing.vue'
import Flags from '@/views/Flags.vue'
import Post from '@/views/Posts/Post.vue'
import AllPosts from '@/views/Posts/AllPosts.vue'
import GlobeGL from '@/views/GlobeGL.vue'
import Cluedle from '@/views/Cluedle.vue'
import WordGame2 from '@/views/WordGame2.vue'

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
      path: '/words',
      redirect: '/cluedle'
    },
    {
      path: '/cluedle',
      name: 'cluedle',
      component: Cluedle
    },
    {
      path: '/wordgame2',
      name: 'wordgame2',
      component: WordGame2
    },
    {
      path: '/globe',
      name: 'globe',
      component: GlobeGL
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
          path: 'steelroserevolution',
          name: 'steelroserevolution',
          component: Post,
        },
        {
          path: 'planets',
          name: 'planets',
          component: Post,
        },
        {
          path: 'daily-data',
          name: 'daily-data',
          component: Post,
        },
        {
          path: 'post-creation',
          name: 'post-creation',
          component: Post,
        },
        {
          path: 'rune-algorithm',
          name: 'rune-algorithm',
          component: Post,
        },
        {
          path: 'charchase',
          name: 'charchase',
          component: Post,
        },
        {
          path: 'prototypes',
          name: 'prototypes',
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