export default {
  template: `
    <div class="min-h-screen bg-gray-900">
      <!-- Hero Section -->
      <div class="relative bg-gradient-to-r from-gray-800 to-gray-900 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-4">
            🚀 DSA Playlists
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-xl text-gray-300">
            Level up your coding skills with these awesome Data Structures and Algorithms playlists!
          </p>
          <div class="mt-4 flex justify-center">
            <div class="w-24 h-1 bg-indigo-500 rounded"></div>
          </div>
          <p class="mt-6 text-lg text-gray-400">
            Hand-picked by coding experts to supercharge your learning journey. 🎓💻
          </p>
        </div>
      </div>

      <!-- Playlists Grid -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 class="text-center text-3xl font-bold text-white mb-12">
          🔥 Top Playlists 🔥
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(playlist, index) in playlists" 
               :key="index"
               class="bg-gray-800 rounded-lg shadow-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
            
            <!-- Card Body -->
            <div class="p-6 flex flex-col h-full">
              <h3 class="text-xl font-semibold text-white mb-3">
                {{ playlist.title }}
              </h3>
              <p class="text-gray-400 mb-6 flex-grow">
                {{ playlist.description }}
              </p>
              
              <!-- Video Count -->
              <div class="flex items-center text-gray-500 mb-4">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span class="text-sm">{{ playlist.videoCount }} videos</span>
              </div>
              
              <!-- Watch Button -->
              <a :href="playlist.link" 
                 target="_blank"
                 class="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      playlists: [],
    };
  },

  methods: {
    async fetchPlaylists() {
      try {
        const response = await fetch('/api/playlists');
        this.playlists = await response.json();
      } catch (error) {
        console.error('Error fetching playlists:', error);
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load playlists. Please try again later!',
          background: '#1f2937',
          color: '#fff',
          confirmButtonColor: '#4f46e5'
        });
      }
    },
  },

  mounted() {
    this.fetchPlaylists();
  },
};