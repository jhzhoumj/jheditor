import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertCommand from './InsertCommand';           

export default class InsertContent extends Plugin {
    static get register() {
        return [ Widget ]
    }

    init() {
        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add( 'insertionMark', new InsertCommand( this.editor ) );
    }

    _defineSchema() {                            
        const schema = this.editor.model.schema;
    
        schema.register( 'insertionMark', {
            allowWhere: '$text',
            isInline: true,
            isObject: true,
            allowAttributes: [ 'name' ]
        } );
    }

    _defineConverters() {                                                      
        const conversion = this.editor.conversion;
        conversion.for( 'upcast' ).elementToElement( {
            view: {
                name: 'span',
                classes: [ 'insertion-mark' ]
            },
            model: 'insertionMark'
        } );

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'insertionMark',
            view: ( modelItem, viewWriter ) => {
                const widgetElement = createPlaceholderView( modelItem, viewWriter );

                // 对编辑视图中的占位符元素启用小部件处理.
                return toWidget( widgetElement, viewWriter );
            }
        } );

        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'insertionMark',
            view: {
                name: 'span',
                classes: [ 'insertion-mark' ]
            },
        } );

        // Helper method for both downcast converters.
        function createPlaceholderView( modelItem, viewWriter ) {
            const name = modelItem.getAttribute( 'name' );
            console.log(name)
            const placeholderView = viewWriter.createContainerElement( 'span', {
                class: 'insertion-mark'
            } );
            // Insert text.
            const innerText = viewWriter.createText( name );
            viewWriter.insert( viewWriter.createPositionAt( placeholderView, 0 ), innerText);
            return placeholderView;
        }
    }
    
}