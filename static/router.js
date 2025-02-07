import home from './components/home.js'
import chatbot from './components/chatbot.js'
import chatbot1 from './components/chatbot1.js'
import register from './components/register.js'
import login from './components/login.js'
import problems from './components/problems.js'
import playlist from './components/playlist.js'




const routes = [
    {path: '/', component: home},
    {path:'/api/chatbot', component: chatbot},
    {path:'/api/chatbot1', component: chatbot1},  
    {path: '/register', component: register},
    {path: '/login', component: login, name: 'login'},  
    {path: '/api/problems', component: problems},
    {path:'/api/playlist', component: playlist}

]


export default new VueRouter({
    routes,
}) 