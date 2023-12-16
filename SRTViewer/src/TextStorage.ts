class TextStorage {
    keyPrefix: string = 'srt_';
    keys: Array<string>;
    regexps: {[key: string]: any;};

    constructor() {
        for (let i = 0; i < localStorage.length; i++)
        {
            let key: string = localStorage.key(i);
            if (!key.startsWith(this.keyPrefix)) {
                continue;
            }
            this.keys.push(key);
            let term: string = this.getTerm(key);
            this.regexps[term] = new RegExp(`\b${term}\b`, 'g');
        }
    }

    getTerm(key: string) : string {
        return key.substr(this.keyPrefix.length);
    }

    markAll(text: string) : string {
        this.keys.forEach(key => text =
            text.replace(
                this.regexps[this.getTerm(key)],
                `<span class="marked">${localStorage.getItem(key)}</span>`
            )
        );
        return text;
    }

    add(text: string) {
        localStorage.setItem(text, null);
    }

    exportAll() {

    }
}

export default Storage;