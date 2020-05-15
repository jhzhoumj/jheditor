import axios from 'axios'
export default class MyUploadAdapter {
    constructor( loader ) {
        this.loader = loader;
        this.url = 'api/resource/question/image/'
    }

    upload() {
        return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {
                if(file.size / 1024 /1024 > 1){
                    reject('图片的大小不超过1M')
                    return false
                }
                file.uid = this.loader.id
                const reader = new FileReader()
                reader.readAsArrayBuffer(file)
                reader.onload = e => {
                    const form = new FormData()
                    form.append('file', file)
                    axios
                    .post(`${this.url}${file.uid}`, form, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(response => {
                        resolve({
                            default: response.data.url
                        })
                    })
                    .catch((err)=> {
                        console.log(err)
                        this.abort()
                    })
                }
        } ) );
    }

    abort() {
        alert('upload progress is aborted.')
    }
}