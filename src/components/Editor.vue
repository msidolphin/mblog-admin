<template>
  <div>
    <textarea :id="id" :value="value"></textarea>
  </div>
</template>

<script>
  // Import TinyMCE
  import tinymce from 'tinymce/tinymce';

  const INIT = 0;
  const CHANGED = 2;
  var EDITOR = null;
  export default {
    props: {
      value: {
        type: String,
        required: true,
        default: ''
      },
      setting: {},
      height: {
        type: Number,
        require: false,
        default: 300
      }
    },
    watch: {
      value: function (val) {
        //判断是否为初始化，初始化设置一次文本内容
        if (tinymce.activeEditor && (this.status == INIT || !val)) {
          tinymce.activeEditor.setContent(val);
        }
        this.status = CHANGED
        //向父组件传递文本内容（主要用于获取不含html标签的文本）
        this.$emit('getText',  tinymce.activeEditor.getContent( { 'format' : 'text' }))
      }
    },
    data: function () {
      return {
        status: INIT,
        id: 'editor-'+new Date().getMilliseconds(),
      }
    },
    methods: {

    },
    mounted: function () {
      const _this = this;
      const setting = {
        selector:'#'+_this.id,
        language:"zh_CN",
        height: this.height,
        //初始化回调
        init_instance_callback: editor => {
          EDITOR = editor;
          console.log("Editor: " + editor.id + " is now initialized.");
          //监听编辑器内容改变事件
          editor.on('input change undo redo', () => {
            //获取文本内容
            const content = editor.getContent()
            _this.$emit('input', content);
          });
        },
        plugins:['preview codesample fullscreen uploadimage'],
        upload_image_url: 'http://localhost:8082/api/upload', //图像上传路由
      };
      Object.assign(setting,_this.setting)
      tinymce.init(setting);
    },
    beforeDestroy: function () {
      tinymce.get(this.id).destroy();
    }
  }

</script>
