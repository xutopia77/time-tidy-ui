<template>
    <div class="xc-scrollbar p-6 max-w-[1200px] mx-auto">
        <!-- Page Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <div class="text-lg font-semibold text-text-primary">{{ t('aiTagConfig.title') }}</div>
                <div class="text-xs text-text-secondary mt-1">{{ t('aiTagConfig.description') }}</div>
            </div>
        </div>

        <!-- Toolbar -->
        <div class="flex items-center gap-2 mb-4">
            <button class="xc-button primary" @click="saveConfig">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                </svg>
                {{ t('aiTagConfig.saveConfig') }}
            </button>
            <button class="xc-button" @click="resetConfig">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                </svg>
                {{ t('aiTagConfig.resetConfig') }}
            </button>
            <button class="xc-button" @click="triggerImport">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {{ t('aiTagConfig.importConfig') }}
            </button>
            <button class="xc-button" @click="exportConfig">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {{ t('aiTagConfig.exportConfig') }}
            </button>
            <div class="flex-1"></div>
            <button class="xc-button primary" @click="addLevel1">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {{ t('aiTagConfig.addLevel1Category') }}
            </button>
        </div>

        <!-- Hidden file input for import -->
        <input
            ref="fileInputRef"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleFileImport"
        />

        <!-- Classification Tags Tree -->
        <div class="bg-bg-secondary border border-border rounded-lg overflow-hidden">
            <div class="text-xs font-semibold text-text-tertiary uppercase tracking-wider px-4 pt-3 pb-2 bg-bg-secondary">
                {{ t('aiTagConfig.classificationTags') }}
            </div>

            <div v-for="level1 in config.level1_categories" :key="level1.id"
                class="border-b border-border-light last:border-b-0">
                <!-- L1 Header -->
                <div class="group flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors duration-150 select-none hover:bg-bg-tertiary"
                    @click="toggleNode(level1.id)">
                    <span class="inline-flex items-center justify-center w-5 h-5 text-text-tertiary text-[10px] transition-transform duration-150 flex-shrink-0"
                        :class="{ 'rotate-90': expandedNodes.has(level1.id) }">▶</span>
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-sm flex-shrink-0 bg-primary/15 text-primary-light">L1</span>
                    <span class="text-[11px] font-mono text-text-tertiary bg-bg-primary px-2 py-0.5 rounded-sm flex-shrink-0 select-all">{{ level1.id }}</span>
                    <input class="bg-transparent border border-transparent text-text-primary text-sm font-medium px-2 py-0.5 rounded-sm outline-none transition-all duration-150 min-w-[100px] hover:border-border hover:bg-bg-primary focus:border-primary focus:bg-bg-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                        v-model="level1.name" @change="onDataChange">
                    <input class="flex-1 bg-transparent border border-transparent text-text-secondary text-xs px-2 py-0.5 rounded-sm outline-none transition-all duration-150 min-w-[200px] hover:border-border hover:bg-bg-primary focus:border-primary focus:bg-bg-primary focus:text-text-primary placeholder:text-text-tertiary"
                        v-model="level1.description" :placeholder="t('aiTagConfig.descriptionPlaceholder')" @change="onDataChange">
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
                        <button class="text-xs px-2 py-0.5 rounded-md bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors duration-150 cursor-pointer border-0"
                            @click.stop="addLevel2(level1.id)">{{ t('aiTagConfig.addSubcategory') }}</button>
                        <button class="text-xs px-2 py-0.5 rounded-md bg-transparent text-error hover:bg-error/10 transition-colors duration-150 cursor-pointer border-0"
                            @click.stop="deleteLevel1(level1.id)">{{ t('aiTagConfig.delete') }}</button>
                    </div>
                </div>

                <!-- L1 Body -->
                <div v-show="expandedNodes.has(level1.id)" class="bg-bg-primary">
                    <!-- Prompts -->
                    <div class="p-4 border-t border-border-light bg-bg-secondary">
                        <!-- Positive prompts -->
                        <div class="mb-4 last:mb-0">
                            <div class="flex items-center gap-2 text-xs text-text-secondary mb-2">
                                <span class="text-[10px] px-2 py-0.5 rounded-sm font-semibold bg-success/15 text-success">{{ t('aiTagConfig.positive') }}</span>
                                {{ t('aiTagConfig.positivePrompts') }}
                            </div>
                            <div class="flex flex-col gap-1">
                                <div v-for="(prompt, pIndex) in level1.prompts" :key="pIndex" class="flex items-center gap-2">
                                    <input class="flex-1 bg-bg-primary text-text-primary border border-border rounded-sm px-3 py-2 text-xs outline-none transition-all duration-150 h-[30px] hover:border-border-dark focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                                        v-model="level1.prompts[pIndex]" @change="onDataChange">
                                    <button class="flex items-center justify-center w-7 h-7 bg-transparent border-0 text-text-tertiary rounded-sm cursor-pointer flex-shrink-0 transition-all duration-150 hover:text-error hover:bg-error/10"
                                        @click="removePrompt(level1.prompts, pIndex)">
                                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"/>
                                            <line x1="6" y1="6" x2="18" y2="18"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <button class="inline-flex items-center gap-1 bg-transparent border border-dashed border-border-dark text-text-secondary rounded-sm px-3 py-1 text-xs cursor-pointer transition-all duration-150 mt-1 h-7 hover:border-primary hover:text-primary hover:bg-primary/5"
                                @click="addPrompt(level1.prompts)">+ {{ t('aiTagConfig.addPrompt') }}</button>
                        </div>
                        <!-- Negative prompts -->
                        <div class="last:mb-0">
                            <div class="flex items-center gap-2 text-xs text-text-secondary mb-2">
                                <span class="text-[10px] px-2 py-0.5 rounded-sm font-semibold bg-error/15 text-error">{{ t('aiTagConfig.negative') }}</span>
                                {{ t('aiTagConfig.negativePrompts') }}
                            </div>
                            <div class="flex flex-col gap-1">
                                <div v-for="(prompt, pIndex) in level1.negative_prompts" :key="pIndex" class="flex items-center gap-2">
                                    <input class="flex-1 bg-bg-primary text-text-primary border border-border rounded-sm px-3 py-2 text-xs outline-none transition-all duration-150 h-[30px] hover:border-border-dark focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                                        v-model="level1.negative_prompts[pIndex]" @change="onDataChange">
                                    <button class="flex items-center justify-center w-7 h-7 bg-transparent border-0 text-text-tertiary rounded-sm cursor-pointer flex-shrink-0 transition-all duration-150 hover:text-error hover:bg-error/10"
                                        @click="removePrompt(level1.negative_prompts, pIndex)">
                                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"/>
                                            <line x1="6" y1="6" x2="18" y2="18"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <button class="inline-flex items-center gap-1 bg-transparent border border-dashed border-border-dark text-text-secondary rounded-sm px-3 py-1 text-xs cursor-pointer transition-all duration-150 mt-1 h-7 hover:border-primary hover:text-primary hover:bg-primary/5"
                                @click="addPrompt(level1.negative_prompts)">+ {{ t('aiTagConfig.addPrompt') }}</button>
                        </div>
                    </div>

                    <!-- Level 2 Categories -->
                    <div v-for="level2 in (config.level2_categories[level1.id] || [])" :key="level2.id"
                        class="border-l border-border ml-[26px]">
                        <!-- L2 Header -->
                        <div class="group flex items-center gap-2 px-4 py-3 pl-[26px] cursor-pointer transition-colors duration-150 select-none hover:bg-bg-tertiary"
                            @click="toggleNode(level2.id)">
                            <span class="inline-flex items-center justify-center w-5 h-5 text-text-tertiary text-[10px] transition-transform duration-150 flex-shrink-0"
                                :class="{ 'rotate-90': expandedNodes.has(level2.id) }">▶</span>
                            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-sm flex-shrink-0 bg-info/15 text-info">L2</span>
                            <span class="text-[11px] font-mono text-text-tertiary bg-bg-primary px-2 py-0.5 rounded-sm flex-shrink-0 select-all">{{ level2.id }}</span>
                            <input class="bg-transparent border border-transparent text-text-primary text-sm font-medium px-2 py-0.5 rounded-sm outline-none transition-all duration-150 min-w-[100px] hover:border-border hover:bg-bg-primary focus:border-primary focus:bg-bg-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                                v-model="level2.name" @change="onDataChange">
                            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
                                <button class="text-xs px-2 py-0.5 rounded-md bg-transparent text-error hover:bg-error/10 transition-colors duration-150 cursor-pointer border-0"
                                    @click.stop="deleteLevel2(level1.id, level2.id)">{{ t('aiTagConfig.delete') }}</button>
                            </div>
                        </div>

                        <!-- L2 Body -->
                        <div v-show="expandedNodes.has(level2.id)" class="bg-bg-primary pl-[10px]">
                            <div class="p-4 border-t border-border-light bg-bg-secondary">
                                <!-- Positive prompts -->
                                <div class="mb-4 last:mb-0">
                                    <div class="flex items-center gap-2 text-xs text-text-secondary mb-2">
                                        <span class="text-[10px] px-2 py-0.5 rounded-sm font-semibold bg-success/15 text-success">{{ t('aiTagConfig.positive') }}</span>
                                        {{ t('aiTagConfig.positivePrompts') }}
                                    </div>
                                    <div class="flex flex-col gap-1">
                                        <div v-for="(prompt, pIndex) in level2.prompts" :key="pIndex" class="flex items-center gap-2">
                                            <input class="flex-1 bg-bg-primary text-text-primary border border-border rounded-sm px-3 py-2 text-xs outline-none transition-all duration-150 h-[30px] hover:border-border-dark focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                                                v-model="level2.prompts[pIndex]" @change="onDataChange">
                                            <button class="flex items-center justify-center w-7 h-7 bg-transparent border-0 text-text-tertiary rounded-sm cursor-pointer flex-shrink-0 transition-all duration-150 hover:text-error hover:bg-error/10"
                                                @click="removePrompt(level2.prompts, pIndex)">
                                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <button class="inline-flex items-center gap-1 bg-transparent border border-dashed border-border-dark text-text-secondary rounded-sm px-3 py-1 text-xs cursor-pointer transition-all duration-150 mt-1 h-7 hover:border-primary hover:text-primary hover:bg-primary/5"
                                        @click="addPrompt(level2.prompts)">+ {{ t('aiTagConfig.addPrompt') }}</button>
                                </div>
                                <!-- Negative prompts -->
                                <div class="last:mb-0">
                                    <div class="flex items-center gap-2 text-xs text-text-secondary mb-2">
                                        <span class="text-[10px] px-2 py-0.5 rounded-sm font-semibold bg-error/15 text-error">{{ t('aiTagConfig.negative') }}</span>
                                        {{ t('aiTagConfig.negativePrompts') }}
                                    </div>
                                    <div class="flex flex-col gap-1">
                                        <div v-for="(prompt, pIndex) in level2.negative_prompts" :key="pIndex" class="flex items-center gap-2">
                                            <input class="flex-1 bg-bg-primary text-text-primary border border-border rounded-sm px-3 py-2 text-xs outline-none transition-all duration-150 h-[30px] hover:border-border-dark focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                                                v-model="level2.negative_prompts[pIndex]" @change="onDataChange">
                                            <button class="flex items-center justify-center w-7 h-7 bg-transparent border-0 text-text-tertiary rounded-sm cursor-pointer flex-shrink-0 transition-all duration-150 hover:text-error hover:bg-error/10"
                                                @click="removePrompt(level2.negative_prompts, pIndex)">
                                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <button class="inline-flex items-center gap-1 bg-transparent border border-dashed border-border-dark text-text-secondary rounded-sm px-3 py-1 text-xs cursor-pointer transition-all duration-150 mt-1 h-7 hover:border-primary hover:text-primary hover:bg-primary/5"
                                        @click="addPrompt(level2.negative_prompts)">+ {{ t('aiTagConfig.addPrompt') }}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add L1 button row -->
            <div class="flex gap-2 p-4 bg-bg-secondary border-t border-border-light">
                <button class="inline-flex items-center gap-1 bg-transparent border border-dashed border-border-dark text-text-secondary rounded-md px-3 py-2 text-xs cursor-pointer transition-all duration-150 hover:border-primary hover:text-primary"
                    @click="addLevel1">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    {{ t('aiTagConfig.addLevel1Category') }}
                </button>
            </div>
        </div>

        <!-- Section Divider: Attribute Tags -->
        <div class="flex items-center gap-3 my-6">
            <span class="text-sm font-semibold text-text-primary">{{ t('aiTagConfig.attributeTags') }}</span>
            <span class="flex-1 h-px bg-border"></span>
        </div>

        <!-- Attribute Tags Tree -->
        <div class="bg-bg-secondary border border-border rounded-lg overflow-hidden">
            <div class="text-xs font-semibold text-text-tertiary uppercase tracking-wider px-4 pt-3 pb-2 bg-bg-secondary">
                {{ t('aiTagConfig.attributeCategories') }}
            </div>

            <div v-for="(attrGroup, groupKey) in config.attribute_categories" :key="groupKey"
                class="border-b border-border-light last:border-b-0">
                <!-- Attribute Group Header -->
                <div class="group flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors duration-150 select-none hover:bg-bg-tertiary"
                    @click="toggleNode('attr-' + groupKey)">
                    <span class="inline-flex items-center justify-center w-5 h-5 text-text-tertiary text-[10px] transition-transform duration-150 flex-shrink-0"
                        :class="{ 'rotate-90': expandedNodes.has('attr-' + groupKey) }">▶</span>
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-sm flex-shrink-0 bg-tag-purple/15 text-tag-purple">{{ t('aiTagConfig.attribute') }}</span>
                    <span class="text-[11px] font-mono text-text-tertiary bg-bg-primary px-2 py-0.5 rounded-sm flex-shrink-0 select-all">{{ groupKey }}</span>
                    <input class="bg-transparent border border-transparent text-text-primary text-sm font-medium px-2 py-0.5 rounded-sm outline-none transition-all duration-150 min-w-[100px] hover:border-border hover:bg-bg-primary focus:border-primary focus:bg-bg-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                        :value="getAttributeGroupName(groupKey as string)"
                        @change="updateAttributeGroupName(groupKey as string, $event); onDataChange()">
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
                        <button class="text-xs px-2 py-0.5 rounded-md bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors duration-150 cursor-pointer border-0"
                            @click.stop="addAttributeTag(groupKey as string)">{{ t('aiTagConfig.addAttributeTag') }}</button>
                        <button class="text-xs px-2 py-0.5 rounded-md bg-transparent text-error hover:bg-error/10 transition-colors duration-150 cursor-pointer border-0"
                            @click.stop="deleteAttributeGroup(groupKey as string)">{{ t('aiTagConfig.delete') }}</button>
                    </div>
                </div>

                <!-- Attribute Group Body -->
                <div v-show="expandedNodes.has('attr-' + groupKey)" class="bg-bg-primary">
                    <div v-for="attr in attrGroup" :key="attr.id"
                        class="border-l border-border ml-[26px]">
                        <!-- Attribute Tag Header -->
                        <div class="group flex items-center gap-2 px-4 py-3 pl-[26px] cursor-pointer transition-colors duration-150 select-none hover:bg-bg-tertiary"
                            @click="toggleNode(attr.id)">
                            <span class="inline-flex items-center justify-center w-5 h-5 text-text-tertiary text-[10px] transition-transform duration-150 flex-shrink-0"
                                :class="{ 'rotate-90': expandedNodes.has(attr.id) }">▶</span>
                            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-sm flex-shrink-0 bg-tag-purple/15 text-tag-purple">{{ t('aiTagConfig.attribute') }}</span>
                            <span class="text-[11px] font-mono text-text-tertiary bg-bg-primary px-2 py-0.5 rounded-sm flex-shrink-0 select-all">{{ attr.id }}</span>
                            <input class="bg-transparent border border-transparent text-text-primary text-sm font-medium px-2 py-0.5 rounded-sm outline-none transition-all duration-150 min-w-[100px] hover:border-border hover:bg-bg-primary focus:border-primary focus:bg-bg-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                                v-model="attr.name" @change="onDataChange">
                            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
                                <button class="text-xs px-2 py-0.5 rounded-md bg-transparent text-error hover:bg-error/10 transition-colors duration-150 cursor-pointer border-0"
                                    @click.stop="deleteAttributeTag(groupKey as string, attr.id)">{{ t('aiTagConfig.delete') }}</button>
                            </div>
                        </div>

                        <!-- Attribute Tag Body -->
                        <div v-show="expandedNodes.has(attr.id)" class="bg-bg-primary pl-[10px]">
                            <div class="p-4 border-t border-border-light bg-bg-secondary">
                                <div class="last:mb-0">
                                    <div class="flex items-center gap-2 text-xs text-text-secondary mb-2">
                                        <span class="text-[10px] px-2 py-0.5 rounded-sm font-semibold bg-success/15 text-success">{{ t('aiTagConfig.positive') }}</span>
                                        {{ t('aiTagConfig.positivePrompts') }}
                                    </div>
                                    <div class="flex flex-col gap-1">
                                        <div v-for="(prompt, pIndex) in attr.prompts" :key="pIndex" class="flex items-center gap-2">
                                            <input class="flex-1 bg-bg-primary text-text-primary border border-border rounded-sm px-3 py-2 text-xs outline-none transition-all duration-150 h-[30px] hover:border-border-dark focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                                                v-model="attr.prompts[pIndex]" @change="onDataChange">
                                            <button class="flex items-center justify-center w-7 h-7 bg-transparent border-0 text-text-tertiary rounded-sm cursor-pointer flex-shrink-0 transition-all duration-150 hover:text-error hover:bg-error/10"
                                                @click="removePrompt(attr.prompts, pIndex)">
                                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <button class="inline-flex items-center gap-1 bg-transparent border border-dashed border-border-dark text-text-secondary rounded-sm px-3 py-1 text-xs cursor-pointer transition-all duration-150 mt-1 h-7 hover:border-primary hover:text-primary hover:bg-primary/5"
                                        @click="addPrompt(attr.prompts)">+ {{ t('aiTagConfig.addPrompt') }}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add attribute group button row -->
            <div class="flex gap-2 p-4 bg-bg-secondary border-t border-border-light">
                <button class="inline-flex items-center gap-1 bg-transparent border border-dashed border-border-dark text-text-secondary rounded-md px-3 py-2 text-xs cursor-pointer transition-all duration-150 hover:border-primary hover:text-primary"
                    @click="addAttributeGroup">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    {{ t('aiTagConfig.addAttributeGroup') }}
                </button>
            </div>
        </div>

        <!-- Section Divider: Recognition Settings -->
        <div class="flex items-center gap-3 my-6">
            <span class="text-sm font-semibold text-text-primary">{{ t('aiTagConfig.recognitionSettings') }}</span>
            <span class="flex-1 h-px bg-border"></span>
        </div>

        <!-- Settings Panel -->
        <div class="bg-bg-secondary border border-border rounded-lg p-5">
            <div class="grid grid-cols-3 gap-4">
                <div class="flex flex-col gap-1">
                    <label class="text-xs text-text-secondary">{{ t('aiTagConfig.level1Threshold') }}</label>
                    <input class="bg-bg-tertiary text-text-primary border border-border rounded-md px-3 h-9 text-sm outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                        type="number" step="0.01" v-model.number="config.settings.level1_threshold" @change="onDataChange">
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-xs text-text-secondary">{{ t('aiTagConfig.level2Threshold') }}</label>
                    <input class="bg-bg-tertiary text-text-primary border border-border rounded-md px-3 h-9 text-sm outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                        type="number" step="0.01" v-model.number="config.settings.level2_threshold" @change="onDataChange">
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-xs text-text-secondary">{{ t('aiTagConfig.attributeThreshold') }}</label>
                    <input class="bg-bg-tertiary text-text-primary border border-border rounded-md px-3 h-9 text-sm outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                        type="number" step="0.01" v-model.number="config.settings.attribute_threshold" @change="onDataChange">
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-xs text-text-secondary">{{ t('aiTagConfig.level1TopK') }}</label>
                    <input class="bg-bg-tertiary text-text-primary border border-border rounded-md px-3 h-9 text-sm outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                        type="number" v-model.number="config.settings.top_k_level1" @change="onDataChange">
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-xs text-text-secondary">{{ t('aiTagConfig.level2TopK') }}</label>
                    <input class="bg-bg-tertiary text-text-primary border border-border rounded-md px-3 h-9 text-sm outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                        type="number" v-model.number="config.settings.top_k_level2" @change="onDataChange">
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-xs text-text-secondary">{{ t('aiTagConfig.attributeTopK') }}</label>
                    <input class="bg-bg-tertiary text-text-primary border border-border rounded-md px-3 h-9 text-sm outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
                        type="number" v-model.number="config.settings.top_k_attributes" @change="onDataChange">
                </div>
            </div>
        </div>

        <!-- Status Bar -->
        <div class="flex items-center justify-between px-5 py-3 bg-bg-tertiary border border-border rounded-lg text-xs text-text-secondary mt-4">
            <div>
                <span class="inline-block w-2 h-2 rounded-full bg-success mr-2"></span>
                {{ statusMessage }}
            </div>
            <span>{{ statistics }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiService } from '@/utils/apiService';
import Utils from '@/utils/utils';

const { t } = useI18n();

interface Level1Category {
    id: string;
    name: string;
    description?: string;
    prompts: string[];
    negative_prompts: string[];
}

interface Level2Category {
    id: string;
    name: string;
    prompts: string[];
    negative_prompts: string[];
}

interface AttributeTag {
    id: string;
    name: string;
    prompts: string[];
}

interface HierarchicalTagsConfig {
    version: string;
    description: string;
    update_time: string;
    level1_categories: Level1Category[];
    level2_categories: { [key: string]: Level2Category[] };
    attribute_categories: { [key: string]: AttributeTag[] };
    settings: {
        level1_threshold: number;
        level2_threshold: number;
        attribute_threshold: number;
        top_k_level1: number;
        top_k_level2: number;
        top_k_attributes: number;
    };
}

const config = ref<HierarchicalTagsConfig>({
    version: '5.0',
    description: '',
    update_time: '',
    level1_categories: [],
    level2_categories: {},
    attribute_categories: {},
    settings: {
        level1_threshold: 0,
        level2_threshold: 0,
        attribute_threshold: 0,
        top_k_level1: 1,
        top_k_level2: 2,
        top_k_attributes: 3
    }
});

const expandedNodes = ref(new Set<string>());
const statusMessage = ref(t('aiTagConfig.configSaved'));
const hasChanges = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Statistics
const statistics = computed(() => {
    const level1Count = config.value.level1_categories.length;
    let level2Count = 0;
    for (const key in config.value.level2_categories) {
        level2Count += config.value.level2_categories[key].length;
    }
    let attrGroupCount = 0;
    let attrTagCount = 0;
    for (const key in config.value.attribute_categories) {
        attrGroupCount++;
        attrTagCount += config.value.attribute_categories[key].length;
    }
    return t('aiTagConfig.statistics', { level1Count, level2Count, attrGroupCount, attrTagCount });
});

// Generate UUID
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Toggle node expansion
function toggleNode(nodeId: string) {
    if (expandedNodes.value.has(nodeId)) {
        expandedNodes.value.delete(nodeId);
    } else {
        expandedNodes.value.add(nodeId);
    }
}

// Mark data changed
function onDataChange() {
    hasChanges.value = true;
}

// Add/remove prompts
function addPrompt(prompts: string[]) {
    prompts.push('');
}

function removePrompt(prompts: string[], index: number) {
    prompts.splice(index, 1);
    onDataChange();
}

// Add Level 1 category
function addLevel1() {
    const newCategory: Level1Category = {
        id: generateUUID(),
        name: t('aiTagConfig.newCategory'),
        description: '',
        prompts: [],
        negative_prompts: []
    };
    config.value.level1_categories.push(newCategory);
    expandedNodes.value.add(newCategory.id);
    onDataChange();
}

// Add Level 2 category
function addLevel2(level1Id: string) {
    if (!config.value.level2_categories[level1Id]) {
        config.value.level2_categories[level1Id] = [];
    }
    const newCategory: Level2Category = {
        id: generateUUID(),
        name: t('aiTagConfig.newCategory'),
        prompts: [],
        negative_prompts: []
    };
    config.value.level2_categories[level1Id].push(newCategory);
    expandedNodes.value.add(newCategory.id);
    onDataChange();
}

// Delete Level 1 category
function deleteLevel1(id: string) {
    const index = config.value.level1_categories.findIndex(c => c.id === id);
    if (index !== -1) {
        config.value.level1_categories.splice(index, 1);
        delete config.value.level2_categories[id];
        expandedNodes.value.delete(id);
        onDataChange();
    }
}

// Delete Level 2 category
function deleteLevel2(level1Id: string, level2Id: string) {
    if (config.value.level2_categories[level1Id]) {
        const index = config.value.level2_categories[level1Id].findIndex(c => c.id === level2Id);
        if (index !== -1) {
            config.value.level2_categories[level1Id].splice(index, 1);
            expandedNodes.value.delete(level2Id);
            onDataChange();
        }
    }
}

// Attribute group name management
function getAttributeGroupName(groupKey: string): string {
    const names: { [key: string]: string } = {
        'time': t('aiTagConfig.attrTime'),
        'weather': t('aiTagConfig.attrWeather'),
        'season': t('aiTagConfig.attrSeason'),
        'people_count': t('aiTagConfig.attrPeopleCount'),
        'photo_type': t('aiTagConfig.attrPhotoType'),
        'quality': t('aiTagConfig.attrQuality')
    };
    return names[groupKey] || groupKey;
}

function updateAttributeGroupName(_groupKey: string, _event: Event) {
    // Attribute group keys are not editable; name editing is not supported yet
    void _groupKey;
    void _event;
}

// Add attribute group
function addAttributeGroup() {
    const newKey = 'new_attr_' + generateUUID().substring(0, 8);
    config.value.attribute_categories[newKey] = [];
    expandedNodes.value.add('attr-' + newKey);
    onDataChange();
}

// Add attribute tag
function addAttributeTag(groupKey: string) {
    const newTag: AttributeTag = {
        id: generateUUID(),
        name: t('aiTagConfig.newAttribute'),
        prompts: []
    };
    config.value.attribute_categories[groupKey].push(newTag);
    expandedNodes.value.add(newTag.id);
    onDataChange();
}

// Delete attribute group
function deleteAttributeGroup(groupKey: string) {
    delete config.value.attribute_categories[groupKey];
    expandedNodes.value.delete('attr-' + groupKey);
    onDataChange();
}

// Delete attribute tag
function deleteAttributeTag(groupKey: string, tagId: string) {
    const index = config.value.attribute_categories[groupKey].findIndex(t => t.id === tagId);
    if (index !== -1) {
        config.value.attribute_categories[groupKey].splice(index, 1);
        expandedNodes.value.delete(tagId);
        onDataChange();
    }
}

// Export configuration as JSON file
function exportConfig() {
    try {
        const jsonStr = JSON.stringify(config.value, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        link.href = url;
        link.download = `ai-tag-config-${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        Utils.message_notify({ content: t('aiTagConfig.exportSuccess'), type: 'success' });
    } catch (error) {
        console.error('Failed to export config:', error);
        Utils.message_notify({ content: t('aiTagConfig.saveError'), type: 'error' });
    }
}

// Trigger file input for import
function triggerImport() {
    fileInputRef.value?.click();
}

// Handle file import
async function handleFileImport(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!confirm(t('aiTagConfig.importConfirm'))) {
        // Reset file input so the same file can be selected again
        input.value = '';
        return;
    }

    try {
        const text = await file.text();
        const imported = JSON.parse(text) as HierarchicalTagsConfig;

        // Basic validation
        if (!imported.version || !imported.level1_categories || !imported.settings) {
            throw new Error('Invalid config format');
        }

        config.value = imported;
        // Expand nodes for imported data
        expandedNodes.value.clear();
        for (const l1 of imported.level1_categories) {
            expandedNodes.value.add(l1.id);
            const l2s = imported.level2_categories[l1.id] || [];
            for (const l2 of l2s) {
                expandedNodes.value.add(l2.id);
            }
        }
        for (const groupKey in imported.attribute_categories) {
            expandedNodes.value.add('attr-' + groupKey);
            for (const attr of imported.attribute_categories[groupKey]) {
                expandedNodes.value.add(attr.id);
            }
        }

        hasChanges.value = true;
        statusMessage.value = t('aiTagConfig.importSuccess');
        Utils.message_notify({ content: t('aiTagConfig.importSuccess'), type: 'success' });
    } catch (error) {
        console.error('Failed to import config:', error);
        Utils.message_notify({ content: t('aiTagConfig.importFileError'), type: 'error' });
    }

    // Reset file input
    input.value = '';
}

// Save configuration
async function saveConfig() {
    try {
        const resp = await ApiService.aiTagConfigSave(config.value);
        if (resp.code === 0) {
            statusMessage.value = t('aiTagConfig.configSaved');
            hasChanges.value = false;
            Utils.message_notify({ content: t('aiTagConfig.saveSuccess'), type: 'success' });
        } else {
            Utils.message_notify({ content: t('aiTagConfig.saveFailed') + ': ' + (resp.status || ''), type: 'error' });
        }
    } catch (error) {
        console.error('Failed to save config:', error);
        Utils.message_notify({ content: t('aiTagConfig.saveError'), type: 'error' });
    }
}

// Reset configuration
async function resetConfig() {
    if (!confirm(t('aiTagConfig.resetConfirm'))) {
        return;
    }
    try {
        const resp = await ApiService.aiTagConfigReset();
        if (resp.code === 0 && resp.data) {
            config.value = resp.data as HierarchicalTagsConfig;
            statusMessage.value = t('aiTagConfig.configReset');
            hasChanges.value = false;
            Utils.message_notify({ content: t('aiTagConfig.resetSuccess'), type: 'success' });
        } else {
            Utils.message_notify({ content: t('aiTagConfig.resetFailed') + ': ' + (resp.status || ''), type: 'error' });
        }
    } catch (error) {
        console.error('Failed to reset config:', error);
        Utils.message_notify({ content: t('aiTagConfig.resetError'), type: 'error' });
    }
}

// Load configuration on mount
onMounted(async () => {
    try {
        const resp = await ApiService.aiTagConfigGet();
        if (resp.code === 0 && resp.data) {
            config.value = resp.data as HierarchicalTagsConfig;
        }
    } catch (error) {
        console.error('Failed to load config:', error);
        Utils.message_notify({ content: t('aiTagConfig.loadError'), type: 'error' });
    }
});
</script>

<style scoped>
.icon {
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
}
</style>
