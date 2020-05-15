win.CustomEditorAll = {}
function CustomEditor(id, readOnly, data, changeFun, mousedownFun) {
    watchdog.create(document.querySelector(`#${id}`), {
        plugins: [Essentials, Paragraph, Bold, Italic, Highlight, InputEditor, InsertionMark, UnderLine, CKFinder, ImageUpload],
        toolbar: ['bold', 'italic', 'UnderLine', 'highlight', 'ImageUpload'],
        ckfinder: {
            uploadUrl: '/api/resourceFile',
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
    })
    watchdog.setCreator((elementOrData, editorConfig) => {
        return ClassicEditor
            .create( elementOrData, editorConfig )
            .then(editor => {
                // console.log( 'Editor was initialized', editor );
                // CKEditorInspector.attach( { 'editor': editor } ) ;
                editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                    return new MyUploadAdapter(loader);
                };
                readOnly = readOnly || false;
                data = data || '';
                editor.isReadOnly = readOnly;                 // 设置只读
                editor.setData(data)                        // 设置文本内容
                //const path = editor.model.document.selection.getFirstPosition() //获取坐标
                //const getData = editor.getData()  //获取数据
                //const element = editor.model.document.selection.getSelectedElement()  //获取文本
                window.CustomEditorAll[id] = editor;
                editor.model.document.on('change:data', () => {
                    if (changeFun instanceof Function) {
                        changeFun(editor.getData(), editor)
                    }
                });
                editor.editing.view.document.on('mousedown', (eventInfo, data) => {
                    const optionDome = data.document.selection.getSelectedElement();
                    if (optionDome && optionDome.name === 'input') {
                        if (mousedownFun instanceof Function) {
                            mousedownFun(optionDome.getAttribute('value'))
                        }
                    }
                })

            })
            .catch(error => {
                console.error(error.stack);
            });
    });
    watchdog.setDestructor( editor => {
        // Do something before the editor is destroyed.
    
        return editor
            .destroy()
            .then( () => {
                // Do something after the editor is destroyed.
            } );
     } );
    

}