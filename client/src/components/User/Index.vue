<template>
  <div>
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
/* คุณสามารถเพิ่มสไตล์ที่ต้องการตรงนี้ */
</style>
