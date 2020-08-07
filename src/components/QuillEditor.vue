<template>
  <div>
    <div class="toolbar-wrapper">
      <div id="toolbar">
        <!-- Add font size dropdown -->
        <span class="ql-formats">
      <select class="ql-size" tooltip-position="bottom" tooltip="字号">
        <option :key="item" :value="item" v-for="item in Size" >{{ item }}</option>
      </select>
          <!-- Add a font     -->
      <select class="ql-font" tooltip-position="bottom" tooltip="字体">
        <option :key="item" :value="item" v-for="item in Font" >{{ item }}</option>
      </select>
        </span>
        <!-- Add a header -->
        <span class="ql-formats">
      <select class="ql-header" tooltip-position="bottom" tooltip="标题">
        <option value="H1">一级标题</option>
        <option value="H2">二级标题</option>
        <option value="H3">三级标题</option>
        <option value="H4">四级标题</option>
        <option value="H5">五级标题</option>
        <option value="H6">六级标题</option>
      </select>
      <button class="ql-header" value="1" tooltip-position="bottom" tooltip="H1"></button>
      <button class="ql-header" value="2" tooltip-position="bottom" tooltip="H2"></button>
      </span>
        <!-- Add a bold button -->
        <span class="ql-formats">
      <button class="ql-bold" tooltip-position="bottom" tooltip="加粗"></button>
      <button class="ql-italic" tooltip-position="bottom" tooltip="斜体"></button>
      <button class="ql-underline" tooltip-position="bottom" tooltip="下划线"></button>
      <button class="ql-strike" tooltip-position="bottom" tooltip="删除线"></button>
      </span>
        <!-- Add subscript and superscript buttons -->
        <span class="ql-formats">
      <button class="ql-script" value="sub" tooltip-position="bottom" tooltip="下标"></button>
      <button class="ql-script" value="super" tooltip-position="bottom" tooltip="上标"></button>
          <!-- Add a blockquote -->
      <button class="ql-blockquote" tooltip-position="bottom" tooltip="引用"></button>
      <button class="ql-code-block" tooltip-position="bottom" tooltip="代码块"></button>
        </span>
        <span class="ql-formats">
          <!--  Add a list    -->
        <button class="ql-list" value="ordered" tooltip-position="bottom" tooltip="有序列表"></button>
        <button class="ql-list" value="bullet" tooltip-position="bottom" tooltip="无序列表"></button>
          <!--Add a indent  -->
      <button class="ql-indent" value="-1" tooltip-position="bottom" tooltip="缩进+1"></button>
      <button class="ql-indent" value="+1" tooltip-position="bottom" tooltip="缩进-1"></button>
          <!-- Add a align   -->
      <select class="ql-align" tooltip-position="bottom" tooltip="对齐方式">
        <option value="right"></option>
        <option value="center"></option>
        <option value="justify"></option>
      </select>
      </span>
        <!-- Add a color picker-->
        <span class="ql-formats">
      <select class="ql-color" tooltip-position="bottom" tooltip="文本颜色">
        <option :key="item" :value="item" v-for="item in colors"></option>
      </select>
          <!-- Add a bg  -->
      <select class="ql-background" tooltip-position="bottom" tooltip="文本高亮">
        <option :key="item" :value="item" v-for="item in colors"></option>
      </select>
      </span>
        <span class="ql-formats">
      <button class="ql-link" tooltip-position="bottom" tooltip="链接"></button>
      <button class="ql-image" tooltip-position="bottom" tooltip="插入图片"></button>
      <button class="ql-video" tooltip-position="bottom" tooltip="插入视频"></button>
        </span>
        <!-- Add a table -->
        <span class="ql-formats">
        <button class="ql-table" value="TD" tooltip-position="bottom" tooltip="插入表格"></button>
        <button class="ql-table-insert-row" value="TIR" tooltip-position="bottom" tooltip="表格添加一行"></button>
        <button class="ql-table-insert-column" value="TIC" tooltip-position="bottom" tooltip="表格添加一列"></button>
        <button class="ql-table-delete-row" value="TDR" tooltip-position="bottom" tooltip="表格删除一行"></button>
        <button class="ql-table-delete-column" value="TDC" tooltip-position="bottom" tooltip="表格删除一列"></button>
        </span>
        <!--        &lt;!&ndash;Add a clean  &ndash;&gt;-->
        <!--        <button class="ql-clean"></button>-->
        <!--        &lt;!&ndash;Add a FontDirection&ndash;&gt;-->
        <!--        <button class="ql-direction" value="rtl"></button>-->
      </div>
      <div class="toolbar-tip"></div>
    </div>
    <div :id="id" @click="focusHandle">
    </div>
    <input type="file" id="uploadVideo" style="display: none" @change="uploadVideo" accept="video/*" >
  </div>
</template>

<script>
import axios from 'axios'
//引入quill以及样式文件
import Quill from 'quill'
//引入代码高亮插件
import hljs from 'highlight.js'
hljs.configure({
  languages:['javascript', 'ruby', 'python','c++','c','java']
})
//图片上传插件
import {ImageExtend, QuillWatch} from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)
//修改原视频上传工具
const BlockEmbed = Quill.import('blots/block/embed')
class VideoBlot extends BlockEmbed {
  static create (value) {
    let node = super.create()
    node.setAttribute('src', value.url)
    node.setAttribute('controls', value.controls)
    node.setAttribute('width', value.width)
    node.setAttribute('height', value.height)
    node.setAttribute('webkit-playsinline', true)
    node.setAttribute('playsinline', true)
    node.setAttribute('x5-playsinline', true)
    return node;
  }

  static value (node) {
    return {
      url: node.getAttribute('src'),
      controls: node.getAttribute('controls'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height')
    };
  }
}
VideoBlot.blotName = 'simpleVideo'
VideoBlot.tagName = 'video'
Quill.register(VideoBlot)

const icons = Quill.import('ui/icons') //可通过icons['blod']配置icon
const colorList = [
  '#000000',
  '#e60000',
  '#ff9900',
  '#ffff00',
  '#008a00',
  '#0066cc',
  '#9933ff',
  '#ffffff',
  '#facccc',
  '#ffebcc',
  '#ffffcc',
  '#cce8cc',
  '#cce0f5',
  '#ebd6ff',
  '#bbbbbb',
  '#f06666',
  '#ffc266',
  '#ffff66',
  '#66b966',
  '#66a3e0',
  '#c285ff',
  '#888888',
  '#a10000',
  '#b26b00',
  '#b2b200',
  '#006100',
  '#0047b2',
  '#6b24b2',
  '#444444',
  '#5c0000',
  '#663d00',
  '#666600',
  '#003700',
  '#002966',
  '#3d1466',
]; //color 以及 bg 颜色表
const font = Quill.import('formats/font')
const size = Quill.import("attributors/style/size");
font.whitelist = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'sans-serif']
size.whitelist = ['12px', '14px', '16px', '20px', '22px', '24px']
Quill.register(font, true)
Quill.register(size, true)


export default {
  name: "QuillEditor",
  props:['id','placeholder'],
  data(){
    return {
      quill:null,  //editor实例
      colors: colorList,
      Font: font.whitelist,
      Size: size.whitelist,
      token: null,
      HtmlContent:null,
      options: {
        debug: false,
        theme: 'snow',
        placeholder: this.placeholder,
        modules: {
          ImageExtend: {
            loading: true,
            name: 'image',
            action: `http://114.115.180.197:5000/api/v1.0/images/abc`,
            response: (res) => {
              console.log(res)
              return res.data[0]
            },
            headers: (xhr) => {
              xhr.setRequestHeader('X-token', this.token)
            },
            sizeError: () => {
            },//图片超过大小的回调
            start: () => {
              if(this.token == null){
                throw  new Error('上传失败，没有检测到用户token！')
              }
            },//自定义开始上传触发事件
            end: () => {
            },//自定义上传结束触发的事件，无论成功或失败
            error: (error) => {
              console.log(error)
            },//上传失败触发的事件
            success: () => {
            },//上传成功触发的事件
            // change:(xhr,formData)=>{
            //   xhr.setRequestHeader('myHeader','myValue')
            //   formData.append('token', 'myToken')
            // },//每次选择图片时触发，也可用来设置头部，但比headers多了一个参数，可设置formData
          },
          toolbar: {
            container: '#toolbar',
            handlers: {
              'table': function (val) {
                this.quill.getModule('table').insertTable(2, 3)
              },
              'table-insert-row': function () {
                this.quill.getModule('table').insertRowBelow()
              },
              'table-insert-column': function () {
                this.quill.getModule('table').insertColumnRight()
              },
              'table-delete-row': function () {
                this.quill.getModule('table').deleteRow()
              },
              'table-delete-column': function () {
                this.quill.getModule('table').deleteColumn()
              },
              'image': function () {
                QuillWatch.emit(this.quill.id)
              },
              'video':function (){
                const input = document.querySelector('#uploadVideo')
                input.value = ''
                input.click()
              }
            },
          },
          table: true,
        },
      },
    }
  },
  mounted() {
    this.token = window.sessionStorage.getItem('X-token')
    this.$el.querySelector(`#${this.id}`).style = `width:816px;margin:0 auto;`
    let quill = new Quill(`#${this.id}`, this.options)
    this.quill = quill
    this.$el.querySelector('.ql-table-insert-row').innerHTML = `<i class="iconfont icon-add_row"></i>`
    this.$el.querySelector('.ql-table-insert-column').innerHTML = `<i class="iconfont icon-add_column"></i>`
    this.$el.querySelector('.ql-table-delete-row').innerHTML = `<i class="iconfont icon-delete_row"></i>`
    this.$el.querySelector('.ql-table-delete-column').innerHTML = `<i class="iconfont icon-delete_column"></i>`
    quill.on('text-change', () => {
      // const delta = quill.getContents()
      // console.log(delta);
      const html= quill.container.firstChild.innerHTML
      this.HtmlContent = html
      this.$emit('getHtmlContent',this.HtmlContent)
    })
  },
  methods: {
    uploadVideo(e){
      console.log(e.target.files[0])
      const form = new FormData()
      form.append('files',e.target.files[0])
      axios({
        method:'post',
        data:form,
        url:'http://114.115.180.197:5000/api/v1.0/files/abc',
        headers:{
          'X-token':this.token,
          'Content-Type':'multipart/form-data',
        }
      }).then(
          (data)=>{
            console.log(data.data.data.files_path[0])
            const url = data.data.data.files_path[0]
            const addVideoRange = this.quill.getSelection()
            const newRange = 0 + (addVideoRange !== null ? addVideoRange.index : 0)
            this.quill.insertEmbed(newRange,'simpleVideo',{
              url,
              controls: 'controls',
              width: '100%',
              height:'100%'
            })
          })
    },
    focusHandle(){
      this.quill.focus()
    }
  },

}
</script>

<style type="text/css">
@import "https://at.alicdn.com/t/font_1984177_ede2ub5m6u.css";
</style>
<style lang="scss">
html {
  line-height: 1.5;
  background: #F7F7F7;
}

  .ql-toolbar [tooltip]{
    position:relative;
  }
  .ql-toolbar [tooltip]::before{
    content: "";
    position: absolute;
    top:-4px;
    left:50%;
    transform: translateX(-50%);
    border-width: 4px 6px 0 6px;
    border-style: solid;
    border-color: rgba(0,0,0,0.7) transparent transparent transparent;
    z-index: 99;
    opacity:0;
  }

  .ql-toolbar [tooltip-position='left']::before{
    left:0%;
    top:50%;
    margin-left:-12px;
    transform:translatey(-50%) rotate(-90deg)
  }
  .ql-toolbar [tooltip-position='top']::before{
    left:50%;
  }
  .ql-toolbar [tooltip-position='bottom']::before{
    top:100%;
    margin-top:8px;
    transform: translateX(-50%) translatey(-100%) rotate(-180deg)
  }
  .ql-toolbar [tooltip-position='right']::before{
    left:100%;
    top:50%;
    margin-left:1px;
    transform:translatey(-50%) rotate(90deg)
  }

  .ql-toolbar [tooltip]::after {
    content: attr(tooltip);
    position: absolute;
    left:50%;
    top:-4px;
    transform: translateX(-50%) translateY(-100%);
    background: rgba(0,0,0,0.7);
    text-align: center;
    color: #fff;
    padding:4px 2px;
    font-size: 12px;
    min-width: 70px;
    border-radius: 5px;
    pointer-events: none;
    padding: 4px 4px;
    z-index:99;
    opacity:0;
  }

  .ql-toolbar [tooltip-position='left']::after{
    left:0%;
    top:50%;
    margin-left:-8px;
    transform: translateX(-100%) translateY(-50%);
  }
  .ql-toolbar [tooltip-position='top']::after{
    left:50%;
  }
  .ql-toolbar [tooltip-position='bottom']::after{
    top:100%;
    margin-top:8px;
    transform: translateX(-50%) translateY(0%);
  }
  .ql-toolbar [tooltip-position='right']::after{
    left:100%;
    top:50%;
    margin-left:8px;
    transform: translateX(0%) translateY(-50%);
  }

  .ql-toolbar [tooltip]:hover::after,.ql-toolbar [tooltip]:hover::before {
    opacity:1
  }

  .quill-tooltip::before{
    content: "";
    position: absolute;
    bottom:-4px;
    left:50%;
    transform: translateX(-50%);
    border-width: 4px 6px 0 6px;
    border-style: solid;
    border-color: rgba(0,0,0,0.7) transparent transparent transparent;
    z-index: 99;
  }
  .ql-formats:not(:last-child){
    text-align: left;
    padding: 0 5px;
    margin: 0;
    border-right: 1px solid #ddd;
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
    content: '12px';
    font-size: 12px !important;
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
    content: '14px';
    font-size: 14px !important;
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
    content: '16px';
    font-size: 16px !important;
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
    content: '24px';
    font-size: 24px !important;
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
    content: '20px';
    font-size: 20px !important;
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="22px"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="22px"]::before {
    content: '22px';
    font-size: 22px !important;
  }

  .ql-container {
    margin: 0 auto;
    width: 816px;
    background: #fff;
    min-height: 100vh;
    box-shadow: 0 1px 5px #ddd;
    font-size: 12px;
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimSun']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimSun']::before {
    content: "宋体" !important;
    font-family: "SimSun";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimHei']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimHei']::before {
    content: "黑体" !important;
    font-family: "SimHei";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Microsoft-YaHei']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Microsoft-YaHei']::before {
    content: "微软雅黑" !important;
    font-family: "Microsoft YaHei";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='KaiTi']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='KaiTi']::before {
    content: "楷体" !important;
    font-family: "KaiTi";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='FangSong']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='FangSong']::before {
    content: "仿宋" !important;
    font-family: "FangSong";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Arial']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Arial']::before {
    content: "Arial" !important;
    font-family: "Arial";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Times-New-Roman']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Times-New-Roman']::before {
    content: "Times New Roman" !important;
    font-family: "Times New Roman";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='sans-serif']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='sans-serif']::before {
    content: "sans-serif" !important;
    font-family: "sans-serif";
  }

  .ql-font-SimSun {
    font-family: "SimSun";
  }

  .ql-font-SimHei {
    font-family: "SimHei";
  }

  .ql-font-Microsoft-YaHei {
    font-family: "Microsoft YaHei";
  }

  .ql-font-KaiTi {
    font-family: "KaiTi";
  }

  .ql-font-FangSong {
    font-family: "FangSong";
  }

  .ql-font-Arial {
    font-family: "Arial";
  }

  .ql-font-Times-New-Roman {
    font-family: "Times New Roman";
  }

  .ql-font-sans-serif {
    font-family: "sans-serif";
  }

  .toolbar-wrapper {
    padding: 10px 0;
    text-align: center;
    background: #F7F7F7;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #toolbar {
    padding: 0;
    box-sizing: border-box;
    border: none;
  }
</style>
