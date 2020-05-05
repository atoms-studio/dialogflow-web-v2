<template>
    <div class="uploadPdfFields">
        <div v-if="stateUpload === 'uploadedError'" class="uploadedText">
            <p>{{message}}</p>
        </div>

        <SpinnerLoader v-if="stateUpload === 'uploading'" />

        <form
            v-if="stateUpload === 'notinserted'"
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
                <img class="pdfIcon" alt="" src="https://cdn4.iconfinder.com/data/icons/file-extension-names-vol-8/512/24-512.png">
                <input
                    id="pdfFileInput"
                    ref="filePdf"
                    type="file"
                    name="file"
                    class="box__file"
                    accept="application/pdf"
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
    </div>
</template>
<style scoped>
.uploadPdfFields {
  text-align: center;
  position: fixed;
  z-index: 1000;
  background: white;
  width: 100vw;
  height: 100vh;
  top: 0px;
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
    padding: 0px 20px;
    height: 100%;
}

.box .pdfIcon{
    height: 80px;
    padding: 20px;
    margin: 0 auto;
    display: block;
}

.box.has-advanced-upload .box__icon {
    padding-top: 100px;
    width: 100%;
    height: 70px;
    fill: #313131;
    display: block;
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
import SpinnerLoader from '@/Components/SpinnerLoader.vue'

export default {
    name: 'FileUpload',
    components: {
        SpinnerLoader
    },
    data(){
        return {
            file: '',
            message: '',
            uploadedFileUrl: '',
            stateUpload: 'notinserted'
        }
    },
    methods: {
        onSelect(){
            const allowedTypes = ['application/pdf']
            const file = this.$refs.filePdf.files[0]
            if (file){
                const fileExtension = file.name.split('.').pop()
                const fileSize = file.size > 3 * 1000 * 1000
                if (!allowedTypes.includes(file.type)){
                    this.message = 'Filetype is wrong!!'
                }
                if (fileSize){
                    this.message = 'Too large, max size allowed is 500kb'
                }
                if (allowedTypes.includes(file.type) && !fileSize && fileExtension === 'pdf'){
                    this.file = file
                    this.stateUpload = 'uploading'
                    this.onSubmit()
                }
            }
        },
        async onSubmit(){
            const formData = new FormData()
            formData.append('file', this.file)
            let response
            try {
                response = await axios.post('http://localhost:80/upload', formData)
                if (response.status === 200){
                    this.stateUpload = 'uploaded'
                    this.uploadedFileUrl = response.data.data
                    this.message = response.data.message

                    this.$emit('uploaded', this.uploadedFileUrl)
                } else {
                    this.stateUpload = 'uploadedError'
                    throw response.data.error
                }
            } catch (err){
                this.message = err.response.data.error
            }
        }
    }
}
</script>