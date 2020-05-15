import Command from '@ckeditor/ckeditor5-core/src/command';

export default class insertCommand extends Command {
    execute( { value } ) {
        const editor = this.editor;

        editor.model.change( writer => {
            // Create a <insertionMark> elment with the "name" attribute...
            const insertionMark = writer.createElement( 'insertionMark', { name: value } );

            // ... and insert it into the document.
            editor.model.insertContent( insertionMark );

            // Put the selection on the inserted element.
            writer.setSelection( insertionMark, 'on' );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        // console.log(model.schema.checkMerge())
        const isAllowed = model.schema.checkChild( selection.focus.parent, 'insertionMark' );

        this.isEnabled = isAllowed;
    }
}