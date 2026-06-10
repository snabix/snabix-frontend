import {
    Check,
    ChevronRight,
    CircleHelp,
    MapPin,
    Save,
    Settings2,
    Sparkles,
    Wrench,
} from "lucide-react";
import type {ListingItem} from "@/src/entities/listing";
import type {UserAddress} from "@/src/entities/user";
import type {CreateListingPayload, UpdateListingPayload} from "@/src/features/listing/api";
import {
    LISTING_TYPE_PRODUCT,
} from "@/src/features/listing/model/listing-form-constants";
import {conditionOptions} from "@/src/features/listing/model/listing-form-options";
import {type ListingAddressMode, useListingFormState} from "@/src/features/listing/model/use-listing-form-state";
import {AttributeFields} from "@/src/features/listing/ui/attribute-fields";
import {CategoryPicker} from "@/src/features/listing/ui/category-picker";
import {ListingFormField, ListingFormSelect} from "@/src/features/listing/ui/listing-form-field";
import {ListingImageUploader} from "@/src/features/listing/ui/listing-image-uploader";
import {ListingSubmitActions} from "@/src/features/listing/ui/listing-submit-actions";
import {Checkbox} from "@/src/shared/ui/shadcn/checkbox";
import {Input} from "@/src/shared/ui/shadcn/input";

type ListingFormProps = {
    initialListing?: ListingItem;
    mode: "create" | "edit";
    onSubmitAction: (payload: CreateListingPayload | UpdateListingPayload) => Promise<ListingItem>;
};

export function ListingForm({
                                initialListing,
                                mode,
                                onSubmitAction,
                            }: ListingFormProps) {
    const state = useListingFormState({initialListing, mode, onSubmit: onSubmitAction});

    if (mode === "create") {
        return <CreateListingShowcaseForm state={state}/>;
    }

    return <EditListingWorkbench initialListing={initialListing} state={state}/>;
}

function CreateListingShowcaseForm({
                                       state,
                                   }: {
    state: ReturnType<typeof useListingFormState>;
}) {
    const {
        activeType,
        attributeValues,
        branchOptions,
        condition,
        effectiveSelectedCategoryId,
        effectiveSelectedRootId,
        filteredRoots,
        form,
        groupedAttributes,
        handleDeleteExistingMedia,
        handleAttributeChange,
        handleCategoryChange,
        handleMultiselectChange,
        handleReorderExistingMedia,
        handleRootChange,
        handleSetMainExistingMedia,
        handleTypeChange,
        existingMedia,
        imageFiles,
        isFormBusy,
        isLoadingAttributes,
        isLoadingBranch,
        isLoadingRoots,
        isNegotiable,
        isSubmitting,
        isUploadingMedia,
        mediaRetryListingId,
        retryMediaUpload,
        addressLine,
        addressMode,
        cities,
        cityId,
        handleAddressModeChange,
        handleRegionChange,
        isLoadingCities,
        isLoadingRegions,
        profileAddressId,
        regionId,
        regions,
        setAddressLine,
        setCityId,
        setProfileAddressId,
        setCondition,
        setImageFiles,
                            setIsNegotiable,
                            submitForm,
                            userAddresses,
                        } = state;
    const {
        formState: {errors},
        register,
    } = form;
    const hasLeafCategory = effectiveSelectedCategoryId !== null;
    const activeSelectionClass = "border-[var(--accent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_18%,white),color-mix(in_srgb,var(--accent)_10%,var(--surface)))] shadow-[var(--shadow-card)]";

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--accent)_8%,transparent),transparent_28%),radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--brand)_7%,transparent),transparent_24%),linear-gradient(180deg,color-mix(in_srgb,var(--surface)_62%,transparent),var(--background))]">
            <div className="mx-auto w-full max-w-[1680px] px-5 py-10 sm:px-8">
                <div className="grid gap-8">
                    <section className="flex flex-wrap items-start justify-between gap-5">
                        <div>
                            <h1 className="font-heading text-[clamp(2.5rem,5vw,4.2rem)] font-black leading-none tracking-[-0.08em] text-[var(--brand-deep)]">
                                Создание объявления
                            </h1>
                            <p className="mt-4 text-lg font-medium text-[var(--text-muted)]">
                                Заполните информацию о товаре или услуге
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 text-sm font-bold text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--brand-deep)]"
                                type="button"
                            >
                                <CircleHelp size={16}/>
                                Нужна помощь?
                            </button>
                            <button
                                className="inline-flex h-12 items-center rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-5 text-sm font-bold text-[var(--brand-deep)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                                type="button"
                            >
                                Инструкция
                            </button>
                        </div>
                    </section>

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
                        <section
                            className="rounded-[32px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-6 shadow-[var(--shadow-card)] sm:p-7">
                            <div className="grid gap-8">
                                <div>
                                    <p className="text-[1.35rem] font-black text-[var(--brand-deep)]">Тип объявления</p>
                                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                                        {[
                                            {
                                                description: "Продажа вещей, техники, одежды и других товаров",
                                                icon: Sparkles,
                                                label: "Товар",
                                                value: LISTING_TYPE_PRODUCT,
                                            },
                                            {
                                                description: "Работы, помощь, ремонт, доставка и другие услуги",
                                                icon: Wrench,
                                                label: "Услуга",
                                                value: 2,
                                            },
                                        ].map((option) => {
                                            const isActive = activeType === option.value;
                                            const Icon = option.icon;

                                            return (
                                                <button
                                                    className={[
                                                        "flex items-start justify-between rounded-[24px] border px-5 py-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]",
                                                        isActive
                                                            ? activeSelectionClass
                                                            : "border-[var(--border-soft)] bg-[var(--surface)] hover:border-[var(--accent)]",
                                                    ].join(" ")}
                                                    key={option.value}
                                                    onClick={() => handleTypeChange(option.value)}
                                                    type="button"
                                                >
                                                    <div className="flex items-start gap-4">
                            <span className={isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}>
                              <Icon size={34}/>
                            </span>
                                                        <div>
                                                            <p className="text-[1.1rem] font-black text-[var(--brand-deep)]">{option.label}</p>
                                                            <p className="mt-2 max-w-[240px] text-sm leading-7 text-[var(--text-muted)]">
                                                                {option.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={[
                                                            "grid size-6 place-items-center rounded-full border",
                                                            isActive
                                                                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                                                : "border-[var(--border-soft)] text-transparent",
                                                        ].join(" ")}
                                                    >
                            <Check size={14}/>
                          </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <ListingFormField error={errors.title?.message} label="Название объявления">
                                    <Input
                                        aria-label="Заголовок"
                                        {...register("title")}
                                    />
                                </ListingFormField>

                                <ListingFormField error={errors.description?.message} label="Описание">
                  <textarea
                      className="min-h-36 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
                      maxLength={3000}
                      {...register("description")}
                  />
                                </ListingFormField>

                                <div className="grid gap-5">
                                    <ListingFormField error={errors.price?.message} label="Цена">
                                        <Input inputMode="numeric" placeholder="0" {...register("price")} />
                                    </ListingFormField>

                                    <label
                                        className="flex items-start gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-4">
                                        <Checkbox checked={isNegotiable}
                                                  onCheckedChange={(checked) => setIsNegotiable(Boolean(checked))}/>
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--brand-deep)]">Имеется ли
                                                торг</p>
                                            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                                                Покупатели смогут предложить свою цену
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                <div className="border-t border-[var(--border-soft)] pt-6">
                                    <p className="text-[1.35rem] font-black text-[var(--brand-deep)]">Категория</p>
                                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                                        <ListingFormField label="Выберите категорию">
                                            <ListingFormSelect
                                                disabled={isLoadingRoots || filteredRoots.length === 0}
                                                onChangeAction={handleRootChange}
                                                value={effectiveSelectedRootId ?? ""}
                                            >
                                                <option
                                                    value="">{isLoadingRoots ? "Загружаем категории..." : "Выберите категорию"}</option>
                                                {filteredRoots.map((root) => (
                                                    <option key={String(root.id)} value={String(root.id)}>
                                                        {root.name}
                                                    </option>
                                                ))}
                                            </ListingFormSelect>
                                        </ListingFormField>

                                        <ListingFormField label="Выберите подкатегорию">
                                            <ListingFormSelect
                                                disabled={effectiveSelectedRootId === null || isLoadingBranch || branchOptions.length === 0}
                                                onChangeAction={handleCategoryChange}
                                                value={effectiveSelectedCategoryId ?? ""}
                                            >
                                                <option value="">
                                                    {effectiveSelectedRootId === null
                                                        ? "Сначала выберите категорию"
                                                        : (isLoadingBranch ? "Загружаем подкатегории..." : "Выберите подкатегорию")}
                                                </option>
                                                {branchOptions.map((option) => (
                                                    <option key={String(option.id)} value={String(option.id)}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </ListingFormSelect>
                                        </ListingFormField>
                                    </div>
                                </div>

                                {activeType === LISTING_TYPE_PRODUCT ? (
                                    <div>
                                        <p className="text-[1.35rem] font-black text-[var(--brand-deep)]">Состояние
                                            товара</p>
                                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                                            {conditionOptions.map((option) => {
                                                const isActive = condition === option.value;

                                                return (
                                                    <button
                                                        className={[
                                                            "flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]",
                                                            isActive
                                                                ? `${activeSelectionClass} text-white`
                                                                : "border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-deep)] hover:border-[var(--accent)]",
                                                        ].join(" ")}
                                                        key={option.value}
                                                        onClick={() => setCondition(option.value)}
                                                        type="button"
                                                    >
                            <span className="inline-flex items-center gap-3 text-base font-black">
                              <Sparkles size={18}/>
                                {option.label}
                            </span>
                                                        <span
                                                            className={[
                                                                "grid size-6 place-items-center rounded-full border",
                                                                isActive ? "border-white/35 bg-white/12" : "border-[var(--border-soft)]",
                                                            ].join(" ")}
                                                        >
                              {isActive ? <Check size={14}/> : null}
                            </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : null}

                                <AddressSection
                                    addressLine={addressLine}
                                    addressMode={addressMode}
                                    cities={cities}
                                    cityId={cityId}
                                    isLoadingCities={isLoadingCities}
                                    isLoadingRegions={isLoadingRegions}
                                    onAddressLineChangeAction={setAddressLine}
                                    onAddressModeChangeAction={handleAddressModeChange}
                                    onCityChangeAction={setCityId}
                                    onProfileAddressChangeAction={setProfileAddressId}
                                    onRegionChangeAction={handleRegionChange}
                                    profileAddressId={profileAddressId}
                                    regionId={regionId}
                                    regions={regions}
                                    userAddresses={userAddresses}
                                />
                            </div>
                        </section>

                        <div className="grid gap-5">
                            <section
                                className="rounded-[32px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-6 shadow-[var(--shadow-card)] sm:p-7">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-[var(--accent)]" size={20}/>
                                    <p className="text-[1.35rem] font-black text-[var(--brand-deep)]">Характеристики</p>
                                </div>
                                <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                                    Заполните характеристики — это поможет покупателям лучше найти ваше объявление.
                                </p>
                                <div className="mt-5">
                                    {hasLeafCategory ? (
                                        <AttributeFields
                                            attributeValues={attributeValues}
                                            groupedAttributes={groupedAttributes}
                                            isLoading={isLoadingBranch || isLoadingAttributes}
                                            onAttributeChangeAction={handleAttributeChange}
                                            onMultiselectChangeAction={handleMultiselectChange}
                                        />
                                    ) : (
                                        <InlineHint
                                            text="Сначала выберите категорию и подкатегорию, чтобы загрузить характеристики."/>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>

                    <section
                        className="rounded-[32px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-6 shadow-[var(--shadow-card)] sm:p-7">
                                <p className="text-[1.35rem] font-black text-[var(--brand-deep)]">Фотографии</p>
                                <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                                    Добавьте фотографии товара. Чем больше фото — тем выше шанс быстрой продажи.
                                </p>
                                <div className="mt-5">
                                    <ListingImageUploader
                                        existingMedia={existingMedia}
                                        files={imageFiles}
                                        isDisabled={isFormBusy}
                                        onDeleteExistingAction={handleDeleteExistingMedia}
                                        onChangeAction={setImageFiles}
                                        onReorderExistingAction={handleReorderExistingMedia}
                                        onSetMainExistingAction={handleSetMainExistingMedia}
                                    />
                                </div>
                    </section>

                    <div className="flex justify-end">
                        <div className="grid w-full max-w-[560px] gap-3 sm:grid-cols-2">
                        <button
                            aria-label="Сохранить как черновик"
                            className="
      inline-flex h-10 w-full items-center justify-center gap-2.5
      rounded-2xl
      border border-[var(--border-soft)]
      bg-[var(--surface)]
      px-4
      text-sm font-semibold
      text-[var(--brand-deep)]
      transition duration-200
      hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]
    "
                            disabled={isFormBusy}
                            onClick={() => submitForm(true)}
                            type="button"
                        >
    <span className="grid size-8 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--brand-deep)]">
      <Save size={16}/>
    </span>

                            <span>Сохранить</span>
                        </button>

                        <button
                            aria-label="Отправить на проверку"
                            className="
      inline-flex h-10 w-full items-center justify-center gap-2.5
      rounded-2xl
      bg-[linear-gradient(135deg,var(--accent),color-mix(in_srgb,var(--accent)_78%,var(--brand)))]
      px-4
      text-sm font-semibold
      text-[var(--active-button-text)]
      shadow-[var(--shadow-card)]
      transition duration-200
      hover:-translate-y-0.5 hover:brightness-105
      disabled:opacity-60
    "
                            disabled={isFormBusy}
                            onClick={() => submitForm(false)}
                            type="button"
                        >
                            <span className="grid size-8 place-items-center rounded-xl bg-white/12">
                                <ChevronRight size={16}/>
                            </span>
                            <span>Отправить на проверку</span>
                        </button>
                        </div>
                    </div>

                    {mediaRetryListingId !== null ? (
                        <div className="rounded-[24px] border border-[var(--danger-soft)] bg-[var(--danger-soft)] p-4">
                            <ListingSubmitActions
                                isDisabled={isFormBusy}
                                isSubmitting={isSubmitting}
                                isUploadingMedia={isUploadingMedia}
                                mediaRetryListingId={mediaRetryListingId}
                                mode="create"
                                onRetryMediaUploadAction={retryMediaUpload}
                                onSubmitAction={submitForm}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function EditListingWorkbench({
                                  state,
                              }: {
    initialListing?: ListingItem;
    state: ReturnType<typeof useListingFormState>;
}) {
    const {
        activeType,
        attributeValues,
        branchOptions,
        condition,
        effectiveSelectedCategoryId,
        effectiveSelectedRootId,
        filteredRoots,
        form,
        groupedAttributes,
        handleDeleteExistingMedia,
        handleAttributeChange,
        handleCategoryChange,
        handleMultiselectChange,
        handleReorderExistingMedia,
        handleRootChange,
        handleSetMainExistingMedia,
        handleTypeChange,
        existingMedia,
        imageFiles,
        isFormBusy,
        isLoadingAttributes,
        isLoadingBranch,
        isLoadingRoots,
        isNegotiable,
        isSubmitting,
        isUploadingMedia,
        mediaRetryListingId,
        retryMediaUpload,
        addressLine,
        addressMode,
        cities,
        cityId,
        handleAddressModeChange,
        handleRegionChange,
        isLoadingCities,
        isLoadingRegions,
        profileAddressId,
        regionId,
        regions,
        setAddressLine,
        setCityId,
        setProfileAddressId,
        setCondition,
        setImageFiles,
        setIsNegotiable,
        submitForm,
        userAddresses,
    } = state;
    const {
        formState: {errors},
        register,
    } = form;
    const hasLeafCategory = effectiveSelectedCategoryId !== null;

    return (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
            <section className="surface-card rounded-[30px] p-6 sm:p-7">
                <div className="flex items-center gap-3">
                    <div
                        className="grid size-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--brand-deep)]">
                        <Settings2 size={21}/>
                    </div>
                    <div>
                        <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">
                            Редактирование объявления
                        </h2>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Рабочий режим редактирования с характеристиками по выбранной категории.
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-6">
                    <CategoryPicker
                        activeType={activeType}
                        branchOptions={branchOptions}
                        effectiveSelectedCategoryId={effectiveSelectedCategoryId}
                        effectiveSelectedRootId={effectiveSelectedRootId}
                        filteredRoots={filteredRoots}
                        isLoadingBranch={isLoadingBranch}
                        isLoadingRoots={isLoadingRoots}
                        onCategoryChangeAction={handleCategoryChange}
                        onRootChangeAction={handleRootChange}
                        onTypeChangeAction={handleTypeChange}
                    />

                    <ListingFormField error={errors.title?.message} label="Заголовок">
                        <Input placeholder="Например, Шкаф из массива дуба" {...register("title")} />
                    </ListingFormField>

                    <ListingFormField error={errors.description?.message} label="Описание">
            <textarea
                className="min-h-36 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
                placeholder="Опишите состояние, особенности, комплектацию и условия сделки."
                {...register("description")}
            />
                    </ListingFormField>

                    <ListingImageUploader
                        existingMedia={existingMedia}
                        files={imageFiles}
                        isDisabled={isFormBusy}
                        onDeleteExistingAction={handleDeleteExistingMedia}
                        onChangeAction={setImageFiles}
                        onReorderExistingAction={handleReorderExistingMedia}
                        onSetMainExistingAction={handleSetMainExistingMedia}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                        <ListingFormField error={errors.price?.message} label="Цена">
                            <Input inputMode="numeric" placeholder="12500" {...register("price")} />
                        </ListingFormField>

                        <ListingFormField error={errors.currency?.message} label="Валюта">
                            <Input maxLength={3} placeholder="RUB" {...register("currency")} />
                        </ListingFormField>
                    </div>

                    {activeType === LISTING_TYPE_PRODUCT ? (
                        <ListingFormField label="Состояние товара">
                            <ListingFormSelect onChangeAction={(value) => setCondition(Number(value))} value={condition}>
                                {conditionOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </ListingFormSelect>
                        </ListingFormField>
                    ) : null}

                    <label
                        className="flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3">
                        <Checkbox checked={isNegotiable}
                                  onCheckedChange={(checked) => setIsNegotiable(Boolean(checked))}/>
                        <span className="text-sm font-semibold text-[var(--brand-deep)]">
              Разрешить торг и обсуждение финальной цены
            </span>
                    </label>

                    <AddressSection
                        addressLine={addressLine}
                        addressMode={addressMode}
                        cities={cities}
                        cityId={cityId}
                        isLoadingCities={isLoadingCities}
                        isLoadingRegions={isLoadingRegions}
                        onAddressLineChangeAction={setAddressLine}
                        onAddressModeChangeAction={handleAddressModeChange}
                        onCityChangeAction={setCityId}
                        onProfileAddressChangeAction={setProfileAddressId}
                        onRegionChangeAction={handleRegionChange}
                        profileAddressId={profileAddressId}
                        regionId={regionId}
                        regions={regions}
                        userAddresses={userAddresses}
                    />
                </div>
            </section>

            <aside className="surface-card rounded-[30px] p-6 sm:p-7">
                <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">Характеристики</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                    Дополнительные поля подтягиваются из выбранной категории.
                </p>

                {hasLeafCategory ? (
                    <AttributeFields
                        attributeValues={attributeValues}
                        groupedAttributes={groupedAttributes}
                        isLoading={isLoadingBranch || isLoadingAttributes}
                        onAttributeChangeAction={handleAttributeChange}
                        onMultiselectChangeAction={handleMultiselectChange}
                    />
                ) : (
                    <InlineHint text="Сначала выберите категорию и подкатегорию, чтобы загрузить характеристики."/>
                )}

                <ListingSubmitActions
                    isDisabled={isFormBusy}
                    isSubmitting={isSubmitting}
                    isUploadingMedia={isUploadingMedia}
                    mediaRetryListingId={mediaRetryListingId}
                    mode="edit"
                    onRetryMediaUploadAction={retryMediaUpload}
                    onSubmitAction={submitForm}
                />
            </aside>
        </div>
    );
}

function InlineHint({text}: { text: string }) {
    return (
        <div
            className="rounded-[24px] border border-dashed border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-5">
            <div className="flex items-center gap-4">
                <div
                    className="grid size-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--text-muted)]">
                    <Settings2 size={18}/>
                </div>
                <p className="text-sm leading-7 text-[var(--text-muted)]">{text}</p>
            </div>
        </div>
    );
}

type AddressSectionProps = {
    addressLine: string;
    addressMode: ListingAddressMode;
    cities: Array<{ id: number; name: string; label: string }>;
    cityId: number | null;
    isLoadingCities: boolean;
    isLoadingRegions: boolean;
    onAddressLineChangeAction: (value: string) => void;
    onAddressModeChangeAction: (mode: ListingAddressMode) => void;
    onCityChangeAction: (cityId: number | null) => void;
    onProfileAddressChangeAction: (addressId: string | null) => void;
    onRegionChangeAction: (regionId: number | null) => void;
    profileAddressId: string | null;
    regionId: number | null;
    regions: Array<{ id: number; name: string; fullName: string; label: string }>;
    userAddresses: UserAddress[];
};

function AddressSection({
                            addressLine,
                            addressMode,
                            cities,
                            cityId,
                            isLoadingCities,
                            isLoadingRegions,
                            onAddressLineChangeAction,
                            onAddressModeChangeAction,
                            onCityChangeAction,
                            onProfileAddressChangeAction,
                            onRegionChangeAction,
                            profileAddressId,
                            regionId,
                            regions,
                            userAddresses,
                        }: AddressSectionProps) {
    return (
        <div className="border-t border-[var(--border-soft)] pt-6">
            <div className="flex items-center gap-3">
                <MapPin className="text-[var(--accent)]" size={20}/>
                <p className="text-[1.35rem] font-black text-[var(--brand-deep)]">Адрес объявления</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Адрес сохранится в объявлении как snapshot. Если потом изменить профиль, уже созданное объявление не переедет само.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
                <AddressModeButton
                    description="Быстрее всего, если адрес уже добавлен в профиле."
                    isActive={addressMode === "profile"}
                    label="Из профиля"
                    onClickAction={() => onAddressModeChangeAction("profile")}
                />
                <AddressModeButton
                    description="Регион, город и строка адреса только для этого объявления."
                    isActive={addressMode === "custom"}
                    label="Другой адрес"
                    onClickAction={() => onAddressModeChangeAction("custom")}
                />
                <AddressModeButton
                    description="Можно оставить для черновика или если место не важно."
                    isActive={addressMode === "none"}
                    label="Не указывать"
                    onClickAction={() => onAddressModeChangeAction("none")}
                />
            </div>

            {addressMode === "profile" ? (
                <div className="mt-5">
                    {userAddresses.length > 0 ? (
                        <ListingFormField label="Адрес из профиля">
                            <ListingFormSelect
                                onChangeAction={(value) => onProfileAddressChangeAction(value || null)}
                                value={profileAddressId ?? ""}
                            >
                                <option value="">Выберите адрес</option>
                                {userAddresses.map((address) => (
                                    <option key={address.id} value={address.id}>
                                        {formatUserAddress(address)}
                                    </option>
                                ))}
                            </ListingFormSelect>
                        </ListingFormField>
                    ) : (
                        <InlineHint text="В профиле пока нет сохранённых адресов. Выберите «Другой адрес» и укажите место вручную."/>
                    )}
                </div>
            ) : null}

            {addressMode === "custom" ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <ListingFormField label="Регион">
                        <ListingFormSelect
                            disabled={isLoadingRegions}
                            onChangeAction={(value) => onRegionChangeAction(value === "" ? null : Number(value))}
                            value={regionId ?? ""}
                        >
                            <option value="">{isLoadingRegions ? "Загружаем регионы..." : "Выберите регион"}</option>
                            {regions.map((region) => (
                                <option key={region.id} value={region.id}>
                                    {region.fullName || region.name}
                                </option>
                            ))}
                        </ListingFormSelect>
                    </ListingFormField>

                    <ListingFormField label="Город">
                        <ListingFormSelect
                            disabled={regionId === null || isLoadingCities}
                            onChangeAction={(value) => onCityChangeAction(value === "" ? null : Number(value))}
                            value={cityId ?? ""}
                        >
                            <option value="">
                                {regionId === null
                                    ? "Сначала выберите регион"
                                    : (isLoadingCities ? "Загружаем города..." : "Выберите город")}
                            </option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </ListingFormSelect>
                    </ListingFormField>

                    <div className="md:col-span-2">
                        <ListingFormField label="Улица, дом или ориентир">
                            <Input
                                maxLength={255}
                                onChange={(event) => onAddressLineChangeAction(event.target.value)}
                                placeholder="Например, Проспект Октября, 10"
                                value={addressLine}
                            />
                        </ListingFormField>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function AddressModeButton({
                               description,
                               isActive,
                               label,
                               onClickAction,
                           }: {
    description: string;
    isActive: boolean;
    label: string;
    onClickAction: () => void;
}) {
    return (
        <button
            className={[
                "rounded-2xl border px-4 py-4 text-left transition hover:-translate-y-0.5",
                isActive
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--brand-deep)] shadow-[var(--shadow-card)]"
                    : "border-[var(--border-soft)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--accent)]",
            ].join(" ")}
            onClick={onClickAction}
            type="button"
        >
            <span className="text-sm font-black text-[var(--brand-deep)]">{label}</span>
            <span className="mt-2 block text-xs leading-5">{description}</span>
        </button>
    );
}

function formatUserAddress(address: UserAddress): string {
    return [
        address.label,
        address.city?.name,
        address.addressLine,
    ].filter(Boolean).join(" · ") || address.region.name;
}
