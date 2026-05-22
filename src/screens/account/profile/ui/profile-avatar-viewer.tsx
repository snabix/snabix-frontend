import type { PointerEvent as ReactPointerEvent } from "react";
import { Camera, Move, X, ZoomIn } from "lucide-react";
import type {
  AvatarDraft,
  AvatarOffset,
} from "@/src/features/profile";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Slider } from "@/src/shared/ui/shadcn/slider";

type ProfileAvatarViewerProps = {
  avatarDraft: AvatarDraft | null;
  avatarOffset: AvatarOffset;
  avatarScale: number;
  avatarUrl?: string | null;
  isAvatarSubmitting: boolean;
  onAvatarDraftReset: () => void;
  onAvatarMovePointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onAvatarSave: () => void;
  onAvatarScaleChange: (value: number[]) => void;
  onAvatarSelect: () => void;
  onAvatarViewerClose: () => void;
};

export function ProfileAvatarViewer({
  avatarDraft,
  avatarOffset,
  avatarScale,
  avatarUrl,
  isAvatarSubmitting,
  onAvatarDraftReset,
  onAvatarMovePointerDown,
  onAvatarSave,
  onAvatarScaleChange,
  onAvatarSelect,
  onAvatarViewerClose,
}: ProfileAvatarViewerProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid bg-[color-mix(in_srgb,var(--brand)_82%,transparent)] px-4 py-5 text-[var(--brand-deep)] backdrop-blur-md sm:px-6"
      onClick={onAvatarViewerClose}
    >
      <div
        className="mx-auto my-auto grid w-full max-w-6xl gap-5 rounded-[36px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] p-4 shadow-[var(--shadow-soft)] sm:p-6 lg:grid-cols-[minmax(0,1.2fr)_380px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-[30px] border border-[var(--border-soft)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface)_90%,transparent),color-mix(in_srgb,var(--accent-soft)_70%,transparent))] p-5 sm:p-8">
          <button
            aria-label="Закрыть просмотр аватара"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] text-[var(--brand-deep)] transition-colors hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            onClick={onAvatarViewerClose}
            type="button"
          >
            <X aria-hidden="true" size={20} />
          </button>

          <div className="flex min-h-[360px] items-center justify-center sm:min-h-[540px]">
            {avatarDraft ? (
              <div className="relative grid size-[min(76vw,480px)] place-items-center overflow-hidden rounded-[38px] bg-[linear-gradient(160deg,var(--brand),color-mix(in_srgb,var(--brand)_84%,var(--foreground)))] shadow-[var(--shadow-soft)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0_58%,color-mix(in_srgb,var(--brand)_58%,transparent)_58.4%_100%)]" />

                <div
                  className="relative grid size-[min(68vw,360px)] cursor-grab touch-none place-items-center overflow-hidden rounded-full bg-[var(--brand)] active:cursor-grabbing"
                  onPointerDown={onAvatarMovePointerDown}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Предпросмотр нового аватара"
                    className="pointer-events-none h-full w-full select-none object-cover"
                    src={avatarDraft.previewUrl}
                    style={{
                      transform: `translate(${avatarOffset.x}px, ${avatarOffset.y}px) scale(${avatarScale})`,
                    }}
                  />

                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full ring-2 ring-[color-mix(in_srgb,var(--foreground)_92%,transparent)]">
                    <span className="absolute bottom-0 left-1/3 top-0 w-px bg-[color-mix(in_srgb,var(--foreground)_48%,transparent)]" />
                    <span className="absolute bottom-0 left-2/3 top-0 w-px bg-[color-mix(in_srgb,var(--foreground)_48%,transparent)]" />
                    <span className="absolute left-0 right-0 top-1/3 h-px bg-[color-mix(in_srgb,var(--foreground)_48%,transparent)]" />
                    <span className="absolute left-0 right-0 top-2/3 h-px bg-[color-mix(in_srgb,var(--foreground)_48%,transparent)]" />
                  </div>
                </div>
              </div>
            ) : avatarUrl ? (
              <div className="overflow-hidden rounded-[32px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] p-4 shadow-[var(--shadow-soft)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Аватар пользователя"
                  className="max-h-[76vh] max-w-[94vw] rounded-[24px] object-contain"
                  src={avatarUrl}
                />
              </div>
            ) : (
              <button
                className="grid size-[min(72vw,300px)] place-items-center rounded-[38px] border border-dashed border-[var(--border-strong)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] text-[var(--accent)] shadow-[var(--shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                onClick={onAvatarSelect}
                type="button"
              >
                <Camera aria-hidden="true" size={68} />
              </button>
            )}
          </div>
        </div>

        <div className="surface-card flex h-full flex-col rounded-[30px] border border-[var(--border-soft)] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Camera aria-hidden="true" size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Аватар профиля
              </p>
              <h3 className="font-heading mt-1 text-2xl font-extrabold text-[var(--brand-deep)]">
                {avatarDraft ? "Редактор аватара" : "Просмотр аватара"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                {avatarDraft
                  ? "Подберите кадр, выставьте масштаб и сразу сохраните результат."
                  : "Можно открыть текущий аватар или загрузить новое изображение для профиля."}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="rounded-[22px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Move aria-hidden="true" size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--brand-deep)]">
                    Позиционирование
                  </p>
                  <p className="text-sm leading-6 text-[var(--text-muted)]">
                    Перетаскивайте изображение внутри круга, чтобы выбрать лучший ракурс.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <ZoomIn aria-hidden="true" size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--brand-deep)]">
                    Масштаб
                  </p>
                  <p className="text-sm leading-6 text-[var(--text-muted)]">
                    {avatarDraft
                      ? `Текущий масштаб ${Math.round(avatarScale * 100)}%.`
                      : "После загрузки изображения здесь появятся инструменты редактирования."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {avatarDraft ? (
            <div className="mt-6 rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-bold text-[var(--brand-deep)]">
                  Приближение
                </p>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold text-[var(--accent)]">
                  {Math.round(avatarScale * 100)}%
                </span>
              </div>

              <Slider
                className="mt-5"
                max={2.4}
                min={1}
                onValueChange={onAvatarScaleChange}
                step={0.01}
                value={[avatarScale]}
              />
            </div>
          ) : null}

          <div className="mt-auto flex flex-col gap-3 pt-6">
            {avatarDraft ? (
              <>
                <Button
                  className="w-full"
                  disabled={isAvatarSubmitting}
                  onClick={onAvatarSave}
                  type="button"
                >
                  {isAvatarSubmitting ? "Сохраняем..." : "Сохранить аватар"}
                </Button>

                <Button
                  className="w-full"
                  disabled={isAvatarSubmitting}
                  onClick={onAvatarDraftReset}
                  type="button"
                  variant="secondary"
                >
                  Сбросить выбор
                </Button>
              </>
            ) : (
              <Button
                className="w-full"
                onClick={onAvatarSelect}
                type="button"
              >
                Загрузить новое изображение
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
