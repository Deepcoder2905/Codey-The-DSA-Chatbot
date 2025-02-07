export default {
  template: `
    <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="max-w-7xl mx-auto text-center mb-12">
            <h1 class="text-4xl font-bold text-white mb-4">🚀 DSA Challenge Zone 🚀</h1>
            <p class="text-xl text-gray-400">Level up your coding skills! Pick a topic, solve problems, and track your progress.</p>
        </div>

        <!-- Problems List -->
        <div class="max-w-4xl mx-auto space-y-6">
            <div v-for="(problems, topic) in problemsList" :key="topic" class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <!-- Topic Header -->
                <button 
                    class="w-full px-6 py-4 flex items-center justify-between bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                    @click="toggleTopic(topic)"
                >
                    <h2 class="text-lg font-semibold text-white">{{ topic }}</h2>
                    <span class="text-gray-300 transform transition-transform duration-200"
                          :class="{ 'rotate-180': expandedTopics.includes(topic) }">
                        ▼
                    </span>
                </button>

                <!-- Problems -->
                <div v-show="expandedTopics.includes(topic)" 
                     class="border-t border-gray-600">
                    <ul class="divide-y divide-gray-700">
                        <li v-for="(problem, index) in problems" 
                            :key="index"
                            class="px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition-colors duration-200"
                            :class="{'bg-gray-700/50': attempted[problem['Problem']]}">
                            
                            <a :href="problem['Link']" 
                               target="_blank"
                               class="text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                                {{ problem['Problem'] }}
                            </a>

                            <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox"
                                       :id="'checkbox-' + topic + '-' + index"
                                       v-model="attempted[problem['Problem']]"
                                       @change="updateAttempted(problem['Problem'], attempted[problem['Problem']])"
                                       class="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-500 bg-gray-700 focus:ring-indigo-500">
                                <span class="text-gray-300 text-sm">Attempted</span>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    `,
  data() {
    return {
      problemsList: {},
      expandedTopics: [],
      attempted: {},
      username: localStorage.getItem('username'),
      userId: null
    };
  },
  methods: {
    fetchUserId() {
      fetch(`/api/user_id?username=${this.username}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('User not found');
        })
        .then(data => {
          this.userId = data.user_id;
          this.fetchProblems();
        })
        .catch(error => {
          console.error('Error fetching user ID:', error);
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to load user data. Please try logging in again!',
          });
        });
    },
    fetchProblems() {
      if (!this.userId) return;
      fetch(`/api/problems?user_id=${this.userId}`)
        .then(response => response.json())
        .then(data => {
          this.problemsList = data;
          this.initializeAttemptedStatus();
        })
        .catch(error => {
          console.error('Error fetching problems:', error);
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to load problems. Please try again later!',
          });
        });
    },
    toggleTopic(topic) {
      if (this.expandedTopics.includes(topic)) {
        this.expandedTopics = this.expandedTopics.filter(t => t !== topic);
      } else {
        this.expandedTopics.push(topic);
      }
    },
    initializeAttemptedStatus() {
      for (const topic in this.problemsList) {
        this.problemsList[topic].forEach(problem => {
          this.$set(this.attempted, problem['Problem'], problem['Attempted']);
        });
      }
    },
    updateAttempted(problem, attemptedStatus) {
      if (!this.userId) return;
      fetch('/api/attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: this.userId,
          problem: problem,
          attempted: attemptedStatus
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        this.$swal({
          icon: 'success',
          title: 'Progress Saved!',
          text: attemptedStatus ? 'Keep up the great work!' : 'No worries, you can always try again!',
          timer: 1500,
          showConfirmButton: false
        });
      })
      .catch(error => {
        console.error('Error saving attempt:', error);
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to save your progress. Please try again!',
        });
      });
    }
  },
  mounted() {
    this.fetchUserId();
  }
};