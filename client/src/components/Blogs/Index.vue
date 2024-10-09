<template>
    <section>
        <header class="blog-header">
            <h2>ส่วนจัดการบล็อก</h2>
            <div>
                <form>
                    <input type="text" v-model="search" placeholder="Search" aria-label="Search Blogs" />
                </form>
            </div>

            <div>
                <div class="blog-actions">
                    <button @click="navigateTo('/blog/create')">Create Blog</button>
                    <ul class="categories">
                        <li v-for="cate in category" :key="cate">
                            <a @click.prevent="setCategory(cate)" href="#">{{ cate }}</a>
                        </li>
                        <li class="clear">
                            <a @click.prevent="setCategory('')" href="#">Clear</a>
                        </li>
                    </ul>
                </div>
                <div class="clearfix"></div>
                <strong>จำนวน blog: </strong> {{ filteredBlogs.length }}
            </div>
            <br />
        </header>

        <!-- No data message -->
        <div v-if="!filteredBlogs.length" class="empty-blog">
            *** ไม่มีข้อมูล ***
        </div>

        <!-- Blog list -->
        <section v-else>
            <article v-for="blog in paginatedBlogs" :key="blog.id" class="blog-list" aria-labelledby="blogTitle">
                <div class="blog-pic">
                    <transition name="fade">
                        <div v-if="blog.thumbnail && blog.thumbnail !== 'null'" class="thumbnail-pic">
                            <img :src="BASE_URL + blog.thumbnail" alt="Blog Thumbnail" />
                        </div>
                    </transition>
                </div>

                <h3>{{ blog.title }}</h3>
                <div v-html="blog.content.slice(0, 200) + '...'"></div>

                <div class="blog-info">
                    <p><strong>Category:</strong> {{ blog.category }}</p>
                    <p><strong>Create:</strong> {{ formatDate(blog.createdAt) }}</p>
                    <div class="blog-actions">
                        <button @click="navigateTo('/blog/' + blog.id)">ดู Blog</button>
                        <button @click="navigateTo('/blog/edit/' + blog.id)">แก้ไข Blog</button>
                        <button @click="deleteBlog(blog)">ลบข้อมูล</button>
                    </div>
                </div>
                <div class="clearfix"></div>
            </article>

            <!-- Load complete message -->
            <footer id="blog-list-bottom">
                <div v-if="paginatedBlogs.length === filteredBlogs.length && filteredBlogs.length > 0">
                    โหลดข้อมูลครบแล้ว
                </div>
            </footer>
        </section>
    </section>
</template>
  
<script>
import BlogsService from '@/services/BlogsService';
import _ from 'lodash';
import ScrollMonitor from 'scrollMonitor';
import axios from 'axios';

export default {
    data() {
        return {
            blogs: [],
            search: '',
            BASE_URL: 'http://localhost:8081/assets/uploads/',
            LOAD_NUM: 3,
            pageWatcher: null,
            allBlogs: [],
            currentPage: 1,
            results: [],
            category: [],
            loading: false,
        };
    },
    async created() {
        await this.refreshData();
    },
    computed: {
        filteredBlogs() {
            if (this.search) {
                return this.allBlogs.filter((blog) =>
                    blog.title.toLowerCase().includes(this.search.toLowerCase()) ||
                    blog.category.toLowerCase().includes(this.search.toLowerCase())
                );
            }
            return this.allBlogs;
        },
        paginatedBlogs() {
            return this.filteredBlogs.slice(0, this.currentPage * this.LOAD_NUM);
        },
    },
    methods: {
        navigateTo(route) {
            this.$router.push(route);
        },
        async deleteBlog(blog) {
            let result = confirm("Want to delete?")
            if (result) {
                try {
                    await BlogsService.delete(blog)
                    this.refreshData()
                } catch (err) {
                    console.log(err)
                }
            }
        },
        async refreshData() {
            try {
                const response = await BlogsService.index();
                console.log('Blogs fetched:', response.data); // เพิ่ม log
                this.allBlogs = response.data;
                this.populateCategories();
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        },
        loadMoreBlogs() {
            this.currentPage++;
        },
        handleScroll() {
            if (this.pageWatcher && this.pageWatcher.isInViewport) {
                this.loadMoreBlogs();
            }
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('th-TH', options);
        },
        setCategory(keyword) {
            this.search = keyword.trim();
        },
        populateCategories() {
            this.allBlogs.forEach(blog => {
                if (!this.category.includes(blog.category)) {
                    this.category.push(blog.category);
                }
            });
        },
    },
    watch: {
        search: _.debounce(async function (value) {
            const route = { name: 'blogs' };
            if (this.search !== '') {
                route.query = { search: this.search };
            }
            this.$router.push(route);
        }, 700),
    },
    mounted() {
        const sens = document.querySelector('#blog-list-bottom');
        this.pageWatcher = ScrollMonitor.create(sens);
        this.pageWatcher.enterViewport(this.handleScroll);
    },
    beforeDestroy() {
        if (this.pageWatcher) {
            this.pageWatcher.destroy();
        }
    },
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

.blog-info,
.blog-pic {
    float: left;
}

.clearfix {
    clear: both;
}

.blog-list {
    border: solid 1px #dfdfdf;
    margin-bottom: 10px;
    max-width: 900px;
    margin: 10px auto;
    padding: 10px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

#blog-list-bottom {
    padding: 30px;
    text-align: center;
    background: rgb(49, 219, 123);
    color: white;
}

/* Categories */
.categories {
    padding: 0;
    list-style: none;
    float: left;
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

.blog-actions {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    /* จัดให้อยู่ซ้ายสุด */
    gap: 20px;
    /* ระยะห่างระหว่างปุ่มกับหมวดหมู่ */

}

.blog-actions button {
    margin-right: 20px;
    /* เพิ่มระยะห่างจากปุ่มกับหมวดหมู่ถ้าต้องการ */
}
</style>