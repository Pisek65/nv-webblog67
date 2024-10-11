<template>
    <div>
        <br><br>
        <h1>Show Blog</h1>
        <p>id: {{ blog.id }}</p>
        <p>namecharacter: {{ blog.namecharacter }}</p>
        <!-- ใช้ v-html เพื่อแสดงเนื้อหาที่เป็น HTML -->
        <p>content: <span v-html="blog.content"></span></p>
        <p>namefigure: {{ blog.namefigure }}</p>
        <p>material: {{ blog.status }}</p>
        <p>
        <button v-on:click="navigateTo('/blog/edit/'+ blog.id)">แก้ไข blog</button>
        <button v-on:click="navigateTo('/blogs')">กลับ</button>
        </p>
    </div>
</template>

<script>
    import BlogsService from '@/services/BlogsService'
    export default {
        data () {
            return {
                blog: null
            }
        },
        async created () {
            try {
                let blogId = this.$route.params.blogId
                this.blog = (await BlogsService.show(blogId)).data
            } catch (error) {
                console.log (error)
            }
        },
        methods : {
            navigateTo (route) {
                this.$router.push(route)
            },
        }
    }
</script>
<style scoped>
    div {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
        font-size: 2em;
        margin-bottom: 20px;
        color: #333;
        text-align: center;
    }

    p {
        font-size: 1.1em;
        line-height: 1.5;
        color: #555;
        margin: 10px 0;
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
</style>
