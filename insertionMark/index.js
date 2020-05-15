import InsertContent from './InsertContent';
import InsertLabel from './InsertLabel';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class InsertEditor extends Plugin {
    static get requires() {
        return [ InsertContent, InsertLabel ];
    }
}