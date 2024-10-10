<template>
  <div>
    <br><br>
    <h1>Get All Users</h1>
    <div><button v-on:click="navigateTo('/user/create')">สร้างผู้ใช้</button></div>
    <hr>

    <div v-if="users.length > 0">
      <div><b>จำนวนผู้ใช้งาน:</b> {{ users.length }}</div>
      <div v-for="user in users" v-bind:key="user.id">
        <div><b>id:</b> {{ user.id }}</div>
        <div><b>ชื่อผู้ใช้:</b> {{ user.name }} {{ user.lastname }}</div>
        <div><b>อีเมล:</b> {{ user.email }}</div>
        <div><b>status:</b> {{ user.status }}</div>
        <div><b>type:</b> {{ user.type }}</div>
        <div>
          <button v-on:click="navigateTo('/user/' + user.id)">ดูข้อมูล</button>
          <button v-on:click="navigateTo('/user/edit/' + user.id)">แก้ไขข้อมูล</button>
          <button v-on:click="deleteUser(user)">ลบข้อมูล</button>
        </div>
        <hr>
      </div>
    </div>

    <div v-else>
      <p>ไม่มีข้อมูลผู้ใช้งาน</p>
    </div>
  </div>
</template>

<script>
import UsersService from "@/services/UsersService";

export default {
  data() {
    return {
      users: []
    };
  },

  async created() {
    try{
      this.users = (await UsersService.index()).data;
    }catch(err){
      console.log(err);
    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    async deleteUser(user) {
      let result = confirm("คุณต้องการลบข้อมูลใช่หรือไม่?");
      if (result) {
        try {
          await UsersService.delete(user);
          await this.refreshData(); // ทำการ refresh ข้อมูลใหม่หลังลบสำเร็จ

        } catch (err) {
          console.error("Error deleting user:", err);
        }
      }
    },

    async refreshData() {
      try {
        const response = await UsersService.index();
        this.users = response.data;
      } catch (err) {
        console.error("Error refreshing data:", err);
      }
    }
  }
};
</script>

<style scoped>
  div {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-right: 10px;
  }

  button:hover {
    background-color: #0056b3;
  }

  hr {
    margin: 20px 0;
  }

  .user-card {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .user-info {
    margin-bottom: 10px;
  }

  .user-info b {
    color: #333;
  }

  .no-data {
    text-align: center;
    font-size: 1.2em;
    color: #777;
  }
</style>

