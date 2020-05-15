import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InputCommand extends Command {
    execute({value}) {
        const editor = this.editor;
        if(typeof value === 'string') {
            editor.model.change( writer => {
                const inputEditor = writer.createElement( 'inputEditor', {value});
                console.log(inputEditor)
                editor.model.insertContent( inputEditor );
                writer.setSelection( inputEditor, 'on' );
            } );
        }else{
            editor.model.change( writer => {
                const inputList = []
                //第一步必须实例先创建
                value.reverse().forEach((item, index) =>{
                    if(Object.keys(item)[0] === 'answer'){
                        inputList.push(writer.createElement( 'inputEditor', {value: item.answer}))
                        editor.model.insertContent( inputList[inputList.length-1], editor.model.document.selection.getFirstPosition())  
                        // writer.insertText( item.answer, editor.model.document.selection.getFirstPosition());
                    }else{
                        let str = item.txt
                        str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
                        str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
                        str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
                        str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
                        writer.insertText( str, editor.model.document.selection.getFirstPosition());
                    }
                })
                // for(let i = 0, len = value.length; i < len; i++) {
                //     if(Object.keys(value[i])[0] === 'answer') {
                //         editor.model.insertContent( inputList[inputIndex] );
                //         inputIndex++ 
                //     }else{
                //         writer.insertText( value[i].txt, editor.model.document.selection.getFirstPosition());
                //     }
                // }

                // writer.insertText( '添加第一次', editor.model.document.selection.getFirstPosition());
                // editor.model.insertContent( inputList[0] );
                // writer.insertText( '添加', editor.model.document.selection.getLastPosition() );
                // editor.model.insertContent( inputList[1] );
                // writer.insertText( '添加第三次', editor.model.document.selection.getLastPosition() );
                // writer.setSelection( inputList[0], 'on' );
                // writer.setSelection( inputList[1], 'on' );
                inputList.forEach(item =>{
                    writer.setSelection( item, 'on' );
                })
            } );
        }
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;

        const isAllowed = model.schema.checkChild( selection.focus.parent, 'inputEditor' );

        this.isEnabled = isAllowed;
    }
}