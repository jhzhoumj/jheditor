import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import UnderLine from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import InputEditor from './inputEditor/index'
import InsertionMark from './insertionMark'
import MyUploadAdapter from './myUploadAdapter'
//import CKEditorInspector from '@ckeditor/ckeditor5-inspector';      //添加编辑器
/**
 * @param {string} id 插入编辑器容器id
 * @param {boolean} readOnly 只读编辑
 * @param {string} data 输入编辑内容
 * @param {fun} changeFun 编辑监听callback return editor对象
 * @param {fun} mousedownFun 移入选中input编辑赋值
 */ 
(function(win) {
    win.CustomEditorAll = {}
        function CustomEditor(id, readOnly, data, changeFun, mousedownFun) {
            ClassicEditor
            .create( document.querySelector( `#${id}` ), {
                plugins: [ Essentials, Paragraph, Bold, Italic, Highlight, InputEditor, InsertionMark, UnderLine, CKFinder, ImageUpload],
                toolbar: [ 'bold', 'italic', 'UnderLine', 'highlight', 'ImageUpload'],
                ckfinder: {
                    uploadUrl: 'api/resource/question/image',
                    options: {
                        resourceType: 'Images'
                    }
                },
                highlight: {
                    options: [
                        {
                            model: 'redPen',
                            class: 'pen-red',
                            title: 'Red pen',
                            color: 'var(--ck-highlight-pen-red)',
                            type: 'pen'
                        }
                    ]
                }
            } )
            .then( editor => {
                // console.log( 'Editor was initialized', editor );
                // CKEditorInspector.attach( { 'editor': editor } ) ;
                editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
                    return new MyUploadAdapter( loader );
                };
                readOnly = readOnly || false;
                data = data || '';
                editor.isReadOnly = readOnly;                 // 设置只读
                editor.setData( data )                        // 设置文本内容
                //const path = editor.model.document.selection.getFirstPosition() //获取坐标
                //const getData = editor.getData()  //获取数据
                //const element = editor.model.document.selection.getSelectedElement()  //获取文本
                window.CustomEditorAll[id] = editor;
                editor.model.document.on( 'change:data', () => {
                    if(changeFun instanceof Function){
                        changeFun(editor.getData(), editor)
                    }
                } );
                editor.editing.view.document.on('mousedown', (eventInfo, data) => {
                    const optionDome = data.document.selection.getSelectedElement();
                    if(optionDome && optionDome.name === 'input'){
                        if(mousedownFun instanceof Function){
                            mousedownFun(optionDome.getAttribute('value'))
                        }
                    }
                })
                
            } )
            .catch( error => {
                console.error( error.stack );
            } );
        }
        win.CustomEditorAll.CustomEditor = CustomEditor

})(window)
