<template>
  <div>
    <br><br>
    <h1>Create Blog</h1>
    <!--ชื่อ title-->
    <form v-on:submit.prevent="createBlog">
      <p>
        ชื่อ figure:
        <input type="text" v-model="blog.namecharacter" />
      </p>
      <transition name="fade">
        <div class="thumbnail-pic" v-if="blog.thumbnail != 'null'">
          <img :src="BASE_URL + blog.thumbnail" alt="thumbnail" />
        </div>
      </transition>
      <!-- เพิ่มรูป -->
      <div enctype="multipart/form-data" novalidate>
        <div class="dropbox">
          <input type="file" multiple :name="uploadFieldName" :disabled="isSaving"
            @change="(e) => filesChange(e.target.name, e.target.files)" accept="image/*" class="input-file" />
          <!-- <p v-if="isInitial || isSuccess"> -->
          <p v-if="isInitial">
            Drag your file(s) here to begin<br />
            or click to browse
          </p>
          <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
          <p v-if="isSuccess">Upload Successful.</p>
        </div>
      </div>
      <div>
        <transition-group tag="ul" class="pictures">
          <li v-for="picture in pictures" :key="picture.id">
            <img :src="BASE_URL + picture.name" alt="picture image" />
            <br />
            <button @click.prevent="useThumbnail(picture.name)">Thumbnail</button>
            <button @click.prevent="delFile(picture)">Delete</button>
          </li>
        </transition-group>
        <div class="clearfix"></div>
      </div>
      <p><strong>content:</strong></p>
      <vue-ckeditor v-model.lazy="blog.content" :config="config" @blur="onBlur" @focus="onFocus" />
      <p>
        namefigure:
        <input type="text" v-model="blog.namefigure" />
      </p>
      <p>
        material:
        <input type="text" v-model="blog.status" />
      </p>
      <p>
        <button type="submit">create</button>
      </p>
    </form>
  </div>
</template>

<script>
import BlogsService from "@/services/BlogsService";
import VueCkeditor from "vue-ckeditor2";
import UploadService from "@/services/UploadService";

const status_INITIAL = 0, status_SAVING = 1, status_SUCCESS = 2, status_FAILED = 3;

export default {
  data() {
    return {
      BASE_URL: "http://localhost:8081/assets/uploads/",
      error: null,
      // uploadedFiles: [],
      uploadError: null,
      currentstatus: null,
      uploadFieldName: "userPhoto",
      uploadedFileNames: [],
      pictures: [],
      pictureIndex: 0,
      blog: {
        namecharacter: "",
        thumbnail: "null",
        pictures: "null",
        content: "",
        namefigure: "",
        status: "",
      },
      config: {
        toolbar: [["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript"]],
        height: 300,
      },
    };
  },
  methods: {
    async delFile(material) {
      if (confirm("Want to delete?")) {
        await UploadService.delete({ filename: material.name });
        this.pictures = this.pictures.filter(picture => picture.id !== material.id);
      }
    },
    async createBlog() {
      this.blog.pictures = JSON.stringify(this.pictures);
      console.log("Blog data before posting:", this.blog);
      try {
        await BlogsService.post(this.blog);
        console.log("Blog created successfully!");
        this.$router.push({ name: "blogs" });
      } catch (err) {
        console.error("Error creating blog:", err);
      }
    },
    filesChange(fieldName, fileList) {
      const formData = new FormData();
      Array.from(fileList).forEach(file => {
        formData.append(fieldName, file);
        this.uploadedFileNames.push(file.name);
      });
      this.save(formData);
    },
    async save(formData) {
      // upload data to the server
      try {
        this.currentstatus = status_SAVING;
        await UploadService.upload(formData);
        this.currentstatus = status_SUCCESS;
        this.uploadedFileNames.forEach(uploadFilename => {
          if (!this.pictures.some(picture => picture.name === uploadFilename)) {
            this.pictureIndex++;
            this.pictures.push({ id: this.pictureIndex, name: uploadFilename });
          }
        });
        this.clearUploadResult();
      } catch (error) {
        console.log(error);
        this.currentstatus = status_FAILED;
      }
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();
      if (!fileList.length) return;
      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append(fieldName, fileList[x], fileList[x].name);
        this.uploadedFileNames.push(fileList[x].name);
      });
      // save it
      this.save(formData);
    },
    clearUploadResult: function () {
      setTimeout(() => this.reset(), 5000);
    },
    useThumbnail(filename) {
      console.log(filename);
      this.blog.thumbnail = filename;
    },
  },
  computed: {
    isInitial() { return this.currentstatus === status_INITIAL; },
    isSaving() { return this.currentstatus === status_SAVING; },
    isSuccess() { return this.currentstatus === status_SUCCESS; },
  },
  components: {
    VueCkeditor,
  },
  created() {
    this.currentstatus = status_INITIAL;
    this.config.toolbar = [
      {
        name: "document",
        items: [
          "Source",
          "-",
          "Save",
          "NewPage",
          "Preview",
          "Print",
          "-",
          "Templates",
        ],
      },
      {
        name: "clipboard",
        items: [
          "Cut",
          "Copy",
          "Paste",
          "PasteText",
          "PasteFromWord",
          "-",
          "Undo",
          "Redo",
        ],
      },
      {
        name: "editing",
        items: ["Find", "Replace", "-", "SelectAll", "-", "Scayt"],
      },
      {
        name: "forms",
        items: [
          "Form",
          "Checkbox",
          "Radio",
          "TextField",
          "Textarea",
          "Select",
          "Button",
          "ImageButton",
          "HiddenField",
        ],
      },
      "/",
      {
        name: "basicstyles",
        items: [
          "Bold",
          "Italic",
          "Underline",
          "Strike",
          "Subscript",
          "Superscript",
          "-",
          "CopyFormatting",
          "RemoveFormat",
        ],
      },
      {
        name: "paragraph",
        items: [
          "NumberedList",
          "BulletedList",
          "-",
          "Outdent",
          "Indent",
          "-",
          "Blockquote",
          "CreateDiv",
          "-",
          "JustifyLeft",
          "JustifyCenter",
          "JustifyRight",
          "JustifyBlock",
          "-",
          "BidiLtr",
          "BidiRtl",
          "Language",
        ],
      },
      { name: "links", items: ["Link", "Unlink", "Anchor"] },
      {
        name: "insert",
        items: [
          "Image",
          "Flash",
          "Table",
          "HorizontalRule",
          "Smiley",
          "SpecialChar",
          "PageBreak",
          "Iframe",
          "InsertPre",
        ],
      },
      "/",
      { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
      { name: "colors", items: ["TextColor", "BGColor"] },
      { name: "tools", items: ["Maximize", "ShowBlocks"] },
      { name: "about", items: ["About"] },
    ];
  },
};
</script>

<style scoped>
.dropbox {
  outline: 2px dashed grey;
  outline-offset: -10px;
  background: lemonchiffon;
  color: dimgray;
  padding: 10px;
  min-height: 200px;
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0;
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: khaki;
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}

ul.pictures {
  list-style: none;
  padding: 0;
  margin: 0;
  float: left;
  padding-top: 10px;
  padding-bottom: 10px;
}

ul.pictures li {
  float: left;
}

ul.pictures li img {
  max-width: 180px;
  margin-right: 20px;
}

.clearfix {
  clear: both;
}

/* thumbnail */
.thumbnail-pic img {
  width: 200px;
}
</style>
