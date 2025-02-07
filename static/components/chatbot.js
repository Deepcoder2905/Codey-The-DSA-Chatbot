export default {
  template: `
  <div class="flex h-screen bg-gray-900">
      <!-- Sidebar -->
      <div class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <!-- New Chat Button -->
          <div class="p-4">
              <button @click="startNewChat" 
                  class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Chat
              </button>
          </div>

          <!-- Chat History -->
          <div class="flex-1 overflow-y-auto">
              <h3 class="px-4 py-2 text-sm font-medium text-gray-400">Chat History</h3>
              <div class="space-y-1 px-2">
                  <button v-for="(session, index) in chatSessions" 
                      :key="index"
                      @click="loadPreviousChat(session.id)"
                      class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition-colors duration-200 text-sm truncate">
                      <div class="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {{ getFirstUserMessage(session.conversation) }}
                      </div>
                  </button>
              </div>
          </div>
      </div>

      <!-- Main Chat Area -->
      <div class="flex-1 flex flex-col bg-gray-900">
          <!-- Chat Messages -->
          <div class="flex-1 overflow-y-auto px-4 py-6" ref="chatWindow">
              <div class="max-w-3xl mx-auto space-y-6">
                  <div v-for="(message, index) in currentConversation" 
                      :key="index"
                      class="flex gap-4"
                      :class="message.sender === 'user' ? 'justify-end' : 'justify-start'">
                      
                      <!-- Avatar -->
                      <div v-if="message.sender === 'assistant'" 
                          class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                          AI
                      </div>

                      <!-- Message Bubble -->
                      <div class="max-w-[80%] rounded-2xl px-4 py-3"
                          :class="message.sender === 'user' ? 
                              'bg-indigo-600 text-white' : 
                              'bg-gray-800 text-gray-200'">
                          {{ message.text }}
                      </div>

                      <!-- User Avatar -->
                      <div v-if="message.sender === 'user'" 
                          class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white flex-shrink-0">
                          U
                      </div>
                  </div>
              </div>
          </div>

          <!-- Input Area -->
          <div class="border-t border-gray-700 bg-gray-800 p-4">
              <form @submit.prevent="sendMessage" class="max-w-3xl mx-auto">
                  <div class="relative">
                      <input 
                          v-model="newMessage" 
                          type="text" 
                          placeholder="Type your message..." 
                          class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                      >
                      <button 
                          type="submit" 
                          class="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors duration-200"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                      </button>
                  </div>
              </form>
          </div>
      </div>
  </div>
  `,
  data() {
    return {
      newMessage: '',
      currentConversation: [],
      chatSessions: [],
      currentSessionId: null
    };
  },
  methods: {
    getFirstUserMessage(conversation) {
      const userMessage = conversation.find(msg => msg.sender === 'user');
      return userMessage ? userMessage.text : 'New Conversation';
    },
    startNewChat() {
      fetch('/api/chat_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to create session');
        return response.json();
      })
      .then(data => {
        this.currentSessionId = data.id;
        this.currentConversation = [];
        this.loadChatSessions();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to start new chat');
      });
    },
    loadChatSessions() {
      fetch('/api/chat_sessions')
      .then(response => {
          if (!response.ok) {
              if (response.status === 401) {
                  window.location.href = '/login';
                  return;
              }
              throw new Error('Failed to fetch chat sessions');
          }
          return response.json();
      })
      .then(data => {
          // Changed to handle array response
          this.chatSessions = data;
          if (data.length > 0 && !this.currentSessionId) {
            this.currentSessionId = data[0].id;
            this.loadPreviousChat(data[0].id);
          }
      })
      .catch(error => {
          console.error('Error fetching chat sessions:', error);
          alert('Failed to load chat sessions. Please try again.');
      });
  },
    loadPreviousChat(sessionId) {
      fetch(`/api/chat_sessions/${sessionId}`)
        .then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              window.location.href = '/login';
              return;
            }
            throw new Error('Failed to load previous chat');
          }
          return response.json();
        })
        .then(data => {
          if (data.conversation) {
            this.currentConversation = data.conversation;
            this.$nextTick(() => {
              const chatWindow = this.$refs.chatWindow;
              chatWindow.scrollTop = chatWindow.scrollHeight;
            });
          }
        })
        .catch(error => {
          console.error('Error loading previous chat:', error);
          alert('Failed to load previous chat. Please try again.');
        });
    },
    sendMessage() {
      if (this.newMessage.trim()) {
        const userMessage = this.newMessage;
        this.currentConversation.push({ 
          sender: 'user', 
          text: userMessage 
        });
        this.newMessage = '';

        this.$nextTick(() => {
          const chatWindow = this.$refs.chatWindow;
          chatWindow.scrollTop = chatWindow.scrollHeight;
        });

        this.getAssistantResponse(userMessage);
      }
    },
    getAssistantResponse(userMessage) {
      fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage, session_id: this.currentSessionId }),
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
          console.error('Fetch error:', error);
          this.currentConversation.push({
            sender: 'assistant',
            text: 'There was an error processing your request. Please try again later.',
          });
          this.$nextTick(() => {
            const chatWindow = this.$refs.chatWindow;
            chatWindow.scrollTop = chatWindow.scrollHeight;
          });
        });
    },
  },
  created() {
    this.loadChatSessions();
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