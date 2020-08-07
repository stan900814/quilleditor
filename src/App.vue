<template>
  <div id="app">
    <Editor :id="id" :placeholder="placeholder" @getHtmlContent="getResult"></Editor>
  </div>
</template>

<script>
import Editor from '@/components/QuillEditor'

export default {
  components:{Editor},
  data(){
    return{
      id:'editor',
      placeholder:'请输入正文...',
      token:'eyJhbGciOiJIUzUxMiIsImlhdCI6MTU5NjA3ODg3NywiZXhwIjoxOTA4NDE4ODc3fQ.eyJpZCI6MSwibmFtZSI6IumbqueipyIsIm9yZyI6Mjd9.Ish8XvJusp8lQVL_S_fQkp0wUKocVbXvHhQEC4Gs5UTAyxl3PgDAfVuF5jC6D_IUgxa5gZtkbDnZi5ASb0NIuw'
    }
  },
  mounted() {
    window.sessionStorage.setItem('X-token',this.token)
  },
  methods:{
    getResult(payload){
      console.log(payload)
    }
  }
}

</script>

