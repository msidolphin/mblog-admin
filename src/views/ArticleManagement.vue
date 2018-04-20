<template>
    <el-row :gutter="20">
      <el-col :span="24">
        <!-- 文章信息 -->
        <el-form>
          <el-form-item label="博客信息">
            <el-select placeholder="请选择" style="width: 150px;" v-model="articleType">
              <el-option v-for="option in options" :key="option.value" :value="option.value" :label="option.label"/>
            </el-select>
            <el-input type="text" v-model="articleTitle" style="width: 500px;" placeholder="请输入文章标题"/>
          </el-form-item>
          <el-form-item label="文章标签">
            <!-- 遍历标签列表 处理标签删除状态 -->
            <el-tag :key="tag.id" v-for="tag in tags" closable @close="delTag(tag)">{{ tag.name }}</el-tag>
            <el-input ref="tagInput"
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              size="small"
              @blur="addTag"
              @keyup.enter.navtive="addTag"
            />
            <el-button v-else class="button-new-tag" size="small" @click="showInput">新增标签</el-button>
          </el-form-item>
          <!-- 图片上传 -->
          <el-form-item label="缩略图">
            <el-upload
              class="thumbnail-uploader"
              action="http://localhost:8082/api/upload"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :before-upload="beforeThumbnailUpload"
              :headers="{'Access-Control-Allow-Origin':'*'}"
            ><img v-if="thumbnail" :src="thumbnail" class="thumbnail"><i v-else class="el-icon-plus thumbnail-uploader-icon"></i></el-upload></el-form-item>
          <el-form-item label="文章摘要">
            <el-input v-model="summary" type="textarea" :rows="10" placeholder="简要介绍一下这篇文章..."></el-input>
          </el-form-item>
        </el-form>
        <!-- tinymce 富文本编辑器 -->
        <editor id="editor" :height="750" v-model="content" ref="editor" @getText="getText"/>
        <div style="margin-top: 10px">
          <el-button type="success" @click="publish">{{ saveBtnText }}</el-button>
          <el-button type="primary" v-if="isEdit" @click="doBack">返回</el-button>
        </div>
      </el-col>
      <!--<el-col :span="12">-->
        <!--<el-card class="box-card iframe-w" style="min-height: 800px;">-->
          <!--<iframe id="editor-preview" frameborder=0></iframe>-->
        <!--</el-card>-->
      <!--</el-col>-->
    </el-row>
</template>

<script>
    import Editor from "../components/Editor"
    import {tips, validate} from '@/utils/utils'
    export default {
      components: {Editor},
      name: "article-management",
      data() {
        return {
          id: null,           //文章id
          tags: [],
          text: '',           //纯文本
          originTags: '',     //原有的标签名称，需要对比差异
          originTagsId: '',   //原有的标签id
          inputVisible: false,
          inputValue: '',
          content: '',
          articleTitle: '',
          summary: '',
          options: [
            {
              value: 0,
              label: '原创'
            },
            {
              value: 1,
              label: '转载'
            },
            {
              value: 2,
              label: '翻译'
            }
          ],
          articleType: '',
          //图片上传相关
          thumbnail: '',
          //保存按钮文字
          saveBtnText: '发布',
          isEdit: false
        }
      },
      watch: {
        content() {
          //动态预览
          // const iframe = document.querySelector("#editor-preview")
          // var doc = iframe.contentWindow.document;
          // doc.open()
          // doc.write(this.content)
          // doc.close()
        }
      },
      methods: {
        getText(text) {
          this.text = text
        },
        publish() {
          //校验
          if(!validate(this.articleType, 'required')) {
            tips('请选择文章类型', 'error')
            return
          }
          if(!validate(this.articleTitle, 'required')) {
            tips('文章标题不能为空', 'error')
            return
          }
          if(!validate(this.content, 'required')) {
            tips('文章内容不能为空', 'error')
            return
          }
          //获取当前id列表和标签名
          let names = []
          let ids = []

          for(let i = 0 ; i < this.tags.length ; ++i) {
            names.push(this.tags[i].name)
            if(this.tags[i].id) ids.push(this.tags[i].id)
          }

          //处理文章摘要 若未填写文章照耀，获取纯文本前200个字符
          let summary = this.summary
          if (!summary) {
            summary = this.text.substring(0, 200)
            if (summary.length >= 200) summary = summary.concat('...')
          }
          this.summary = summary
		  let thumbnail
          //处理缩略图uri问题
		  if(this.thumbnail) {
			  let matcher = this.thumbnail.match(/(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/.*)?/i)
			  if(matcher && matcher[4] && matcher[4].length > 1) thumbnail = matcher[4].substring(1)
		  }
		  
          var article = {
            type: this.articleType,
            title: this.articleTitle,
            tags: names.length > 0 ? names.join(',') : null,
            tagsId: ids.length > 0 ?  ids.join(',') : null,
            thumbnail: thumbnail,
            summary:summary,
            content: this.content
          }
          if(this.id) {
            article.articleId = this.id
          }
          var params = {
            article: JSON.stringify(article),
            originTags: this.originTags,
            originTagsId: this.originTagsId,
          }
          this.$http.$request("/admin/articles", "post", params).then(response => {
            //设置文章id
            this.id = response.data.data.articleId
			
            this.saveBtnText = '保存'
	
            tips('保存成功', 'success')
			
          }).catch(error => {
            tips('保存失败', 'error')
          })
        },
        //返回
        doBack() {
          this.$router.go(-1)
        },
        delTag(tag) {
          //从标签列表中移除一个标签
          this.tags.splice(this.tags.indexOf(tag), 1)
          console.log(this.tags)
        },
        addTag() {
          let inputValue = this.inputValue
          if(inputValue) {
            if(this.tags.length === 5) {
              tips('最多只能输入5个标签', 'info')
              //隐藏输入框
              this.inputVisible = false
              //清空输入框
              this.inputValue = ''
              return
            }

            for(let i = 0 ; i < this.tags.length ; ++i) {
              if(inputValue === this.tags[i]) {
                tips('该标签已存在', 'info')
                return
              }
            }

            //新增标签
            this.tags.push({name: inputValue, id: null})

          }
          //隐藏输入框
          this.inputVisible = false
          //清空输入框
          this.inputValue = ''
        },
        showInput() {
          this.inputVisible = true
          //输入框聚焦
          // this.$refs.tagInput.$refs.input.focus()
        },
        //图片上传相关
        uploadSuccess(res, file) {
          this.thumbnail = res.data
        },
        beforeThumbnailUpload(file) {
          const isJpg = file.type === 'image/jpeg'
          const size  = file.size //Byte

          if(!isJpg) {
            this.$message.error("上传的图片只能是JPG格式")
            return false
          }
          if(size > 2 * 1024 * 1024) {
            this.$message.error("上传图片的大小不能超过2MB")
            return false
          }
          return true
        },
		initData() {
			console.log(this.id)
			if(!this.id) {
				this.id = this.$route.params.id
			}
			if(this.id) {
			  this.$http.$request("/admin/articles/" + this.id, "get").then(response => {
				const data = response.data.data
				if(data) {
				  this.content = data.content
				  this.articleTitle = data.title
				  if(data.tags) {
					let names = data.tags.split(",")
					let ids   = data.tagsId.split(",")
					for(let i = 0 ; i < names.length ; ++i) {
					  this.tags[i] = {name: names[i], id: ids[i]}
					}
				  }else {
					this.tags = []
				  }
				  //important
				  this.originTags = data.tags
				  this.originTagsId = data.tagsId
				  this.articleType = data.type
				  this.thumbnail = data.thumbnail
				  this.summary = data.summary
				  this.saveBtnText = '保存'
				  this.isEdit = true

				}
			  }).catch(error => {
				//未找到相关资源，导航到文章新增
				this.$router.push({ path: '/blog/articles'})
			  })
			}
		}
      },
	  'watch': {
		"id": "initData"
	  },
      mounted() {
        this.initData()
      }
    }
</script>

<style scoped>
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  /* 继承父级高度 */
  .iframe-w {
    position: relative;
  }
  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  /* 上传相关样式 */
  .thumbnail-uploader{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 300px;
    height: 150px;
  }
  .thumbnail-uploader:hover {
    border-color: #409eff;
  }
  .thumbnail-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .thumbnail {
    width: 300px;
    height: 150px;
    display: block;
  }
</style>
