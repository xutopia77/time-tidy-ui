// Forwarding facade: all real logic lives in src/common/* (format / search /
// selection / api). Every static method keeps its original name, parameters
// and return type so the 30+ call sites importing `Utils from '@/utils/utils'`
// stay unchanged.

import {
    addToast,
    appstore_set,
    cancle_file_checked,
    clearHistoryToasts,
    dirCreate,
    dictionary_get,
    dir_slt_update,
    fileOpenWithDefault,
    file_similarity_detect,
    file_similarity_get,
    files2Catalog,
    files_delete,
    files_get,
    files_path_chg,
    files_restore,
    files_tag_delete,
    files_tag_set,
    get_thumbnail_url,
    log_info_append,
    message_notify,
    page_show,
    prj_info_get,
    project_health,
    project_set,
    tag_delete,
    tags_get,
    tags_set
} from '@/common/api';
import {
    convertToLinuxPath,
    gen_size_str,
    tagName2Display
} from '@/common/format';

class Utils {
    constructor() { }
    // store init: bind module-level appStore and the api client
    static appstore_set = appstore_set;
    static page_show = page_show;
    static log_info_append = log_info_append;
    static gen_size_str = gen_size_str;
    static get_thumbnail_url = get_thumbnail_url;
    static dir_slt_update = dir_slt_update;
    // tag name -> display name
    static tagName2Display = tagName2Display;
    // notify via Naive UI message api; legacy signature kept for call sites
    static message_notify = message_notify;
    static addToast = addToast;
    // clear all historical messages
    static clearHistoryToasts = clearHistoryToasts;
    static files2Catalog = files2Catalog;
    static project_set = project_set;
    static convertToLinuxPath = convertToLinuxPath;
    static dictionary_get = dictionary_get;
    static files_get = files_get;
    static cancle_file_checked = cancle_file_checked;
    static tags_get = tags_get;
    static tags_set = tags_set;
    static files_tag_set = files_tag_set;
    static files_tag_delete = files_tag_delete;
    static tag_delete = tag_delete;
    static files_path_chg = files_path_chg;
    static files_delete = files_delete;
    static files_restore = files_restore;
    static project_health = project_health;
    static file_similarity_detect = file_similarity_detect;
    static file_similarity_get = file_similarity_get;
    static prj_info_get = prj_info_get;
    static dirCreate = dirCreate;
    static fileOpenWithDefault = fileOpenWithDefault;
}

export default Utils;
