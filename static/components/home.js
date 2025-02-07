export default {
  template: `
    <div class="min-h-screen bg-gray-900 text-gray-100">
      <!-- Hero Section -->
      <div class="relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 py-16">
        <div class="container mx-auto px-4">
          <div class="text-center">
            <h1 class="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Master DSA with AI Teaching Assistant
            </h1>
            <p class="mx-auto mt-6 max-w-2xl text-xl text-gray-300">
              Learn Data Structures & Algorithms through interactive Socratic dialogue, powered by advanced AI.
            </p>
            <div class="mt-10">
              <button @click="startChat" 
                class="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors duration-200">
                Start Learning
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="py-16 px-4">
        <div class="container mx-auto">
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <!-- AI Chatbot Card -->
            <div class="relative group">
              <div class="rounded-xl bg-gray-800 p-6 shadow-lg ring-1 ring-gray-700 hover:ring-indigo-500 transition-all duration-300">
                <div class="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-indigo-600">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">AI-Powered Learning</h3>
                <p class="text-gray-400">Engage in dynamic conversations with our AI tutor using the Socratic method for deeper understanding.</p>
              </div>
            </div>

            <!-- Interactive Problems Card -->
            <div class="relative group">
              <div class="rounded-xl bg-gray-800 p-6 shadow-lg ring-1 ring-gray-700 hover:ring-indigo-500 transition-all duration-300">
                <div class="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-green-600">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">Practice Problems</h3>
                <p class="text-gray-400">Tackle curated coding challenges with real-time feedback and detailed explanations.</p>
              </div>
            </div>

            <!-- Study Materials Card -->
            <div class="relative group">
              <div class="rounded-xl bg-gray-800 p-6 shadow-lg ring-1 ring-gray-700 hover:ring-indigo-500 transition-all duration-300">
                <div class="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-600">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">Study Materials</h3>
                <p class="text-gray-400">Access comprehensive notes and learning paths designed for optimal progression.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Topics Section -->
      <div class="py-16 px-4 bg-gray-800">
        <div class="container mx-auto">
          <h2 class="text-3xl font-bold text-center text-white mb-12">Start Your Learning Journey</h2>
          <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div v-for="(topic, index) in topics" :key="index" 
              class="rounded-lg bg-gray-900 p-6 shadow-xl hover:transform hover:scale-105 transition-all duration-300">
              <h3 class="text-xl font-semibold text-white mb-3">{{ topic.name }}</h3>
              <p class="text-gray-400 mb-6">{{ topic.description }}</p>
              <button @click="goToTopic(topic.name)" 
                class="w-full px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200">
                Explore {{ topic.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Disclaimer Banner -->
      <div class="bg-red-900/50 py-3 px-4">
        <p class="text-center text-sm text-red-200">
          <strong>Disclaimer:</strong> The AI chatbot may make mistakes. Always verify information with trusted sources.
        </p>
      </div>
    </div>
  `,
  data() {
    return {
      topics: [
        { 
          name: "Problems",
          description: "Challenge yourself with algorithmic problems ranging from easy to hard difficulty levels."
        },
        { 
          name: "Notes",
          description: "Access comprehensive documentation and explanations of core DSA concepts."
        },
        { 
          name: "Playlists",
          description: "Follow structured learning paths designed to build your skills progressively."
        },
      ],
    };
  },
  methods: {
    startChat() {
      if (this.is_logged_in) {
        this.$router.push('/api/chatbot');
      } else {
        this.showLoginWarning();
      }
    },
    goToTopic(topic) {
      if (this.is_logged_in) {
        if (topic === 'Problems') {
          this.$router.push('/api/problems');
        } else if (topic === 'Notes') {
          window.open('https://drive.google.com/drive/folders/1-dPY1TGo-odvVi40qHi7IrX3Q8-8PpaP?usp=sharing', '_blank');
        } else if (topic === 'Playlists') {
          this.$router.push('/api/playlist');
        }
      } else {
        this.showLoginWarning();
      }
    },
    showLoginWarning() {
      Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'Please log in first to start learning.',
        confirmButtonText: 'Log In',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        background: '#1f2937',
        color: '#fff'
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push('/login');
        }
      });
    },
    loadPreviousChat(sessionId) {
      fetch(`/api/chat_sessions/${sessionId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to load previous chat');
          }
          return response.json();
        })
        .then(data => {
          this.messages = data.map((session) => ({
            userMessage: session.user_message,
            assistantMessage: session.assistant_response,
          }));
          this.$nextTick(() => {
            const chatWindow = this.$refs.chatWindow;
            chatWindow.scrollTop = chatWindow.scrollHeight;
          });
        })
        .catch(error => {
          console.error('Error loading previous chat:', error);
          alert('Failed to load previous chat. Please try again.');
        });
    },
  },
  computed: {
    is_logged_in() {
      return localStorage.getItem('username') !== null;
    },
  },
};