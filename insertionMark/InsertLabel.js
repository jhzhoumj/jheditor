import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class InputLabel extends Plugin {
    init() {

        const editor = this.editor;
        const t = editor.t;

        //“insertionMark”按钮必须在编辑器的ui组件中注册
        //显示在工具栏中
        editor.ui.componentFactory.add( 'insertionMark', locale => {
            // 按钮的状态将绑定到widget命令.
            const command = editor.commands.get( 'insertionMark' );

            // 按钮将是ButtonView的一个实例.
            const buttonView = new ButtonView( locale );

            buttonView.set( {
               //t（）函数帮助本地化编辑器。t（）中包含的所有字符串都可以是编辑器的语言更改时翻译和更改。
                label: t('insertion Mark') ,
                withText: true,
                tooltip: true,
            } );

            // 将按钮的状态绑定到命令.
            buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

            // 单击按钮时执行命令（已执行）.
            this.listenTo( buttonView, 'execute', () => editor.execute( 'insertionMark' , { value: '■①' } ) );

            return buttonView;
        } );
    }
}