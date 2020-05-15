import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import InsertSimpleBoxCommand from './insertsimpleboxcommand';

export default class SimpleBoxEditing extends Plugin {
    static get register() {
        return [ Widget ]
    }

    init() {
        // console.log( 'SimpleBoxEditing#init() got called' );

        this._defineSchema();                                                  // 创建模型框架
        this._defineConverters();                                              // 创建转换器

        this.editor.commands.add( 'insertSimpleBox', new InsertSimpleBoxCommand( this.editor ) );  //插入新增元素
    }

    _defineSchema() {                                                          // ADDED
        const schema = this.editor.model.schema;
        // console.log(schema)
        schema.register( 'simpleBox', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: true,

            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block'
        } );

        schema.register( 'simpleBoxTitle', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'simpleBox',

            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$block'
        } );

        schema.register( 'simpleBoxDescription', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'simpleBox',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$root'
        } );
        //防止元素嵌套添加
        schema.addChildCheck( ( context, childDefinition ) => {
            if ( context.endsWith( 'simpleBoxDescription' ) && childDefinition.name == 'simpleBox' ) {
                return false;
            }
        } );
    }

    // _defineConverters() {                                                      // ADDED
    //     const conversion = this.editor.conversion;

    //     conversion.elementToElement( {
    //         model: 'simpleBox',
    //         view: {
    //             name: 'section',
    //             classes: 'simple-box'
    //         }
    //     } );

    //     conversion.elementToElement( {
    //         model: 'simpleBoxTitle',
    //         view: {
    //             name: 'h1',
    //             classes: 'simple-box-title'
    //         }
    //     } );

    //     conversion.elementToElement( {
    //         model: 'simpleBoxDescription',
    //         view: {
    //             name: 'div',
    //             classes: 'simple-box-description'
    //         }
    //     } );
    // }

    _defineConverters() {                                                      // MODIFIED
        const conversion = this.editor.conversion;

        // <simpleBox> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'simpleBox',
            view: {
                name: 'section',
                classes: 'simple-box'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'simpleBox',
            view: {
                name: 'section',
                classes: 'simple-box'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'simpleBox',
            view: ( modelElement, viewWriter ) => {
                const section = viewWriter.createContainerElement( 'section', { class: 'simple-box' } );

                return toWidget( section, viewWriter, { label: 'simple box widget' } );
            }
        } );

        // <simpleBoxTitle> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'simpleBoxTitle',
            view: {
                name: 'h1',
                classes: 'simple-box-title',
               
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'simpleBoxTitle',
            view: {
                name: 'h1',
                classes: 'simple-box-title',
               
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'simpleBoxTitle',
            view: ( modelElement, viewWriter ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const h1 = viewWriter.createEditableElement( 'h1', { class: 'simple-box-title'} );

                return toWidgetEditable( h1, viewWriter );
            }
        } );

        // <simpleBoxDescription> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'simpleBoxDescription',
            view: {
                name: 'div',
                classes: 'simple-box-description'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'simpleBoxDescription',
            view: {
                name: 'div',
                classes: 'simple-box-description'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'simpleBoxDescription',
            view: ( modelElement, viewWriter ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement( 'div', { class: 'simple-box-description' } );

                return toWidgetEditable( div, viewWriter );
            }
        } );
    }
}