import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

export default class InputLabel extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;
        editor.ui.componentFactory.add( 'inputEditor', locale => {
            // 按钮的状态将绑定到widget命令.
            const command = editor.commands.get( 'inputEditor' );

            // 按钮将是ButtonView的一个实例.
            const buttonView = new ButtonView( locale );

            buttonView.set( {
               //t（）函数帮助本地化编辑器。t（）中包含的所有字符串都可以是编辑器的语言更改时翻译和更改。
                label: t( 'input Editor' ),
                tooltip: true,
                icon: imageIcon
            } );

            // 将按钮的状态绑定到命令.
            buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );
            // var arr = [{txt: "啊啊啊"},
            //         {answer: "第一个答案"},
            //         {txt: "gfdgfdgdf"},
            //         {answer: "第二个答案"},
            //         {answer: "第3个答案"},
            //         {txt: "热污染看了我就"},
            //         {answer: "第4个答案"},
            //         {txt: "啊啊啊"},
            //     ]
            // 单击按钮时执行命令（已执行）.
            this.listenTo( buttonView, 'execute', () => editor.execute( 'inputEditor', {value : ''}) );

            return buttonView;
        } );
    }
}