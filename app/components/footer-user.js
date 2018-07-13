import Component from '@ember/component';
import { A } from '@ember/array';
import { oneWay } from '@ember/object/computed';
import { inject as service} from '@ember/service';

export default Component.extend({
    i18n: service(),
    selected : oneWay('options.firstObject'),
    options : A([{ label: "English (Default)", value: "en"},
    { label: "Español", value: "es" },
    { label: "Français", value: "fr" },
    { label: "Bahasa Indonesia", value: "id"},
    { label: "Português", value: "pt" },
    { label: "Tiếng Việt", value: "vi"}]),

    actions: {
        changeLanguage (language) {
            this.set('selected', language);
            this.set('i18n.locale',language.value)
        },
    }
});
