import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InputCommand from './InputCommand';        

export default class InputContent extends Plugin {
    static get register() {
        return [ Widget ]
    }

    init() {
        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add( 'inputEditor', new InputCommand( this.editor ) );
    }

    _defineSchema() {                            
        const schema = this.editor.model.schema;
    
        schema.register( 'inputEditor', {
            allowWhere: '$text',
            isInline: true,
            isObject: true,
            allowAttributes: [ 'value' ]
        } );
    }

    _defineConverters() {                                                      
        const conversion = this.editor.conversion;
        conversion.for( 'upcast' ).elementToElement( {
            view: {
                name: 'input',
                // classes: [ 'placeholder' ]
            },
            model: 'inputEditor'
        } );

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'inputEditor',
            view: ( modelItem, viewWriter ) => {
                const inputEditorView = viewWriter.createContainerElement( 'input', {
                    gi: 'shortfill'
                } );
                const val = modelItem.getAttribute( 'value' )
                const innerText = viewWriter.createText( val ) 
                viewWriter.insert( viewWriter.createPositionAt( inputEditorView, 0 ), innerText);
                viewWriter.setAttribute('value', val, inputEditorView)
                return toWidget(inputEditorView, viewWriter)
            }
        } );

        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'inputEditor',
            view:  {
                name: 'input',
                // classes: [ 'placeholder' ],
                attributes: {
                    'gi': 'shortfill',
                    'type': 'hidden',
                    'value': ''
                }
            },
        } );

    }
    
}