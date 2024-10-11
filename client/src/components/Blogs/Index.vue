<template>
    <div class="container">
        <header class="blog-header">
            <br><br>
            <h2>แสดง figure ทั้งหมด</h2>
            <!--ค้นหาข้อมูล-->
            <form>
                <input type="text" v-model="search" placeholder="Search" aria-label="Search Blogs" />
            </form>
            <!--สร้าง blog-->
            <div class="create-blog">
                <button class="btn btn-success btn-sm" @click="navigateTo('/blog/create')">Create</button>
                <!--จำนวน blog-->
                <strong> จํานวนข้อมูล : </strong> {{ filteredBlogs.length }}
            </div>
            <!--ข้อมูล tag-->
            <ul class="categories">
                <li v-for="(nf, index) in category" :key="index">
                    <a @click.prevent="setnamefigure(nf)" href="#">{{ nf }}</a>
                </li>
                <li class="clear"><a @click.prevent="setnamefigure('nf')" href="#">Clear</a></li>
            </ul>
            <div class="clearfix"></div>
        </header>

        <transition-group name="fade">
            <div v-for="blog in filteredBlogs" :key="blog.id" class="blog-list">
                <div class="blog-pic">
                    <div class="thumbnail-pic" v-if="blog.thumbnail && blog.thumbnail !== 'null'">
                        <img :src="BASE_URL + blog.thumbnail" alt="thumbnail">
                    </div>
                </div>

                <div class="blog-info">
                    <h3>{{ blog.namecharacter }}</h3>
                    <!--เพิ่มตัวอักษรให้เยอะขึ้น-->
                    <div v-html="blog.content.slice(0, 400)"></div>
                    <p><strong>namefigure:</strong> {{ blog.namefigure }}</p>
                    <p><strong>Create:</strong> {{ formatDate(blog.createdAt) }}</p>
                    <p>
                        <button class="btn btn-sm btn-info" @click="navigateTo('/blog/' + blog.id)">View Blog</button>
                        <button class="btn btn-sm btn-warning" @click="navigateTo('/blog/edit/' + blog.id)">Edit
                            blog</button>
                        <button class="btn btn-sm btn-danger" @click="deleteBlog(blog)">Delete</button>
                    </p>
                </div>
                <div class="clearfix"></div>
            </div>
        </transition-group>

        <div v-if="filteredBlogs.length === 0 && !loading" class="empty-blog">
            *** ไม่มีข้อมูล ***
        </div>
        <div id="blog-list-bottom">
            <div class="blog-load-finished" v-if="filteredBlogs.length === results.length && results.length > 0">
                โหลดข้อมูลครบแล้ว
            </div>
        </div>
    </div>
</template>

<script>
import BlogsService from '@/services/BlogsService';
import ScrollMonitor from 'scrollMonitor';

const LOAD_NUM = 3;
let pageWatcher;

export default {
    data() {
        return {
            blogs: [],
            search: '',
            BASE_URL: 'http://localhost:8081/assets/uploads/',
            allBlogs: [],
            results: [],
            category: [],
            loading: false,
        };
    },
    async created() {
        this.allBlogs = (await BlogsService.index()).data;
        this.results = this.allBlogs;
        this.blogs = this.allBlogs.slice(0, LOAD_NUM);
        this.populateCategories();
    },
    computed: {
        filteredBlogs() {
            if (this.search.trim() === '') {
                return this.allBlogs;
            }
            return this.allBlogs.filter(blog =>
                blog.namefigure.toLowerCase().includes(this.search.toLowerCase()) ||
                blog.namecharacter.toLowerCase().includes(this.search.toLowerCase())
            );
        },
    },
    methods: {
        navigateTo(route) {
            this.$router.push(route);
        },
        async deleteBlog(blog) {
            try {
                await BlogsService.delete(blog);
                this.refreshData();
            } catch (err) {
                console.log(err);
            }
        },
        async refreshData() {
            this.allBlogs = (await BlogsService.index()).data;
            this.results = this.allBlogs;
            this.blogs = this.allBlogs.slice(0, LOAD_NUM);
        },
        setnamefigure(nf) {
            this.search = nf === 'nf' ? '' : nf;
        },
        populateCategories() {
            this.allBlogs.forEach(blog => {
                if (!this.category.includes(blog.namefigure)) {
                    this.category.push(blog.namefigure);
                }
            });
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('th-TH', options);
        },
    },
    mounted() {
        const sens = document.querySelector('#blog-list-bottom');
        pageWatcher = ScrollMonitor.create(sens);
        pageWatcher.enterViewport(this.appendResults);
    },
    beforeDestroy() {
        if (pageWatcher) {
            pageWatcher.destroy();
            pageWatcher = null;
        }
    }
};
</script>

<style scoped>
.empty-blog {
    width: 100%;
    text-align: center;
    padding: 10px;
    background: darksalmon;
    color: white;
}

.thumbnail-pic img {
    width: 200px;
    padding: 5px 10px 0 0;
}

.blog-list {
    display: flex;
    /* ใช้ flexbox เพื่อจัดตำแหน่ง */
    border: solid 1px #dfdfdf;
    margin-bottom: 10px;
    padding: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
}

.blog-pic {
    margin-right: 10px;
    /* เพิ่มระยะห่างระหว่างรูปภาพและข้อมูล */
}

.blog-info {
    flex: 3; /* ให้ข้อมูลใช้พื้นที่ว่างที่เหลือ */
}

.clearfix {
    clear: both;
}

.blog-header {
    margin: 0 auto;
}

#blog-list-bottom {
    padding-top: 4px;
}

.blog-load-finished {
    padding: 4px;
    text-align: center;
    background: seagreen;
    color: white;
}

/* Categories */
.categories {
    margin-top: 10px;
    padding: 0;
    list-style: none;
}

.categories li {
    float: left;
    padding: 2px;
}

.categories li a {
    padding: 5px 10px;
    background: paleturquoise;
    color: black;
    text-decoration: none;
}

.categories li.clear a {
    background: tomato;
    color: white;
}

.create-blog {
    margin-top: 10px;
}</style>