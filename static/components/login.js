export default {
    template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-900">
        <div class="w-full max-w-md">
            <!-- Login Card -->
            <div class="bg-gray-800 rounded-lg shadow-xl p-8 space-y-6 border border-gray-700">
                <!-- Header -->
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-white">Login</h2>
                    <p class="mt-2 text-sm text-gray-400">Welcome back! Please enter your details.</p>
                </div>

                <!-- Login Form -->
                <div class="space-y-5">
                    <!-- Username Field -->
                    <div>
                        <label for="user_username" class="block text-sm font-medium text-gray-300 mb-2">
                            Username
                        </label>
                        <input 
                            type="text" 
                            id="user_username" 
                            v-model="login_details.username"
                            placeholder="Enter your username"
                            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition-colors duration-200"
                        >
                    </div>

                    <!-- Password Field -->
                    <div>
                        <label for="user_password" class="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <input 
                            type="password" 
                            id="user_password" 
                            v-model="login_details.password"
                            placeholder="Enter your password"
                            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition-colors duration-200"
                        >
                    </div>

                    <!-- Login Button -->
                    <button 
                        @click="login"
                        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                        <span>Sign In</span>
                    </button>

                    <!-- Register Link -->
                    <div class="text-center text-sm">
                        <span class="text-gray-400">New to Codey?</span>
                        <button 
                            @click="register"
                            class="ml-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
                        >
                            Create an account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            login_details: {
                username: null,
                password: null
            },
        }
    },
    methods: {
        async login() {
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.login_details)
                });

                if (response.ok) {
                    const response_data = await response.json();
                    localStorage.setItem('username', this.login_details.username);
                    this.$router.push('/');
                } else {
                    const error = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: error.message,
                        background: '#1f2937',
                        color: '#fff',
                        confirmButtonColor: '#4f46e5'
                    });
                }
            } catch (error) {
                console.error('Login error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred during login. Please try again.',
                    background: '#1f2937',
                    color: '#fff',
                    confirmButtonColor: '#4f46e5'
                });
            }
        },
        register() {
            this.$router.push('/register');
        },
    },
}