
export default {
    template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-900">
        <div class="w-full max-w-md">
            <div class="bg-gray-800 rounded-lg shadow-xl p-8 space-y-6 border border-gray-700">
                <!-- Header -->
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-white">Register</h2>
                    <p class="mt-2 text-sm text-gray-400">Create your account to get started</p>
                </div>

                <!-- Registration Form -->
                <div class="space-y-5">
                    <!-- Username Field -->
                    <div>
                        <label for="user_username" class="block text-sm font-medium text-gray-300 mb-2">
                            Username
                        </label>
                        <input 
                            type="text" 
                            id="user_username" 
                            v-model="register_details.username"
                            placeholder="Choose a username"
                            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition-colors duration-200"
                        >
                    </div>

                    <!-- Email Field -->
                    <div>
                        <label for="user_email" class="block text-sm font-medium text-gray-300 mb-2">
                            Email
                        </label>
                        <input 
                            type="email" 
                            id="user_email" 
                            v-model="register_details.email"
                            placeholder="Enter your email"
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
                            v-model="register_details.password"
                            placeholder="Create a password"
                            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition-colors duration-200"
                        >
                    </div>

                    <!-- Register Button -->
                    <button 
                        @click="register"
                        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Create Account
                    </button>

                    <!-- Login Link -->
                    <div class="text-center text-sm">
                        <span class="text-gray-400">Already have an account?</span>
                        <button 
                            @click="login"
                            class="ml-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            register_details: {
                email: null,
                username: null,
                password: null,
            },
        };
    },
    methods: {
        async register() {
            // Check for empty fields
            if (!this.register_details.username || !this.register_details.email || !this.register_details.password) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fields Reqiured',
                    text: 'Email, Username, and Password are required.',
                });
                return;
            }
            // Check for valid email
            if (!this.isValidEmail(this.register_details.email)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid email address',
                    text: 'Please enter a valid email address.',
                });
                return;
            }
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.register_details)
                });
                if (response.status === 201) {
                    const response_data = await response.json();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response_data.message,
                    });
                    this.$router.push('/login');
                } else {
                    const error = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message,
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong! Please try again later.',
                });
            }
        },

        login() {
            this.$router.push('/login');
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }
};


