<template>
  <!-- 头像 -->
  <div class="w">
    <el-row>
      <el-form label-position="top">
      <el-col :md="4" :sm="24">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8082/api/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="user.avatar" :src="user.avatar" class="avatar">
          <span data-message="点击修改头像" class="avatar-uploader-icon"></span>
        </el-upload>
      </el-col>
      <el-col :md="10" :sm="22" :offset="2">
          <el-form-item label="用户名">
            <el-input :disabled="true" v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="user.nickname" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email">
            <el-col :span="10">
              <el-input v-model="user.email" placeholder="请输入电子邮箱"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="手机号码" >
            <el-col :span="10">
              <el-input v-model="user.phone" placeholder="请输入手机号码"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="自我介绍">
            <el-input v-model="user.summary" type="textarea" :rows="10" placeholder="自我介绍..."></el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="save">保存</el-button>
          </el-form-item>
      </el-col>
      </el-form>
    </el-row>
  </div>

</template>

<script>
    import api from '@/api'
    import {tips, validate} from "@/utils/utils"
    import {mapGetters, mapActions} from 'vuex'
    import types from '@/store/types'
    export default {
      name: "profile",
      data() {
        return {


        }
      },
      computed: mapGetters(['user']),
      methods: {
        handleAvatarSuccess(res, file) {
          //改变vuex中的头像缓存
          this.$store.dispatch(types.SET_USER, {...this.user, avatar: res.message})
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },
        save() {
          if (!validate(this.user.username, 'required')) {tips('用户名不能为空', 'error'); return}
          if (!validate(this.user.email, 'required')) {tips('电子邮箱不能为空', 'error'); return}
          if (!validate(this.user.email, 'email')) {tips('电子邮箱格式错误', 'error'); return}
          //获取头像uri
          let matcher = this.user.avatar.match(/(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/.*)?/i)
          let avatar
          if(matcher && matcher[4] && matcher[4].length > 1) avatar = matcher[4].substring(1)
          api.saveUser({
            avatar: avatar,
            id: this.user.id,
            nickname: this.user.nickname,
            username: this.user.username,
            email: this.user.email,
            phone: this.user.phone,
            summary: this.user.summary
          }).then(response => {
            tips('保存成功', 'success')
          }).catch(error => {
            tips('保存失败', 'error')
          })
        }
      }
    }
</script>

<style scoped>
  .avatar-uploader {
    height: 240px;
    width: 240px;
    line-height: 240px;
    border-radius: 50%;
    position: relative;
  }
  .avatar-uploader .el-upload {
    /*border: 1px dashed #d9d9d9;*/
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    display: inline-block;
    font-size: 14px;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 240px;
    height: 240px;
  }
  .avatar-uploader-icon:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .avatar-uploader-icon:hover:after {
    content: attr(data-message);
    white-space: pre;
  }
  .avatar {
    width: 240px;
    height: 240px;
    border-radius: 50%;
    display: block;
  }
  .w {
    padding: 50px;
    margin: 0 auto;
  }
  .field {
    padding: 30px 0;
  }
  .field-label {
    position: absolute;
    font-size: 15px;
    font-weight: 600;
    line-height: 40px;
    color: #444;
  }
  .field-content {
    padding: 0 64px 0 140px;
    line-height: 40px;
  }

</style>
