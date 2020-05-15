import InputContent from './InputContent';
import InputLabel from './InputLabel';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class InputEditor extends Plugin {
    static get requires() {
        return [ InputContent, InputLabel ];
    }
}