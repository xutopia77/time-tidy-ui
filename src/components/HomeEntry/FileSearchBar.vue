<template>
	<div class="w-full px-3 py-2 bg-bg-secondary border-b border-border">
		<div
			class="flex items-center gap-2 px-1 py-1 bg-bg-tertiary border rounded-lg cursor-pointer transition-all duration-200 max-w-[300px]"
			:class="hasActiveFilters ? 'border-primary bg-primary/5' : 'border-border hover:bg-bg-elevated hover:border-border-dark'"
			@click="openSearchPanel">
			<span class="text-sm text-text-secondary">🔍</span>
			<span class="flex-1 text-xs text-text-secondary whitespace-nowrap overflow-hidden text-ellipsis"
				:class="{ 'text-text-primary': hasActiveFilters }">
				{{ searchSummary }}
			</span>
			<span v-if="hasActiveFilters"
				class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-primary text-white text-xs font-semibold rounded-full flex-shrink-0">
				{{ activeFiltersCount }}
			</span>
		</div>

		<div v-if="showSearchPanel"
			class="fixed inset-0 bg-black/50 flex items-start justify-center pt-[100px] z-[1000]"
			@click="closeSearchPanel">
			<div class="bg-bg-secondary rounded-xl shadow-lg w-[90%] max-w-[600px] max-h-[80vh] overflow-y-auto xc-scrollbar"
				@click.stop>
				<div class="flex gap-2 p-3 border-b border-border sticky top-0 bg-bg-secondary z-[1]">
					<div class="flex-1 relative flex items-center">
						<span class="absolute left-3 text-base text-text-secondary pointer-events-none">🔍</span>
						<input v-model="searchKeyword" @keyup.enter="handleSearch"
							:placeholder="aiSearchEnabled ? t('search.aiPlaceholder') : t('search.normalPlaceholder')"
							class="w-full h-10 py-2 px-5 pl-10 bg-bg-tertiary border-2 border-border rounded-lg text-text-primary text-sm outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)] placeholder:text-text-secondary"
							type="text" ref="searchInputRef" />
						<button v-if="searchKeyword" @click="clearSearch"
							class="absolute right-2 bg-none border-none text-text-secondary cursor-pointer p-1 flex items-center justify-center transition-colors duration-150 text-sm hover:text-text-primary">
							✕
						</button>
					</div>
					<button @click="handleSearch"
						class="h-10 py-2 px-4 bg-primary text-white border-none rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 whitespace-nowrap hover:bg-primary-hover">
						{{ t('search.search') }}
					</button>
					<button @click="handleCancel"
						class="h-10 py-2 px-4 bg-transparent text-text-secondary border border-border rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 whitespace-nowrap hover:bg-bg-elevated hover:text-text-primary hover:border-border-dark">
						{{ t('common.cancel') }}
					</button>
					<button v-if="hasActiveFilters" @click="clearAllFilters"
						class="h-10 py-2 px-3 bg-transparent text-text-secondary border border-border rounded-lg cursor-pointer text-xs transition-all duration-200 whitespace-nowrap hover:bg-bg-elevated hover:text-text-primary hover:border-border-dark">
						{{ t('search.clearConditions') }}
					</button>
				</div>

				<div class="p-3">
					<div class="mb-4">
						<h4 class="text-xs font-semibold text-text-primary m-0 mb-2">{{ t('search.searchMode') }}</h4>
						<div class="flex flex-wrap gap-1">
							<label class="flex items-center gap-2 cursor-pointer text-sm text-text-primary">
								<input type="checkbox" v-model="aiSearchEnabled" class="w-[18px] h-[18px] cursor-pointer" />
								<span class="select-none">{{ t('search.enableAI') }}</span>
							</label>
						</div>
					</div>

					<div v-if="aiSearchEnabled" class="mb-4">
						<h4 class="text-xs font-semibold text-text-primary m-0 mb-2">{{ t('search.aiSettings') }}</h4>
						<div class="flex flex-col gap-2">
							<label class="flex items-center gap-2">
								{{ t('search.similarityThreshold') }}:
								<input v-model.number="aiSearchMinSimilar" type="number" min="0" max="1" step="0.1"
									class="flex-1 h-8 py-1 px-2 bg-bg-tertiary border border-border rounded text-text-primary text-xs outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]" />
							</label>
							<label class="flex items-center gap-2">
								{{ t('search.returnCount') }}:
								<input v-model.number="aiSearchTopK" type="number" min="1" max="100"
									class="flex-1 h-8 py-1 px-2 bg-bg-tertiary border border-border rounded text-text-primary text-xs outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]" />
							</label>
						</div>
					</div>

					<div v-if="!aiSearchEnabled">
						<div class="mb-4">
							<h4 class="text-xs font-semibold text-text-primary m-0 mb-2">{{ t('search.fileType') }}</h4>
							<div class="flex flex-wrap gap-1">
								<button v-for="type in fileTypes" :key="type.value"
									@click="toggleFileType(type.value)"
									class="py-1 px-3 bg-bg-elevated border border-border rounded-lg text-text-primary text-xs cursor-pointer transition-all duration-150 hover:bg-bg-tertiary hover:border-border-dark"
									:class="{ 'bg-primary border-primary text-white': isFileTypeSelected(type.value) }">
									{{ type.label }}
								</button>
							</div>
						</div>

						<div class="mb-4">
							<h4 class="text-xs font-semibold text-text-primary m-0 mb-2">{{ t('search.sortBy') }}</h4>
							<div class="flex flex-wrap gap-1">
								<button v-for="sort in sortOptions" :key="sort.value"
									@click="sortBy = sort.value"
									class="py-1 px-3 bg-bg-elevated border border-border rounded-lg text-text-primary text-xs cursor-pointer transition-all duration-150 hover:bg-bg-tertiary hover:border-border-dark"
									:class="{ 'bg-primary border-primary text-white': sortBy === sort.value }">
									{{ sort.label }}
								</button>
							</div>
							<div class="flex gap-1 mt-2">
								<button @click="sortOrder = 'asc'"
									class="flex-1 py-1 px-2 bg-bg-elevated border border-border rounded text-text-secondary text-xs cursor-pointer transition-all duration-150 hover:bg-bg-tertiary"
									:class="{ 'bg-primary border-primary text-white': sortOrder === 'asc' }">
									↑ {{ t('search.ascending') }}
								</button>
								<button @click="sortOrder = 'desc'"
									class="flex-1 py-1 px-2 bg-bg-elevated border border-border rounded text-text-secondary text-xs cursor-pointer transition-all duration-150 hover:bg-bg-tertiary"
									:class="{ 'bg-primary border-primary text-white': sortOrder === 'desc' }">
									↓ {{ t('search.descending') }}
								</button>
							</div>
						</div>
					</div>

					<div class="mb-4">
						<h4 class="text-xs font-semibold text-text-primary m-0 mb-2">{{ t('search.fileSize') }}</h4>
						<div class="flex items-center gap-1">
							<input v-model.number="minSizeMB" type="number" :placeholder="t('search.min')" min="0"
								class="flex-1 h-8 py-1 px-2 bg-bg-tertiary border border-border rounded text-text-primary text-xs outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)] placeholder:text-text-secondary" />
							<span class="text-text-secondary text-xs">-</span>
							<input v-model.number="maxSizeMB" type="number" :placeholder="t('search.max')" min="0"
								class="flex-1 h-8 py-1 px-2 bg-bg-tertiary border border-border rounded text-text-primary text-xs outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)] placeholder:text-text-secondary" />
							<span class="text-text-secondary text-xs min-w-[30px]">MB</span>
						</div>
					</div>

					<div class="mb-4">
						<h4 class="text-xs font-semibold text-text-primary m-0 mb-2">{{ t('search.videoDuration') }}</h4>
						<div class="flex items-center gap-1">
							<input v-model.number="minDurationMin" type="number" :placeholder="t('search.min')" min="0"
								class="flex-1 h-8 py-1 px-2 bg-bg-tertiary border border-border rounded text-text-primary text-xs outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)] placeholder:text-text-secondary" />
							<span class="text-text-secondary text-xs">-</span>
							<input v-model.number="maxDurationMin" type="number" :placeholder="t('search.max')" min="0"
								class="flex-1 h-8 py-1 px-2 bg-bg-tertiary border border-border rounded text-text-primary text-xs outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)] placeholder:text-text-secondary" />
							<span class="text-text-secondary text-xs min-w-[30px]">{{ t('search.minutes') }}</span>
						</div>
					</div>

					<div class="mb-4">
						<h4 class="text-xs font-semibold text-text-primary m-0 mb-2">{{ t('search.dimensions') }}</h4>
						<div class="flex flex-col gap-2">
							<div class="flex items-center gap-1">
								<label class="min-w-[50px] text-xs text-text-secondary">{{ t('search.width') }}:</label>
								<input v-model.number="minWidth" type="number" :placeholder="t('search.min')" min="0"
									class="flex-1 h-8 py-1 px-2 bg-bg-tertiary border border-border rounded text-text-primary text-xs outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)] placeholder:text-text-secondary" />
								<span class="text-text-secondary text-xs">-</span>
								<input v-model.number="maxWidth" type="number" :placeholder="t('search.max')" min="0"
									class="flex-1 h-8 py-1 px-2 bg-bg-tertiary border border-border rounded text-text-primary text-xs outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)] placeholder:text-text-secondary" />
								<span class="text-text-secondary text-xs min-w-[30px]">px</span>
							</div>
							<div class="flex items-center gap-1">
								<label class="min-w-[50px] text-xs text-text-secondary">{{ t('search.height') }}:</label>
								<input v-model.number="minHeight" type="number" :placeholder="t('search.min')" min="0"
									class="flex-1 h-8 py-1 px-2 bg-bg-tertiary border border-border rounded text-text-primary text-xs outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)] placeholder:text-text-secondary" />
								<span class="text-text-secondary text-xs">-</span>
								<input v-model.number="maxHeight" type="number" :placeholder="t('search.max')" min="0"
									class="flex-1 h-8 py-1 px-2 bg-bg-tertiary border border-border rounded text-text-primary text-xs outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)] placeholder:text-text-secondary" />
								<span class="text-text-secondary text-xs min-w-[30px]">px</span>
							</div>
						</div>
					</div>

					<div class="mb-0">
						<h4 class="text-xs font-semibold text-text-primary m-0 mb-2">
							{{ t('search.fileTags') }} ({{ selectedTags.length }})
						</h4>
						<div class="flex items-center gap-3 mb-2 flex-wrap">
							<label class="flex items-center gap-1 text-xs text-text-secondary cursor-pointer">
								<input type="checkbox" v-model="bReverseSltTag" class="cursor-pointer" />
								{{ t('search.reverseSelect') }}
							</label>
							<label class="flex items-center gap-1 text-xs text-text-secondary cursor-pointer">
								{{ t('search.noTagFilter') }}:
								<select v-model="bNoTag"
									class="h-6 py-0.5 px-1 bg-bg-tertiary border border-border rounded text-text-primary text-xs outline-none cursor-pointer">
									<option value="">{{ t('common.all') }}</option>
									<option value="false">{{ t('search.hasTagFilter') }}</option>
									<option value="true">{{ t('search.noTagFilter') }}</option>
								</select>
							</label>
						</div>
						<div class="flex flex-wrap gap-1">
							<button v-for="tag in fileTags" :key="tag.name"
								@click="toggleTag(tag.name)"
								class="py-1 px-3 bg-bg-elevated border border-border rounded-lg text-text-primary text-xs cursor-pointer transition-all duration-150 hover:bg-bg-tertiary hover:border-border-dark"
								:class="{ 'text-white': isTagSelected(tag.name) }"
								:style="isTagSelected(tag.name) ? { backgroundColor: tag.color, borderColor: tag.color } : {}">
								{{ Utils.tagName2Display(tag.name) }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/AppStore';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';

const appStore = useAppStore();
const { t } = useI18n();

const showSearchPanel = ref(false);
const searchKeyword = ref('');
const selectedFileTypes = ref<string[]>([]);
const selectedTags = ref<string[]>([]);
const sortBy = ref('time');
const sortOrder = ref('asc');
const pathType = ref('curPath');
const bReverseSltTag = ref(false);
const bNoTag = ref<'true' | 'false' | ''>('');
const searchInputRef = ref<HTMLInputElement | null>(null);

// AI Search
const aiSearchEnabled = ref(false);
const aiSearchMinSimilar = ref(0.2);
const aiSearchTopK = ref(200);

// New search condition variables
const minSizeMB = ref<number | null>(null);
const maxSizeMB = ref<number | null>(null);
const minDurationMin = ref<number | null>(null);
const maxDurationMin = ref<number | null>(null);
const minWidth = ref<number | null>(null);
const maxWidth = ref<number | null>(null);
const minHeight = ref<number | null>(null);
const maxHeight = ref<number | null>(null);

const fileTypes = [
	{ value: 'image', label: t('search.image') },
	{ value: 'video', label: t('search.video') },
	{ value: 'audio', label: t('search.audio') },
	{ value: 'text', label: t('search.text') },
	{ value: 'other', label: t('search.other') }
];

const sortOptions = [
	{ value: 'time', label: t('search.sortTime') },
	{ value: 'name', label: t('search.sortName') },
	{ value: 'size', label: t('search.sortSize') },
	{ value: 'type', label: t('search.sortType') }
];

const fileTags = computed(() => {
	const uniqueTags: DatType.FileItemTag[] = [];
	for (const item of appStore.allTags) {
		const tmpTag = new DatType.FileItemTag();
		tmpTag.name = item.name;
		tmpTag.color = item.color;
		uniqueTags.push(tmpTag);
	}
	return uniqueTags;
});

const hasActiveFilters = computed(() => {
	return !!(
		searchKeyword.value ||
		selectedFileTypes.value.length > 0 ||
		selectedTags.value.length > 0 ||
		bReverseSltTag.value ||
		bNoTag.value ||
		sortBy.value !== 'time' ||
		sortOrder.value !== 'asc' ||
		minSizeMB.value !== null ||
		maxSizeMB.value !== null ||
		minDurationMin.value !== null ||
		maxDurationMin.value !== null ||
		minWidth.value !== null ||
		maxWidth.value !== null ||
		minHeight.value !== null ||
		maxHeight.value !== null
	);
});

const activeFiltersCount = computed(() => {
	let count = 0;
	if (searchKeyword.value) count++;
	if (selectedFileTypes.value.length > 0) count++;
	if (selectedTags.value.length > 0) count++;
	if (bReverseSltTag.value) count++;
	if (bNoTag.value) count++;
	if (sortBy.value !== 'time') count++;
	if (sortOrder.value !== 'asc') count++;
	if (minSizeMB.value !== null || maxSizeMB.value !== null) count++;
	if (minDurationMin.value !== null || maxDurationMin.value !== null) count++;
	if (minWidth.value !== null || maxWidth.value !== null || minHeight.value !== null || maxHeight.value !== null) count++;
	return count;
});

const searchSummary = computed(() => {
	if (!hasActiveFilters.value) {
		return t('search.placeholder');
	}

	const parts: string[] = [];

	if (searchKeyword.value) {
		parts.push(`"${searchKeyword.value}"`);
	}

	if (selectedFileTypes.value.length > 0) {
		const typeLabels = selectedFileTypes.value.map(type => {
			const found = fileTypes.find(t => t.value === type);
			return found ? found.label : type;
		});
		parts.push(typeLabels.join(', '));
	}

	if (selectedTags.value.length > 0) {
		parts.push(`${selectedTags.value.length}${t('search.tagsSelected')}`);
	}

	if (bNoTag.value === 'true') {
		parts.push(t('search.noTagFilter'));
	} else if (bNoTag.value === 'false') {
		parts.push(t('search.hasTagFilter'));
	}

	if (sortBy.value !== 'time') {
		const sortLabel = sortOptions.find(s => s.value === sortBy.value);
		if (sortLabel) {
			parts.push(`${t('search.sortByLabel')}${sortLabel.label}${t('search.sortLabel')}`);
		}
	}

	if (minSizeMB.value !== null || maxSizeMB.value !== null) {
		if (minSizeMB.value !== null && maxSizeMB.value !== null) {
			parts.push(`${minSizeMB.value}-${maxSizeMB.value}MB`);
		} else if (minSizeMB.value !== null) {
			parts.push(`≥${minSizeMB.value}MB`);
		} else {
			parts.push(`≤${maxSizeMB.value}MB`);
		}
	}

	if (minDurationMin.value !== null || maxDurationMin.value !== null) {
		if (minDurationMin.value !== null && maxDurationMin.value !== null) {
			parts.push(`${minDurationMin.value}-${maxDurationMin.value}${t('search.minutes')}`);
		} else if (minDurationMin.value !== null) {
			parts.push(`≥${minDurationMin.value}${t('search.minutes')}`);
		} else {
			parts.push(`≤${maxDurationMin.value}${t('search.minutes')}`);
		}
	}

	return parts.length > 0 ? parts.join(' · ') : t('search.placeholder');
});

watch(() => appStore.searchCon, (newVal) => {
	sortBy.value = newVal.sortBy;
	sortOrder.value = newVal.sortOrder;
	pathType.value = newVal.pathType;
	selectedFileTypes.value = newVal.types ? [...newVal.types] : [];
	selectedTags.value = newVal.tags ? [...newVal.tags] : [];
	bReverseSltTag.value = newVal.bReverseSltTag;
	bNoTag.value = newVal.noTag;
}, { immediate: true, deep: true });

const openSearchPanel = async () => {
	showSearchPanel.value = true;
	await nextTick();
	if (searchInputRef.value) {
		searchInputRef.value.focus();
	}
};

const closeSearchPanel = () => {
	showSearchPanel.value = false;
};

const toggleFileType = (typeValue: string) => {
	const index = selectedFileTypes.value.indexOf(typeValue);
	if (index === -1) {
		selectedFileTypes.value.push(typeValue);
	} else {
		selectedFileTypes.value.splice(index, 1);
	}
};

const isFileTypeSelected = (typeValue: string) => {
	return selectedFileTypes.value.includes(typeValue);
};

const toggleTag = (tagName: string) => {
	const index = selectedTags.value.indexOf(tagName);
	if (index === -1) {
		selectedTags.value.push(tagName);
	} else {
		selectedTags.value.splice(index, 1);
	}
};

const isTagSelected = (tagName: string) => {
	return selectedTags.value.includes(tagName);
};

const handleSearch = async () => {
	appStore.searchCon.sortBy = sortBy.value;
	appStore.searchCon.sortOrder = sortOrder.value;
	appStore.searchCon.pathType = pathType.value;
	appStore.searchCon.types = selectedFileTypes.value as DatType.FileType[];
	appStore.searchCon.tags = [...selectedTags.value];
	appStore.searchCon.bReverseSltTag = bReverseSltTag.value;
	appStore.searchCon.noTag = bNoTag.value;

	// Build request with new search conditions
	const req = new DatType.FilesGetReq();
	req.keyword = searchKeyword.value || null;
	// Tag filters apply to both AI and traditional search
	req.tags = [...selectedTags.value];
	req.noTag = bNoTag.value;
	req.bReverseTag = bReverseSltTag.value;
	console.log('handleSearch selectedTags:', selectedTags.value, 'req.tags:', req.tags);

	// AI Search
	if (aiSearchEnabled.value && searchKeyword.value) {
		req.aiSearchEnabled = true;
		req.aiSearchQuery = searchKeyword.value;
		req.aiSearchMinSimilar = aiSearchMinSimilar.value;
		req.aiSearchTopK = aiSearchTopK.value;
	} else {
		// Traditional search - only apply filters when not in AI mode
		req.keyword = searchKeyword.value || null;

		// Convert MB to bytes
		if (minSizeMB.value !== null) {
			req.minSize = minSizeMB.value * 1024 * 1024;
		}
		if (maxSizeMB.value !== null) {
			req.maxSize = maxSizeMB.value * 1024 * 1024;
		}

		// Convert minutes to milliseconds
		if (minDurationMin.value !== null) {
			req.minDuration = minDurationMin.value * 60 * 1000;
		}
		if (maxDurationMin.value !== null) {
			req.maxDuration = maxDurationMin.value * 60 * 1000;
		}

		// Dimensions
		req.minWidth = minWidth.value;
		req.maxWidth = maxWidth.value;
		req.minHeight = minHeight.value;
		req.maxHeight = maxHeight.value;
	}
	
	await Utils.files_get(req);
	closeSearchPanel();
};

const clearSearch = () => {
	searchKeyword.value = '';
	if (searchInputRef.value) {
		searchInputRef.value.focus();
	}
};

const clearAllFilters = () => {
	searchKeyword.value = '';
	selectedFileTypes.value = [];
	selectedTags.value = [];
	bReverseSltTag.value = false;
	bNoTag.value = '';
	sortBy.value = 'time';
	sortOrder.value = 'asc';
	minSizeMB.value = null;
	maxSizeMB.value = null;
	minDurationMin.value = null;
	maxDurationMin.value = null;
	minWidth.value = null;
	maxWidth.value = null;
	minHeight.value = null;
	maxHeight.value = null;
	
	appStore.searchCon.sortBy = 'time';
	appStore.searchCon.sortOrder = 'asc';
	appStore.searchCon.types = [];
	appStore.searchCon.tags = [];
	appStore.searchCon.bReverseSltTag = false;
	appStore.searchCon.noTag = '';
	
	Utils.files_get();
};

const handleCancel = () => {
	clearAllFilters();
	closeSearchPanel();
};
</script>
