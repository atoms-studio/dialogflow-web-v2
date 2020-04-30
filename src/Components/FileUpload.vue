<template>
    <div class="uploadPdfFields">
        <form
            method="post"
            enctype="multipart/form-data"
            class="box has-advanced-upload"
            @submit.prevent="onSubmit"
        >
            <div class="box__input" onclick="document.getElementById('pdfFileInput').click()">
                <svg
                    class="box__icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="43"
                    viewBox="0 0 50 43"
                >
                    <path
                        d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"
                    />
                </svg>
                <input
                    id="pdfFileInput"
                    ref="filePdf"
                    type="file"
                    name="file"
                    class="box__file"
                    @change="onSelect"
                >
                <label
                    for="file"
                ><strong>Scegli il PDF<br>da caricare</strong
                ></label
                >
                <button type="submit" class="box__button">Upload</button>
            </div>
            <div class="box__uploading">Uploading…</div>
            <input type="hidden" name="ajax" value="1">
        </form>
        <h5>{{message}}</h5>
        <div v-if="uploadedFileUrl !== ''">
            <a :href="uploadedFileUrl" target="_blank">Uploaded File Preview</a>
        </div>
    </div>
</template>
<style scoped>
.uploadPdfFields {
  text-align: center;
  position: absolute;
  z-index: 10;
  background: white;
  width: 100vw;
  height: 100vh;
}

.box.has-advanced-upload {
    outline: 2px dashed #313131;
    outline-offset: -10px;
    -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear;
    transition: outline-offset .15s ease-in-out, background-color .15s linear;
}
.box {
    font-size: 1.25rem;
    background-color: #ffffff;
    position: relative;
    padding: 100px 20px;
}

.box.has-advanced-upload .box__icon {
    width: 100%;
    height: 80px;
    fill: #313131;
    display: block;
    margin-bottom: 40px;
}
svg:not(:root) {
    overflow: hidden;
}

.box__file {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}
input, textarea, select {
    border-radius: 0;
    border: none;
}
.box__file + label {
    max-width: 80%;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    display: inline-block;
    overflow: hidden;
}

.box__button {
    font-weight: 700;
    color: #e5edf1;
    background-color: #313131;
    display: none;
    padding: 8px 16px;
    margin: 40px auto 0;
}
button, input[type=submit] {
    border: none;
    background-color: transparent;
}

.box__uploading {
    font-style: italic;
}
.box__success {
    -webkit-animation: appear-from-inside .25s ease-in-out;
    animation: appear-from-inside .25s ease-in-out;
}

.box__uploading, .box__success, .box__error {
    display: none;
}

</style>
<script>
import axios from 'axios'
export default {
    name: 'FileUpload',
    data(){
        return {
            file: '',
            message: '',
            uploadedFileUrl: ''
        }
    },
    methods: {
        onSelect(){
            const allowedTypes = ['application/pdf']
            const file = this.$refs.filePdf.files[0]
            if (file){
                this.file = file
                if (!allowedTypes.includes(file.type)){
                    this.message = 'Filetype is wrong!!'
                }
                if (file.size > 3 * 1000 * 1000){
                    this.message = 'Too large, max size allowed is 500kb'
                }
                this.onSubmit()
            }
        },
        async onSubmit(){
            const formData = new FormData()
            formData.append('file', this.file)
            let response
            try {
                response = await axios.post('http://localhost:80/upload', formData)
                if (response.status === 200){
                    this.uploadedFileUrl = response.data.data
                    this.message = response.data.message
                } else {
                    throw response.data.error
                }
            } catch (err){
                this.message = err.response.data.error
            }
        }
    }
}
</script>