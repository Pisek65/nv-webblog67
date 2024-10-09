<template>
  <div>
    <h1>Create User</h1>
    <form v-on:submit.prevent="createUser">
      <div>
        <label>Name:</label>
        <input type="text" v-model="user.name" required />
      </div>
      <div>
        <label>Lastname:</label>
        <input type="text" v-model="user.lastname" required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" v-model="user.email" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="user.password" required />
      </div>
      <div>
        <button type="submit">Create User</button>
      </div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import UsersService from '../../services/UsersService';

export default {
  data() {
    return {
      user: {
        name: '',
        lastname: '',
        email: '',
        password: '',
        status: 'active'
      }
    }
  },
  
  methods: {
    async createUser() {
      this.errorMessage = ''; // Reset error message

      // Log user data for debugging
      console.log("Creating user with data:", this.user);

      try {
        const response = await UsersService.post(this.user);
        console.log("User created successfully:", response); // Log response
        this.$router.push('/users');
      } catch (err) {
        // Handle error and set the error message
        this.errorMessage = 'เกิดข้อผิดพลาดในการสร้างผู้ใช้ กรุณาลองใหม่';
        console.error("Error creating user:", err);
      }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>
