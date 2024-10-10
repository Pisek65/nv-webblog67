<template>
  <div>
    <br><br>
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
  div {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-size: 2em;
    margin-bottom: 15px;
    color: #333;
    text-align: center;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  .error {
    color: red;
    margin-top: 10px;
    text-align: center;
  }
</style>

