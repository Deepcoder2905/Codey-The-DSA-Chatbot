export default {
  template: `
  <div class="flex h-screen bg-gray-900">
      <!-- Main Content Area -->
      <div class="flex-1 flex">
          <!-- Problem and Chat Area -->
          <div class="w-1/2 flex flex-col bg-gray-800 border-r border-gray-700">
              <!-- Chat Messages -->
              <div class="flex-1 overflow-y-auto px-4 py-6" ref="chatWindow">
                  <div class="space-y-6">
                      <div v-for="(message, index) in currentConversation" 
                          :key="index"
                          class="flex gap-4"
                          :class="message.sender === 'user' ? 'justify-end' : 'justify-start'">
                          
                          <div v-if="message.sender === 'assistant'" 
                              class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                              DSA
                          </div>

                          <div class="max-w-[80%] rounded-2xl px-4 py-3"
                              :class="message.sender === 'user' ? 
                                  'bg-indigo-600 text-white' : 
                                  'bg-gray-800 text-gray-200'">
                              <div class="whitespace-pre-wrap">{{ message.text }}</div>
                          </div>

                          <div v-if="message.sender === 'user'" 
                              class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white flex-shrink-0">
                              U
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Input Area -->
              <div class="border-t border-gray-700 p-4">
                  <div v-if="!problemStarted" class="mb-4">
                      <button @click="startProblem" 
                          class="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200">
                          Start New DSA Problem
                      </button>
                  </div>
                  
                  <form v-else @submit.prevent="sendMessage" class="space-y-2">
                      <div class="flex gap-2">
                          <button 
                              type="button" 
                              @click="requestHint"
                              class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200">
                              Request Hint
                          </button>
                          <button 
                              type="button" 
                              @click="requestTestCases"
                              class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                              Test Cases
                          </button>
                          <button 
                              type="button" 
                              @click="showSolution"
                              class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200">
                              Show Solution
                          </button>
                      </div>
                  </form>
              </div>
          </div>

          <!-- Code Editor Area -->
          <div class="w-1/2 flex flex-col bg-gray-900">
              <div class="p-4 bg-gray-800 border-b border-gray-700">
                  <h2 class="text-lg font-semibold text-white">Code Editor</h2>
              </div>
              <div class="flex-1 p-4">
                  <textarea
                      v-model="code"
                      class="w-full h-full bg-gray-800 text-white font-mono p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Write your solution here..."
                  ></textarea>
              </div>
              <div class="p-4 border-t border-gray-700">
                  <button 
                      @click="runCode"
                      class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200">
                      Run Code
                  </button>
              </div>
          </div>
      </div>
  </div>
  `,
  data() {
    return {
      newMessage: '',
      currentConversation: [],
      code: '',
      problemStarted: false
    };
  },
  methods: {
    startProblem() {
      this.problemStarted = true;
      this.sendToBot("",'question');
    },

    sendMessage() {
      if (this.newMessage.trim()) {
        const userMessage = this.newMessage;
        this.sendToBot(userMessage);
      }
    },

    requestHint() {
      this.sendToBot("Can you provide a hint for this problem?",'hint');
    },

    requestTestCases() {
      this.sendToBot("",'test_cases');
    },

    showSolution() {
      this.sendToBot("",'solution');
    },

    runCode() {
      if (this.code.trim()) {
        this.sendToBot(`Here's my code, can you check it and provide feedback?\n\n${this.code}`,'run_code');
      }
    },

    sendToBot(message,action) {
      this.newMessage = '';

      fetch('/api/chatbot1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: message,
          code: this.code,
          action:action
        }),
      })
        .then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              window.location.href = '/login';
              return;
            }
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.response) {
            this.currentConversation.push({ 
              sender: 'assistant', 
              text: data.response 
            });
            this.$nextTick(() => {
              const chatWindow = this.$refs.chatWindow;
              chatWindow.scrollTop = chatWindow.scrollHeight;
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          this.currentConversation.push({
            sender: 'assistant',
            text: 'There was an error processing your request. Please try again later.',
          });
        });
    }
  },
  watch: {
    currentConversation: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          const chatWindow = this.$refs.chatWindow;
          chatWindow.scrollTop = chatWindow.scrollHeight;
        });
      }
    }
  }
};