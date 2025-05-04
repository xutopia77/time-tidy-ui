

import axios from 'axios';
import type { AppStore } from '@/stores/AppStore'
let appStore: AppStore

class Utils {
    constructor() { }
    static folder_get(folder: string) {
        const reqDat = {
            folder: folder
        }
        axios.post(`${appStore.srvPrefix}/api/v1/folder`, JSON.stringify(reqDat))
            .then((response) => {
                appStore.curFiles = response.data;
                console.log('file info:', response.data);
            })
            .catch((error) => {
                console.error('Error fetching project info:', error);
            });
    }
    static appstore_set(store: AppStore) {
        appStore = store;
    }
}

export default Utils;