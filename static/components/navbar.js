export default {
    template: `
      <nav class="bg-gray-900 border-b border-gray-800">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex items-center justify-between h-16">
                  <!-- Logo/Brand -->
                  <div class="flex-shrink-0">
                      <a href="/" class="text-2xl font-bold text-indigo-500">Codey</a>
                  </div>

                  <!-- Mobile menu button -->
                  <div class="flex md:hidden">
                      <button @click="isMobileMenuOpen = !isMobileMenuOpen" 
                          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800">
                          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                  </div>

                  <!-- Desktop menu -->
                  <div class="hidden md:flex md:items-center md:space-x-4">
                      <!-- Not logged in links -->
                      <template v-if="!is_logged_in">
                          <button @click="home" 
                              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                              Home
                          </button>
                          <button @click="login" 
                              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                              Login
                          </button>
                          <button @click="register" 
                              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                              Register
                          </button>
                      </template>

                      <!-- Logged in links -->
                      <template v-if="is_logged_in">
                          <button @click="goToProblems" 
                              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                              Problems
                          </button>
                          <button @click="goToNotes" 
                              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                              Notes
                          </button>
                          <button @click="goToPlaylist" 
                              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                              Playlist
                          </button>
                          <button @click="dashboard" 
                              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                              Chatbot
                          </button>
                          <button @click="chaty" 
                              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                              Practice Bot
                          </button>
                          <button @click="logout" 
                              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                              Logout
                          </button>
                      </template>
                  </div>
              </div>

              <!-- Mobile menu -->
              <div class="md:hidden" v-show="isMobileMenuOpen">
                  <div class="px-2 pt-2 pb-3 space-y-1">
                      <!-- Not logged in mobile links -->
                      <template v-if="!is_logged_in">
                          <button @click="home" 
                              class="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium w-full text-left">
                              Home
                          </button>
                          <button @click="login" 
                              class="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium w-full text-left">
                              Login
                          </button>
                          <button @click="register" 
                              class="block bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-base font-medium w-full text-left">
                              Register
                          </button>
                      </template>

                      <!-- Logged in mobile links -->
                      <template v-if="is_logged_in">
                          <button @click="goToProblems" 
                              class="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium w-full text-left">
                              Problems
                          </button>
                          <button @click="goToNotes" 
                              class="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium w-full text-left">
                              Notes
                          </button>
                          <button @click="goToPlaylist" 
                              class="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium w-full text-left">
                              Playlist
                          </button>
                          <button @click="dashboard" 
                              class="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium w-full text-left">
                              Chatbot
                          </button>
                          <button @click="chaty" 
                              class="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium w-full text-left">
                              Practice Bot
                          </button>
                          <button @click="logout" 
                              class="block bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium w-full text-left">
                              Logout
                          </button>
                      </template>
                  </div>
              </div>
          </div>
      </nav>
    `,
    data() {
        return {
            isMobileMenuOpen: false,
            role: [],
        };
    },
    methods: {
        logout() {
            localStorage.removeItem('username');
            this.isLoggedIn = false;
            this.$router.push('/');
        },
        dashboard() {
            this.$router.push('/api/chatbot');
        },
        chaty() {
            this.$router.push('/api/chatbot1');
        },
        home() {
            this.$router.push('/');
        },
        register() {
            this.$router.push('/register');
        },
        login() {
            this.$router.push('/login');
        },
        goToProblems() {
            this.$router.push('/api/problems');
        },
        goToNotes() {
            window.open('https://drive.google.com/drive/folders/1-dPY1TGo-odvVi40qHi7IrX3Q8-8PpaP?usp=sharing', '_blank');
        },
        goToPlaylist() {
            this.$router.push('/api/playlist');
        }
    },
    computed: {
        is_logged_in() {
            return localStorage.getItem('username') !== null;
        },
    },
};